---
layout: single
title: "7 Types of SLAM Algorithms, at a Glance"
date: 2026-08-21
permalink: /library/references/robotics/2026/08/21/types-of-slam-algorithms/
categories:
  - library
  - references
tags: [slam, localization, mapping, lidar, ekf, graph-optimization, visual-slam, autonomous-navigation]
description: "Simultaneous Localization and Mapping (SLAM) is one of those topics where the sheer number of algorithm names — EKF-SLAM, GraphSLAM, ORB-SLAM, LOAM, and so on — can obscure how differently they actually solve the…"
thumbnail: /_images/types-of-slam-infographic.jpeg
library_type: references
redirect_from:
  - /resources/robotics/2026/08/21/types-of-slam-algorithms/
---

![7 types of SLAM algorithms infographic]({{ site.baseurl }}/_images/types-of-slam-infographic.jpeg){: .align-center style="max-width: 700px;"}

Simultaneous Localization and Mapping (SLAM) is one of those topics where the sheer number of algorithm names — EKF-SLAM, GraphSLAM, ORB-SLAM, LOAM, and so on — can obscure how differently they actually solve the problem. This infographic is a quick visual reference for seven of the most widely used approaches, grouped by the technique they lean on rather than just chronology.

---

## The seven, in short

- **EKF-SLAM** (Extended Kalman Filter SLAM) — estimates robot pose and landmark positions with an EKF. Simple and lightweight, suited to small-scale environments where compute is limited.
- **GraphSLAM** — represents the whole problem as a pose graph and solves it with graph optimization. Accurate and scalable to large environments, at the cost of being a batch/offline-friendlier formulation.
- **ORB-SLAM** — a feature-based visual SLAM approach using ORB (Oriented FAST and Rotated BRIEF) features, supporting monocular, stereo, and RGB-D input. Known for speed and robustness in feature-rich scenes.
- **LIO-SAM** (LiDAR-Inertial Odometry via Smoothing and Mapping) — fuses LiDAR and IMU data through factor-graph optimization. Handles GPS-denied and outdoor environments well.
- **RTAB-Map** (Real-Time Appearance-Based Mapping) — uses visual appearance and graph-based memory for real-time mapping with loop closure detection, including in dynamic environments.
- **LOAM** (LiDAR Odometry and Mapping) — real-time LiDAR odometry that minimizes motion distortion. A long-standing default for autonomous vehicles.
- **DSO** (Direct Sparse Odometry) — a direct method that optimizes camera poses by minimizing photometric error without extracting explicit features. Works well in low-texture scenes where feature-based methods struggle.

---

## Why the grouping matters

The right SLAM algorithm depends heavily on sensor suite and environment: filter-based methods like EKF-SLAM are cheap but don't scale well; graph-based methods (GraphSLAM, RTAB-Map, LIO-SAM) trade some compute for accuracy and loop-closure robustness at scale; and the choice between feature-based (ORB-SLAM) and direct (DSO) visual methods often comes down to how much texture your environment actually has. LiDAR-centric approaches (LOAM, LIO-SAM) dominate when GPS isn't available and precise geometry matters more than visual appearance.

If you're picking a SLAM stack for a new robot, this is a reasonable starting checklist of trade-offs before diving into any one implementation.
