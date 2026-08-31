---
layout: single
title: "pybullet_robots: A URDF Zoo for PyBullet Simulation"
date: 2026-08-21
permalink: /library/tools/robotics/2026/08/21/pybullet-robots/
categories:
  - library
  - tools
tags: [pybullet, simulation, urdf, manipulation, legged-robots, inverse-kinematics, open-source]
description: "pybullet_robots is a collection of robot models and example scripts maintained by Erwin Coumans, the primary developer of PyBullet. It's a handy grab bag for anyone who wants a working URDF and a simulation loop without…"
thumbnail: /_images/resources/2026-08-21-pybullet-robots.png
library_type: tools
redirect_from:
  - /resources/robotics/2026/08/21/pybullet-robots/
---

[pybullet_robots](https://github.com/erwincoumans/pybullet_robots) is a collection of robot models and example scripts maintained by [Erwin Coumans](https://github.com/erwincoumans), the primary developer of [PyBullet](https://pybullet.org/). It's a handy grab bag for anyone who wants a working URDF and a simulation loop without building either from scratch.

---

## What's in the repo

The repo bundles URDFs and Python examples for a wide range of platforms rather than focusing on one robot class:

- **Manipulators** — Franka Panda, Sawyer, Baxter, and Dobot arms, with example scripts for inverse kinematics and grasping.
- **Legged robots** — Boston Dynamics Atlas, the Cassie biped, Unitree Laikago, and Vision60.
- **Mobile platforms** — the F1/10 MIT Racecar and TurtleBot.
- **Humanoids** — including a G1 model with articulated head ("Zed").

Each model generally comes with a minimal loading script, so it doubles as a quick reference for getting a given robot spawned and posed in PyBullet.

---

## Why it's worth a look

If you're prototyping in PyBullet, sourcing and tuning a URDF for a new robot is often the tedious part before you can get to the actual research question. This repo shortcuts that step for a good spread of common manipulators and legged platforms, with example code for standard tasks like IK and grasping already wired up. Since it comes from PyBullet's own maintainer, the models tend to be kept in a state that's known to load and simulate cleanly.

---

*Repo: [github.com/erwincoumans/pybullet_robots](https://github.com/erwincoumans/pybullet_robots)*
