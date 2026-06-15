---
layout: post
title: "RTAB-Map Setup on RB3"
date: 2025-06-13
categories: robotics perception
tags: [rtab-map, slam, rb3, mapping, localization]
---

# Host Requirements

On the RB3 host install:
```bash
sudo apt update
sudo apt install -y \
    docker.io \
    docker-compose \
    git \
    usbutils
```
Enable Docker:
```bash
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

Log out and back in.

# Verify OAK-D Lite Detection

Plug in the camera.

Check detection:
```bash
lsusb
```
You should see something similar to:
```bash
Luxonis Device
```
Also verify USB permissions:
```bash
sudo chmod 666 /dev/bus/usb/*/*
```

For permanent udev rules:
```bash
sudo tee /etc/udev/rules.d/80-movidius.rules <<EOF
SUBSYSTEM=="usb", ATTRS{idVendor}=="03e7", MODE="0666"
EOF

sudo udevadm control --reload-rules
sudo udevadm trigger
```

# Workspace Layout

Create a workspace:
```bash
mkdir -p ~/rb3_oakd_ws
cd ~/rb3_oakd_ws
```
Create/import:

rb3_oakd_ws/
├── docker-compose.yml
├── Dockerfile
└── ros_entrypoint.sh
4. Dockerfile

# Build container
## optional - add swap space
he RB3 commonly hangs or appears frozen during colcon build because:

RAM is limited
Docker memory pressure becomes severe
colcon parallel compilation exhausts CPU/RAM
depthai_ros is heavy to compile on ARM

Before building, create swap space on the host.

Create 8 GB Swap File

On the RB3 host:
```bash
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```
Verify:
```bash
free -h
```
You should now see swap enabled.

Persist after reboot:
```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
## Reduce Colcon Parallelism

The default parallel build settings are usually too aggressive for RB3.

Replace this section in the Dockerfile:
```bash
RUN /bin/bash -c "source /opt/ros/humble/setup.bash && \
    colcon build --symlink-install"
```
with:
```bash
RUN /bin/bash -c "source /opt/ros/humble/setup.bash && \
    colcon build \
    --executor sequential \
    --parallel-workers 1 \
    --symlink-install"
```
This is MUCH slower but dramatically more stable.

# Start Container
```bash
docker compose up -d
```
Enter shell:
```bash
docker exec -it rb3_slam bash
```

# Launch OAK-D Lite Driver
Inside the container: 

```bash
source /opt/ros/humble/setup.bash
source /ros2_ws/install/setup.bash
```
Launch depthai_ros_driver

``` bash
ros2 launch depthai_ros_driver camera.launch.py     camera_model:=OAK-D-LITE     rectify_rgb:=false use_sim_time:=false     enable_imu:=true
```
Verify topics:
In a second window:
```bash
ros2 topic list
```
You should see topics like:
```bash
/rgb/image_raw
/stereo/image_raw
/stereo/depth
/imu
```
# Run RTAB-Map RGB-D SLAM
Open another shell:
```bash
docker exec -it rb3_slam bash
```
Run:
```bash
source /opt/ros/humble/setup.bash
source /ros2_ws/install/setup.bash
```
```bash
ros2 launch rtabmap_launch rtabmap.launch.py \
    rtabmap_viz:=true \
    rgb_topic:=/rgb/image_raw \
    depth_topic:=/stereo/depth \
    camera_info_topic:=/rgb/camera_info \
    imu_topic:=/imu \
    approx_sync:=true \
    wait_imu_to_init:=true \
    frame_id:=oak-d-base-frame
```
This enables:

- visual odometry
- loop closure
- RGB-D SLAM
- IMU fusion

# RViz Visualization

Run:
```bash
rviz2
```
Add:

- TF
- PointCloud2
- Map
- Path
- Odometry

Set fixed frame:

- map

# Saving Maps
RTAB-Map automatically stores data in:
```bash
~/.ros/rtabmap.db
```
Copy it out:
```bash
docker cp rb3_slam:/root/.ros/rtabmap.db .
```
# Recommended Performance Settings for RB3

The RB3 is resource constrained compared to desktop x86 systems.

Recommended:

Lower camera FPS
```bash
fps:=15
```
Lower RGB Resolution
```bash
rgb_i_width:=640
rgb_i_height:=400
```
Reduce RTAB-Map load
add:
```bash
Mem/IncrementalMemory:=true
RGBD/LinearUpdate:=0.05
RGBD/AngularUpdate:=0.05
Vis/MinInliers:=15
```

# Stereo VIO Mode
For pure stereo odometry:

## FIX THIS!!!
```bash
ros2 launch rtabmap_launch stereo_odometry.launch.py \
    left_image_topic:=/left/image_rect \
    right_image_topic:=/right/image_rect \
    left_camera_info_topic:=/left/camera_info \
    right_camera_info_topic:=/right/camera_info \
    imu_topic:=/imu
```

# Useful Debug Commands
Check TF tree
```bash
ros2 run tf2_tools view_frames
```
Camera FPS
```bash
ros2 topic hz /rgb/image_raw
```
Inspect odometry
```bash
ros2 topic echo /odom
```
RTAB-Map diagnostics
```bash
ros2 topic echo /rtabmap/info
```

# Common Problems
### USB bandwidth problems

Symptoms:

- dropped frames
- camera disconnects
- lag spikes

Fixes:

- use USB3 cable
- lower FPS
- lower resolution
- avoid USB hubs

### TF errors

Symptoms:
```bash
Could not transform from base_link to map
```
Fix:

Ensure:
```bash
map -> odom -> base_link -> camera
```
exists.

### SLAM drifts badly

Usually caused by:

- insufficient lighting
- low texture walls
- motion blur
- IMU not fused

The OAK-D Lite performs much better with:

- good indoor lighting
- slower motion
- IMU enabled

# RB3 Recommended architecture

OAK-D Lite
   ↓
depthai_ros
   ↓
RTAB-Map VIO
   ↓
RTAB-Map SLAM
   ↓
Nav2 / autonomy stack

# Optional Improvements

You can later add:

- Nav2
- wheel odometry fusion
- robot_localization EKF
- occupancy grid export
- loop closure tuning
- AprilTag localization
- GPU acceleration

# Recommended Next Step

After SLAM works:

- Add wheel odometry
- Fuse wheel + IMU + VIO using EKF
- Feed filtered odom into Nav2
- Save occupancy maps
- Add autonomous navigation

# References

RTAB-Map ROS package:

RTAB-Map ROS Repository

DepthAI ROS:

DepthAI ROS Driver

ROS RTAB-Map docs:

ROS RTAB-Map Documentation