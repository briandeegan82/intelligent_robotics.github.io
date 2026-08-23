---
layout: single
title: "Camera–IMU Calibration with Kalibr and ROS Bags"
date: 2025-06-02
permalink: /tutorials/calibration/2025/06/02/camera-imu-calibration/
categories:
  - tutorials
  - calibration
tags: [kalibr, ros, camera, imu, extrinsic-calibration]
thumbnail: /_images/tutorials/2025-06-02-camera_imu_calibration.png
thumbnail_source: ethz-asl/kalibr
---

# Camera–IMU Calibration with Kalibr and ROS Bags

## Overview

This guide walks through calibrating a camera (or multi-camera rig) against an IMU using [Kalibr](https://github.com/ethz-asl/kalibr) and pre-recorded ROS bag files. The process has three stages:

1. Intrinsic camera calibration
2. Camera–camera extrinsic calibration (if using multiple cameras)
3. Camera–IMU extrinsic and temporal calibration

---

## Prerequisites

### Software

- ROS (Noetic or Melodic recommended)
- Kalibr installed from source or via Docker
- `rosbag`, `rostopic`, `rqt_bag` available on your PATH
- Python 3 with `bagpy`, `numpy`, and `matplotlib` (optional, for inspection)

### Hardware assumptions

- Camera(s) publishing to `/cam0/image_raw`, `/cam1/image_raw`, etc.
- IMU publishing to `/imu0` with message type `sensor_msgs/Imu`
- A printed **Aprilgrid** or **checkerboard** calibration target

### Install Kalibr (if not already installed)

```bash
# From source (inside a catkin workspace)
cd ~/catkin_ws/src
git clone https://github.com/ethz-asl/kalibr.git
cd ~/catkin_ws
catkin build kalibr
source devel/setup.bash
```

---

## Step 1 — Prepare the Calibration Target

Kalibr works best with an **Aprilgrid** target. Generate a target PDF and print it on a rigid, flat surface.

```bash
kalibr_create_target_pdf --type apriltag \
  --nx 6 --ny 6 \
  --tsize 0.088 \
  --tspace 0.3
```

Create a matching YAML description file (`target.yaml`):

```yaml
target_type: 'aprilgrid'
tagCols:        6
tagRows:        6
tagSize:        0.088        # metres — measure your printed target
tagSpacing:     0.3          # fraction of tagSize
```

> **Tip:** Measure the printed tag size with calipers. Even a 1 mm error here propagates into your intrinsics.

---

## Step 2 — Record ROS Bags

### 2a — Camera intrinsics bag

Move the target slowly in front of each camera, covering all regions of the frame and a variety of tilts. Keep motion smooth — avoid motion blur.

```bash
rosbag record -O camera_intrinsics.bag \
  /cam0/image_raw \
  /cam1/image_raw          # add further cameras as needed
```

**Recording checklist:**

- [ ] 3–5 minutes of footage
- [ ] Target fills at least 30% of the frame at some point
- [ ] Target appears near all four corners and the centre
- [ ] Frame rate ≥ 10 Hz; no dropped frames

### 2b — Camera–IMU calibration bag

This bag requires *both* camera and IMU data recorded simultaneously while the sensor rig is moved **with deliberate excitation**.

```bash
rosbag record -O camera_imu.bag \
  /cam0/image_raw \
  /cam1/image_raw \
  /imu0
```

**Motion excitation pattern (critical for good IMU calibration):**

Excite all six degrees of freedom in sequence. For each axis:

1. Rotate ±30° around X, then back to neutral
2. Rotate ±30° around Y, then back to neutral
3. Rotate ±30° around Z, then back to neutral
4. Translate along X (±20 cm)
5. Translate along Y (±20 cm)
6. Translate along Z (±20 cm)

Repeat the full sequence 3–5 times over 3–5 minutes total. Keep the calibration target **fully visible** throughout.

> **Warning:** Do not move too fast — motion blur will cause detection failures. Do not move too slowly — insufficient IMU excitation leads to poor observability of the gyroscope and accelerometer biases.

---

## Step 3 — Inspect the Bags

Before running calibration, verify topic rates and time alignment:

```bash
rosbag info camera_imu.bag
```

Check that:

- `/imu0` publishes at ≥ 200 Hz (100 Hz minimum)
- `/cam0/image_raw` publishes at 10–30 Hz
- Timestamps overlap — both topics must be active for the full recording

```bash
# Spot-check image quality
rqt_bag camera_imu.bag
```

---

## Step 4 — Camera Intrinsic Calibration

Create a camera configuration file (`cameras.yaml`) describing your lens model:

```yaml
cam0:
  camera_model: pinhole
  intrinsics: [461.629, 460.152, 362.680, 246.049]   # fx fy cx cy — placeholder
  distortion_model: radtan
  distortion_coeffs: [-0.27695497, 0.06712476, 0.00087955, 0.00011556]  # placeholder
  resolution: [752, 480]
  rostopic: /cam0/image_raw
```

Run the camera calibration:

```bash
kalibr_calibrate_cameras \
  --bag camera_intrinsics.bag \
  --topics /cam0/image_raw \
  --models pinhole-radtan \
  --target target.yaml \
  --show-extraction          # optional: visualise corner detections
```

**Outputs:**

| File | Contents |
|---|---|
| `camchain.yaml` | Intrinsics + extrinsics between cameras |
| `results-cam-*.txt` | Reprojection error report |
| `*.pdf` | Visualisation plots |

**Acceptance criteria:**

- Mean reprojection error < 0.5 px
- No systematic pattern in the residual plots

If the reprojection error is high, re-record with more coverage of the image corners, or check that the target YAML dimensions match the physical print.

---

## Step 5 — IMU Noise Variance Calculation with `allan_variance_ros`

Before running the camera–IMU calibrator, Kalibr needs four IMU noise parameters:

| Parameter | Symbol | Units |
|---|---|---|
| Accelerometer noise density (VRW) | `accelerometer_noise_density` | m/s/√s |
| Accelerometer random walk | `accelerometer_random_walk` | m/s²/√s |
| Gyroscope noise density (ARW) | `gyroscope_noise_density` | rad/s/√s |
| Gyroscope random walk | `gyroscope_random_walk` | rad/s²/√s |

[`allan_variance_ros`](https://github.com/ori-drs/allan_variance_ros) computes these directly from a long static rosbag and outputs a ready-to-use `imu.yaml` for Kalibr.

### 5a — Install `allan_variance_ros`

```bash
cd ~/catkin_ws/src
git clone https://github.com/ori-drs/allan_variance_ros.git
cd ~/catkin_ws
catkin build allan_variance_ros
source devel/setup.bash
```

> Designed for **Ubuntu 20.04 + ROS Noetic**. For other distros, use the provided devcontainer — see the [devcontainer README](https://github.com/ori-drs/allan_variance_ros/blob/master/.devcontainer/README.md).

### 5b — Record a static IMU bag

Place the IMU on a damped, vibration-isolated surface (e.g. foam pad on a heavy table). The sensor must remain completely stationary for the entire recording.

```bash
rosbag record -O imu_static.bag /imu0
```

> **Minimum duration: 3 hours.** Longer recordings yield more accurate estimates — particularly for bias instability and random walk terms, which only become visible at long averaging times on the Allan deviation curve.

### 5c — Pre-process the bag (recommended)

ROS message timestamps can be out of order in the bag index. Re-sort them before processing:

```bash
rosrun allan_variance_ros cookbag.py \
  --input imu_static.bag \
  --output imu_static_cooked.bag
```

### 5d — Create a config file

Create `config/imu.yaml` describing your IMU topic and rate:

```yaml
imu_topic: '/imu0'
imu_rate: 200          # Hz — match your actual IMU publish rate
measure_rate: 200      # Hz — rate at which to sample from the bag
sequence_time: 0       # 0 = use full bag length
```

Example config files for common sensors (Realsense D435i, etc.) are provided in `allan_variance_ros/config/`.

### 5e — Compute Allan variance

Make sure `roscore` is running, then:

```bash
roscore &

rosrun allan_variance_ros allan_variance \
  /path/to/folder/containing/bag \
  /path/to/config/imu.yaml
```

The tool reads the bag at maximum speed (no real-time playback needed) and writes `allan_variance.csv` to the current directory.

### 5f — Analyse the results and generate `imu.yaml`

```bash
rosrun allan_variance_ros analysis.py \
  --data allan_variance.csv \
  --config config/imu.yaml
```

Press `Space` to step through the output figures:

1. **Accelerometer Allan deviation** — shows VRW (slope −½), bias instability (flat region), and accel random walk (slope +½)
2. **Gyroscope Allan deviation** — shows ARW, bias instability, and rate random walk

The script prints the extracted parameters and writes `imu.yaml` automatically:

```
ACCELEROMETER:
X Velocity Random Walk:  0.00333 m/s/sqrt(s)
X Bias Instability:      0.00055 m/s^2
X Accel Random Walk:     0.00008 m/s^2/sqrt(s)
...
GYROSCOPE:
X Angle Random Walk:     0.00787 deg/sqrt(s)
X Bias Instability:      0.00049 deg/s
X Rate Random Walk:      0.00007 deg/s/sqrt(s)
...
```

**Generated `imu.yaml` (Kalibr-ready):**

```yaml
#Accelerometer
accelerometer_noise_density: 1.86e-03   # VRW — noise density
accelerometer_random_walk:   4.33e-04   # accel random walk

#Gyroscope
gyroscope_noise_density:     1.87e-04   # ARW — noise density
gyroscope_random_walk:       2.66e-05   # rate random walk

rostopic: '/imu0'        # verify this matches your setup
update_rate: 200.0       # verify this matches your IMU rate
```

> **Sanity check:** Compare the values against the IMU datasheet. Noise density should be in the same order of magnitude. If the values are wildly different, the recording was too short, the sensor was not stationary, or the topic name / rate is wrong in the config.

### 5g — Verify with a simulated bag (optional)

`allan_variance_ros` ships an IMU noise simulator to validate the pipeline end-to-end:

```bash
# Generate a simulated IMU bag from known noise parameters
rosrun allan_variance_ros imu_simulator \
  /tmp/simulated_imu.bag \
  config/simulation/imu_simulator.yaml

# Run Allan variance on simulated data and compare recovered vs. known params
rosrun allan_variance_ros allan_variance /tmp config/sim.yaml
rosrun allan_variance_ros analysis.py --data allan_variance.csv
```

---

## Step 6 — Camera–IMU Calibration

### 6a — Run the camera–IMU calibrator

```bash
kalibr_calibrate_imu_camera \
  --bag camera_imu.bag \
  --cam camchain.yaml \
  --imu imu.yaml \
  --target target.yaml \
  --time-calibration          # estimate camera–IMU time offset
```

> Add `--show-extraction` to see Aprilgrid detections frame by frame during processing.

**Outputs:**

| File | Contents |
|---|---|
| `camchain-imucam.yaml` | Camera intrinsics + T_cam_imu extrinsics |
| `imu-results-*.yaml` | Refined IMU noise parameters |
| `results-imucam-*.txt` | Full calibration report with uncertainties |
| `*.pdf` | Trajectory, residual, and spline plots |

---

## Step 7 — Validate the Results

### Check the report

Open `results-imucam-*.txt` and confirm:

- **Reprojection error** < 1.0 px (ideally < 0.5 px)
- **Time offset** `t_cam_imu` has a small uncertainty (< 1 ms)
- **Translation and rotation** uncertainties are small relative to the estimated values

### Inspect the PDF plots

- The spline fit should follow the IMU-integrated trajectory closely
- Residuals should be zero-mean with no visible drift

### Sanity-check the extrinsic transform

The `T_cam_imu` transform (4×4 homogeneous matrix) should match your physical sensor rig geometry within a few millimetres and a few degrees.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Few or no Aprilgrid detections | Motion blur, poor lighting, wrong target YAML | Slow down motion; verify `tagSize` matches print |
| High reprojection error (> 1 px) | Insufficient target coverage | Re-record with target at corners and edges |
| IMU calibration does not converge | Insufficient excitation | Include more aggressive rotations in all axes |
| Large time-offset uncertainty | Low camera frame rate or IMU rate | Use ≥ 20 Hz camera, ≥ 200 Hz IMU |
| `camchain.yaml` has large covariance | Too few frames or poor lighting | Add more frames, improve illumination |

---

## Quick-Reference Command Cheatsheet

```bash
# 1. Generate target PDF
kalibr_create_target_pdf --type apriltag --nx 6 --ny 6 --tsize 0.088 --tspace 0.3

# 2. Calibrate camera intrinsics
kalibr_calibrate_cameras \
  --bag camera_intrinsics.bag \
  --topics /cam0/image_raw \
  --models pinhole-radtan \
  --target target.yaml

# 3. Cook the static IMU bag (fix timestamp ordering)
rosrun allan_variance_ros cookbag.py --input imu_static.bag --output imu_static_cooked.bag

# 4. Compute Allan variance (roscore must be running)
rosrun allan_variance_ros allan_variance /path/to/bag/folder config/imu.yaml

# 5. Extract noise parameters → produces imu.yaml
rosrun allan_variance_ros analysis.py --data allan_variance.csv --config config/imu.yaml

# 7. Calibrate camera–IMU
kalibr_calibrate_imu_camera \
  --bag camera_imu.bag \
  --cam camchain.yaml \
  --imu imu.yaml \
  --target target.yaml \
  --time-calibration
```

---

## Further Reading

- [Kalibr Wiki](https://github.com/ethz-asl/kalibr/wiki)
- [allan\_variance\_ros — ori-drs/allan\_variance\_ros](https://github.com/ori-drs/allan_variance_ros)
- [Kalibr IMU Noise Model documentation](https://github.com/ethz-asl/kalibr/wiki/IMU-Noise-Model)
- [Furgale et al., *Unified Temporal and Spatial Calibration for Multi-Sensor Systems*, IROS 2013](https://doi.org/10.1109/IROS.2013.6696514)
- [Trawny & Roumeliotis, *Indirect Kalman Filter for 3D Attitude Estimation*](http://mars.cs.umn.edu/tr/reports/Trawny05b.pdf)
- [ROS `rosbag` documentation](https://wiki.ros.org/rosbag)
- [OpenVINS calibration documentation](https://docs.openvins.com/gs-calibration.html)
- [OpenVINS youtube tutorial](https://www.youtube.com/watch?v=BtzmsuJemgI)