---
layout: single
title: "Basalt VIO: Numerical Failure in Backsubstitution"
date: 2025-06-01
permalink: /tutorials/perception/2025/06/01/basalt-vio-numerical-failure/
categories:
  - tutorials
  - perception
tags: [visual-inertial-odometry, basalt, debugging, sensor-fusion]
thumbnail: /_images/tutorials/2025-06-01-basalt_vio_numerical_failure.png
thumbnail_source: VladyslavUsenko/basalt
---

# Basalt VIO: `Numerical failure in backsubstitution`

## What the error means

This error indicates that the Levenberg-Marquardt (or Gauss-Newton) solver inside Basalt's visual-inertial odometry pipeline has hit a **numerical singularity or near-singular condition** during the back-substitution step of solving the linearised system.

At each keyframe update, Basalt solves a large sparse linear system of the form:

```
H · Δx = b
```

where **H** is the Hessian (information matrix) built from IMU and visual (reprojection) residuals. Back-substitution is the final step of the factored solve (typically Cholesky or QR decomposition). If it fails, the matrix **H** is one of:

- **Singular** — rank-deficient, meaning the system is underdetermined
- **Near-singular** — poorly conditioned, causing floating-point breakdown
- **Not positive-definite** — which breaks Cholesky factorization

---

## Common causes

| Cause | Why it triggers this error |
|---|---|
| **Poor or degenerate motion** | Pure rotation or no motion → scale unobservable → H becomes rank-deficient |
| **Bad calibration** (camera–IMU extrinsics or intrinsics) | Residuals are inconsistent, pushing H toward singularity |
| **IMU data gaps or dropouts** | Missing preintegration data → under-constrained IMU factor |
| **Incorrect IMU noise parameters** | Severely wrong `accel_noise_std` / `gyro_noise_std` in `config.json` inflates or deflates weights pathologically |
| **Timestamp misalignment** | Camera and IMU frames with bad sync → incoherent residuals |
| **Insufficient visual features** | Too few tracked points → underdetermined visual factor |
| **Map point degeneracy** | All features nearly coplanar or at the same depth |
| **Initialisation failure** | The system never converged to a good initial state before attempting full optimisation |

---

## Things to check

### 1. Calibration file

Re-run Kalibr, or carefully apply the factory calibration from your sensor (e.g. OAK-D Lite). Even small errors in the IMU-camera extrinsic rotation will cause this. The translation component matters less than the rotation.

### 2. IMU noise parameters

Compare your `config.json` values against the IMU datasheet (e.g. BMI270 on the OAK-D Lite). Basalt is particularly sensitive to:

```json
"accel_noise_std": ...,
"gyro_noise_std": ...,
"accel_bias_std": ...,
"gyro_bias_std": ...
```

Values that are too small over-weight the IMU, which can drive H toward numerical issues when the IMU measurements are even slightly inconsistent with the camera.

### 3. Timestamp synchronisation

Ensure your driver (e.g. `depthai-ros`) is publishing IMU and image messages with properly synchronised **hardware timestamps**, not ROS wall-clock stamps. Even small (~10 ms) systematic offsets can degrade the IMU preintegration enough to cause singular H.

### 4. Motion at startup

Basalt requires sufficient **IMU excitation** — accelerometer stimulation across multiple axes — during initialisation. Starting stationary for too long, or performing only planar motion, can leave scale unobservable and the system degenerate.

### 5. Feature tracking quality

Check if the image feed is blurry, overexposed, or featureless at the moment of failure. Too few landmarks in the active window leaves the visual part of H rank-deficient.

### 6. Message delivery (if using ROS2 with intra-process comms)

If running in a containerised ROS2 setup with `use_intra_process_comms: true` on rectify or bridge nodes, confirm that IMU messages are actually arriving at the VIO node at the expected rate. A stalled or slow IMU buffer at the wrong moment can leave a degenerate H even when calibration is correct.

---

## Quick diagnostic

Enable verbose logging in Basalt and inspect the lines **immediately before** the failure message. Look for:

- The number of active landmarks in the window
- The IMU integration window length
- Any Cholesky-specific failure message (e.g. `chol failed`)

This will quickly narrow the root cause to a visual, IMU, or calibration issue.

---

## Summary

```
Numerical failure in backsubstitution
      │
      ├─ H is singular or near-singular
      │
      ├─ Visual cause:  too few features / degenerate geometry
      ├─ IMU cause:     data gaps, bad noise params, timestamp mismatch
      └─ Init cause:    insufficient excitation / bad calibration
```

Fix priority: **calibration → IMU noise params → timestamp sync → motion profile → feature quality**.
