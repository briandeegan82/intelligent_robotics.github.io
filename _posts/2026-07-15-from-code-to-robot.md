---
layout: single
title: "From Code to Robot: An Open Curriculum for Robotics, Vision, and AI with MATLAB and UR Robots"
date: 2026-07-15
permalink: /resources/robotics/2026/07/15/from-code-to-robot/
categories:
  - resources
  - robotics
tags: [matlab, universal-robots, kinematics, computer-vision, yolo, reinforcement-learning, ros2, education, curriculum]
description: "From Code to Robot is an open-source, modular teaching curriculum developed at the Universitat Politècnica de Catalunya (UPC) that aims to bridge the gap between theory and real robotic applications through…"
thumbnail: /_images/from-code-to-robot-demo.gif
---

![From Code to Robot demo]({{ site.baseurl }}/_images/from-code-to-robot-demo.gif){: .align-center style="max-width: 700px;"}

[From Code to Robot](https://github.com/iocroblab/from_code_to_robot) is an open-source, modular teaching curriculum developed at the Universitat Politècnica de Catalunya (UPC) that aims to bridge the gap between theory and real robotic applications through reproducible, hands-on exercises. Built around MATLAB and Universal Robots manipulators, it was created by Constantin Sul and Prof. Jan Rosell (robotics) together with Noel Nathan Planell and Prof. Isiah Zaplana (computer vision and AI), with support from MathWorks and Universal Robots.

---

## What's in the curriculum

The material is organised into three interconnected pillars, each structured as modular tutorials, demonstrations, exercises, and projects:

**Robotics.** The classical manipulator pipeline — Denavit-Hartenberg parameters, forward and inverse kinematics, trajectory planning, and dynamics — worked through in MATLAB with UR3 simulations, so you can go from equations on paper to a moving (simulated) arm.

**Computer Vision.** A practical route into perception for manipulation: YOLOv8 object detection, dataset generation, transfer learning, and camera calibration.

**Artificial Intelligence.** An introduction to decision-making for robots, covering Q-learning, Deep Q-learning, and task planning using MATLAB's Reinforcement Learning Toolbox.

---

## What you need to run it

The primary platform is MATLAB (R2025a/b recommended) with the Robotics System, Deep Learning, Reinforcement Learning, Computer Vision, and Symbolic Math toolboxes, plus Simulink for simulation. On the hardware side it targets Universal Robots UR3/UR5 arms with RGB cameras, though the exercises run in simulation if you don't have access to a physical robot. Notably, it also ships a Docker-based **ROS 2 Jazzy** environment, so the UR simulation side connects to the same ROS 2 tooling we cover elsewhere on this site.

---

## Why it's worth a look

Complete, coherent robotics curricula that are actually open are rare — most courses publish slides but not the reproducible exercises that make the material teachable. From Code to Robot is designed for reuse: the modules are self-contained enough to drop into undergraduate or graduate courses in robotics, computer science, or automation, and the materials are available in English, Spanish, and Catalan. Whether you're an educator looking for ready-made lab content or a self-learner who wants a structured path from kinematics through vision to reinforcement learning on a real industrial arm, it's a strong starting point. The project is young (version 0.0.1 at the time of writing) but already has close to 300 commits behind it, so it's worth watching as it matures.

---

*Repository: [github.com/iocroblab/from_code_to_robot](https://github.com/iocroblab/from_code_to_robot) · Institution: [Universitat Politècnica de Catalunya](https://www.upc.edu/en)*
