---
layout: single
title: "7 Types of SLAM Algorithms: Strengths, Weaknesses, and When to Use Each"
date: 2026-09-28
permalink: /library/references/robotics/2026/08/21/types-of-slam-algorithms/
categories:
  - library
  - references
tags: [slam, localization, mapping, lidar, ekf, graph-optimization, visual-slam, autonomous-navigation]
description: "A short tour of seven widely used SLAM families — EKF-SLAM, GraphSLAM, ORB-SLAM, LIO-SAM, RTAB-Map, LOAM, and DSO — with what each does well, where it struggles, and when to reach for it."
thumbnail: /_images/types-of-slam-infographic.jpeg
library_type: references
redirect_from:
  - /resources/robotics/2026/08/21/types-of-slam-algorithms/
---

![7 types of SLAM algorithms infographic]({{ site.baseurl }}/_images/types-of-slam-infographic.jpeg){: .align-center style="max-width: 700px;"}

*Figure: Seven types of SLAM algorithms. Image courtesy of [Enlightened Machines](https://www.linkedin.com/company/enlightenedmachines/).*

Simultaneous Localization and Mapping (SLAM) lets a robot build a map of an unknown environment while estimating its own pose inside that map. The family of algorithms that do this is large — and the names (EKF-SLAM, ORB-SLAM, LOAM, …) hide very different design choices about sensors, representation, and optimization. The figure above is a useful starting map. Below is a short introduction to each of the seven, with practical strengths and weaknesses.

---

## 01. EKF-SLAM (Extended Kalman Filter SLAM)

EKF-SLAM jointly estimates the robot pose and landmark positions in one state vector, updated with an Extended Kalman Filter as new measurements arrive. It was one of the first practical probabilistic SLAM formulations and remains a useful teaching example of the filter-based approach.

**Strengths**
- Conceptually simple and well documented in textbooks and courses.
- Low computational cost for small maps — workable on modest embedded hardware.
- Natural uncertainty estimates via the covariance matrix.

**Weaknesses**
- State and covariance grow with the number of landmarks, so it does not scale to large environments.
- Linearization errors accumulate; inconsistent estimates are a known failure mode.
- Poor fit for dense LiDAR or visual maps; typically used with sparse landmarks.

**Use when:** you have a small environment, sparse features, and need a lightweight online estimator — or you are learning the foundations of probabilistic SLAM.

---

## 02. GraphSLAM

GraphSLAM frames the problem as a graph: nodes are robot poses (and often landmarks), edges are constraints from odometry and observations. Solving the graph with nonlinear least squares (pose-graph / factor-graph optimization) yields a globally consistent trajectory and map.

**Strengths**
- Scales much better than classic EKF-SLAM for large environments.
- Loop closures enter naturally as extra edges and can correct long-term drift.
- Underpins many modern systems (including RTAB-Map and LIO-SAM-style pipelines).

**Weaknesses**
- Full-batch optimization can be expensive; real-time use usually needs incremental solvers or sliding windows.
- Quality depends heavily on good loop-closure detection — false positives can warp the map.
- Implementation and tuning are more involved than a basic EKF.

**Use when:** you need accurate, large-scale mapping and can afford (or approximate) global optimization.

---

## 03. ORB-SLAM

ORB-SLAM is a feature-based visual SLAM system that tracks ORB (Oriented FAST and Rotated BRIEF) keypoints for real-time monocular, stereo, or RGB-D mapping. Later generations (ORB-SLAM2/3) add multi-map support, IMU fusion, and stronger place recognition.

**Strengths**
- Fast and robust in textured, feature-rich scenes.
- Strong loop closure and relocalization via bag-of-words place recognition.
- Mature open-source lineage with stereo and RGB-D support for metric scale.

**Weaknesses**
- Struggles in low-texture, motion-blur, or highly dynamic scenes where features are sparse or unreliable.
- Monocular mode has scale ambiguity until stereo, depth, or IMU cues are available.
- Purely geometric feature maps are less convenient for some navigation stacks than dense occupancy maps.

**Use when:** you have cameras (especially stereo/RGB-D) and operate indoors or outdoors where visual texture is plentiful.

---

## 04. LIO-SAM (LiDAR-Inertial Odometry via Smoothing and Mapping)

LIO-SAM tightly couples LiDAR and IMU measurements in a factor-graph smoother. IMU preintegration bridges high-rate motion between LiDAR scans, while LiDAR factors and optional GPS/loop closures refine the trajectory.

**Strengths**
- High accuracy in GPS-denied outdoor and large-scale settings.
- IMU fusion reduces motion distortion and helps during aggressive motion.
- Factor-graph design supports incremental smoothing and optional absolute priors.

**Weaknesses**
- Needs a capable LiDAR + well-calibrated IMU; setup and extrinsics matter.
- Feature-poor geometry (long corridors, open fields, reflective surfaces) can still degrade performance.
- Heavier than pure filter odometry on constrained compute budgets.

**Use when:** you are mapping outdoors or in large GPS-denied spaces with a LiDAR–IMU suite and care about metric accuracy.

---

## 05. RTAB-Map (Real-Time Appearance-Based Mapping)

RTAB-Map is a graph-based SLAM approach that emphasizes appearance-based loop closure and memory management: it keeps a working memory of recent/salient locations so mapping can stay real-time over long sessions. It supports cameras, RGB-D, stereo, and LiDAR configurations and is widely used in ROS.

**Strengths**
- Practical long-term mapping with online loop closure and memory limits.
- Flexible sensor setups (vision, depth, LiDAR) and strong ROS/ROS 2 tooling.
- Handles revisiting and dynamic scenes better than naive short-horizon odometry.

**Weaknesses**
- Appearance-based loop closure can fail under strong lighting change or visual aliasing.
- Parameter tuning (memory, detection thresholds) affects reliability.
- Not always the best pure outdoor LiDAR odometry choice versus LOAM/LIO-SAM-style stacks.

**Use when:** you want a production-friendly, multi-sensor mapping stack for mobile robots — especially indoor/RGB-D or mixed setups — with loop closure out of the box.

---

## 06. LOAM (LiDAR Odometry and Mapping)

LOAM separates high-frequency LiDAR odometry from lower-frequency map refinement. It extracts edge and plane features from scans, compensates for motion distortion, and builds a surrounding point-map used by many autonomous-driving and mobile-robot pipelines (and by later variants such as LeGO-LOAM and A-LOAM).

**Strengths**
- Efficient real-time LiDAR odometry with strong motion-distortion handling.
- Widely deployed and extended; a common baseline for autonomous vehicles.
- Works without cameras or rich visual texture.

**Weaknesses**
- Classic LOAM has limited loop closure; long runs can drift without an outer pose-graph layer.
- Degenerate geometry (tunnels, open plains) remains hard for scan matching.
- Less about semantic/appearance maps; output is geometric point clouds / trajectories.

**Use when:** LiDAR is your primary sensor and you need fast, accurate odometry — often as a front-end before graph optimization or localization against a prior map.

---

## 07. DSO (Direct Sparse Odometry)

DSO is a *direct* visual odometry method: instead of detecting and matching sparse feature descriptors, it optimizes camera poses (and a sparse set of points) by minimizing photometric error in the image. It sits in contrast to feature-based systems like ORB-SLAM.

**Strengths**
- Uses many more image pixels than feature pipelines, so it can work in low-texture scenes.
- Accurate short-term visual odometry when exposure and calibration are well modeled.
- Sparse formulation stays real-time without building a dense map.

**Weaknesses**
- Sensitive to rolling shutter, unmodeled exposure changes, and photometric calibration.
- Classic DSO is primarily visual *odometry*; full SLAM needs added loop closure / mapping layers (e.g., LDSO).
- Pure visual scale issues remain in monocular setups without stereo/IMU.

**Use when:** visual texture is weak for ORB-style features, but lighting is reasonably stable and you want high-accuracy camera tracking.

---

## How to choose

| Priority | Lean toward |
| --- | --- |
| Small map, limited compute, learning foundations | EKF-SLAM |
| Large-scale consistency and loop closures | GraphSLAM-style optimization |
| Cameras in textured scenes | ORB-SLAM |
| Outdoor / GPS-denied LiDAR + IMU | LIO-SAM |
| ROS-friendly multi-sensor mapping | RTAB-Map |
| Fast LiDAR odometry for vehicles/AMRs | LOAM (and variants) |
| Low-texture vision, photometric tracking | DSO |

In practice many deployed systems are hybrids: a LOAM- or LIO-style front-end for odometry, a graph backend for loop closure, and sometimes a visual place-recognition layer for relocalization. Use the figure as a vocabulary map, then pick the family that matches your sensors and environment before committing to a specific package.

*Figure attribution: [Enlightened Machines](https://www.linkedin.com/company/enlightenedmachines/).*
