---
layout: single
title: "ORCA: An Open-Source Stack for Dexterous Robot Hand Learning"
date: 2026-08-05
permalink: /resources/robotics/2026/08/05/orca-dexterous-hand-stack/
categories:
  - resources
  - robotics
tags: [dexterous-manipulation, robot-hand, teleoperation, imitation-learning, lerobot, mujoco, open-source, act, hardware]
---

[ORCA Dexterity](https://github.com/orcahand) is an end-to-end open-source stack for dexterous robot hand research, built by researchers from the University of Oxford, ETH Zurich, and ORCA Dexterity. It tackles a real pain point in manipulation research — hardware, simulation, teleoperation, and policy learning tools that don't talk to each other — by releasing a matched set of MIT-licensed repos designed to work together out of the box.

---

## The hand and the stack

At the center is the **Orcahand**, a tendon-driven, 3D-printable robotic hand with 17 degrees of freedom, priced at roughly $3,000 in parts — cheap enough for a lab to build several. The software splits cleanly across four repos:

- **[orca_core](https://github.com/orcahand/orca_core)** — hardware control and joint-level interfaces for the physical hand.
- **[orca_sim](https://github.com/orcahand/orca_sim)** — a MuJoCo simulation environment matched to the real hand.
- **[orca_arm](https://github.com/orcahand)** — platform integration with arms like the Franka Panda and the open-source [OpenArm](https://github.com/orcahand/openarm).
- **[orca_teleop](https://github.com/orcahand/orca_teleop)** / **[orca_retargeter](https://github.com/orcahand/orca_retargeter)** — hand retargeting and teleoperation, with support for MediaPipe hand tracking, Meta Quest 3, and Manus gloves.

Because the sim and real hand share the same interface, demonstrations collected via teleoperation flow directly into training data without a separate conversion step.

---

## What they demonstrated

Using the teleop pipeline, the team collected expert demonstrations and trained a 50M-parameter [ACT](https://github.com/tonyzhaozh/act) policy through [LeRobot](https://github.com/huggingface/lerobot), reaching a 90% success rate on simulated in-hand reorientation tasks. That's a concrete, reproducible result rather than just a hardware release — the kind of thing you can benchmark against.

---

## Why it's worth a look

Dexterous manipulation has been bottlenecked as much by fragmented tooling as by hardware cost: every lab tends to build its own one-off bridge between a hand, a simulator, and a data pipeline. ORCA's bet is that a shared, MIT-licensed interface — hand, sim, teleop, and LeRobot-compatible datasets — lowers the barrier enough that results start to compound across groups instead of being reinvented each time. If you're exploring imitation learning for manipulation and want a hand that's both affordable to build and has a working sim-to-real pipeline already validated, this is a strong starting point.

---

*Org: [github.com/orcahand](https://github.com/orcahand) · Via: [LinkedIn post by Lars Josler](https://www.linkedin.com/posts/josler_robotics-opensource-robotlearning-share-7487756550883966976-F4Mb/)*
