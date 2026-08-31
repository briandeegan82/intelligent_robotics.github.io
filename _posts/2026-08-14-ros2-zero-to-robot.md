---
layout: single
title: "ROS 2: Zero to Robot — A Free, Project-Driven ROS 2 Book"
date: 2026-08-14
permalink: /library/courses/robotics/2026/08/14/ros2-zero-to-robot/
categories:
  - library
  - courses
tags: [ros2, ros2-jazzy, urdf, gazebo, nav2, moveit2, slam, ros2-control, docker, education, open-source]
description: "ROS 2: Zero to Robot is a free, open-source book by Pouya Mansournia that takes readers from first ROS 2 concepts through to deploying a complete autonomous mobile robot. It's built around ROS 2 Jazzy and reads as a…"
thumbnail: /_images/resources/2026-08-14-ros2-zero-to-robot.png
library_type: courses
redirect_from:
  - /resources/robotics/2026/08/14/ros2-zero-to-robot/
---

[ROS 2: Zero to Robot](https://github.com/Pouya-Mansournia/ros2-zero-to-robot) is a free, open-source book by [Pouya Mansournia](https://github.com/Pouya-Mansournia) that takes readers from first ROS 2 concepts through to deploying a complete autonomous mobile robot. It's built around ROS 2 Jazzy and reads as a static site — no build step, just HTML with light/dark modes and built-in navigation.

---

## One robot, twenty chapters

Rather than a grab-bag of disconnected examples, the whole book follows a single reference platform — **ARCHO**, a warehouse autonomous mobile robot — as it evolves chapter by chapter from a bare URDF description into a fully integrated system. The 20 chapters are grouped into six parts:

- **Part I — ROS 2 Foundations**: architecture, environment setup, nodes, communication, packages.
- **Part II — Building ARCHO**: URDF, Xacro, TF2, RViz.
- **Part III — Simulation & Control**: Gazebo, ros2_control, odometry.
- **Part IV — Perception & Autonomy**: sensor fusion, SLAM, Nav2, Behavior Trees, MoveIt 2.
- **Part V — Scaling & Software Delivery**: multi-robot systems, Docker, CI/CD.
- **Part VI — Industrial Deployment**: Jetson, Raspberry Pi, ESP32, CAN, EtherCAT, DDS/QoS, sim-to-real.

An appendix covers a SolidWorks-to-URDF workflow for turning real CAD assemblies into working robot descriptions — a step that's often skipped in ROS tutorials but comes up constantly in practice.

---

## Why it's worth a look

Most ROS 2 material either stays at the "publish a topic" level or jumps straight into a specific subsystem without showing how it fits into a working robot. Following one project end to end — from nodes and topics through SLAM, Nav2, and MoveIt 2, all the way to Jetson/Raspberry Pi deployment and industrial fieldbuses like CAN and EtherCAT — gives a much clearer picture of how the pieces actually connect. The companion [warehouse-amr-ros2](https://github.com/Pouya-Mansournia/warehouse-amr-ros2) repo has the fully modeled ARCHO robot and code to follow along with. The book is CC BY 4.0 licensed and DOI-registered ([10.5281/zenodo.21843441](https://doi.org/10.5281/zenodo.21843441)), so it's citable if you're using it in a course or paper.

---

*Repo: [github.com/Pouya-Mansournia/ros2-zero-to-robot](https://github.com/Pouya-Mansournia/ros2-zero-to-robot) · Live site: [pouya-mansournia.github.io/ros2-zero-to-robot](https://pouya-mansournia.github.io/ros2-zero-to-robot/)*
