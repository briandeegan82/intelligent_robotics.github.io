---
layout: single
title: "MIGHTY: Hermite Spline-Based Real-Time Trajectory Planning"
date: 2026-08-21
permalink: /resources/robotics/2026/08/21/mighty-trajectory-planner/
categories:
  - resources
  - robotics
tags: [trajectory-planning, uav, multi-agent, ros2, motion-planning, mit-acl, open-source]
---

[MIGHTY](https://github.com/mit-acl/mighty) is a real-time trajectory planner from MIT's [Aerospace Controls Laboratory (ACL)](http://acl.mit.edu/) that computes collision-free paths fast enough to run live, onboard, for both aerial and ground robots.

---

## What it does

MIGHTY formulates trajectories as Hermite splines and optimizes them with an L-BFGS solver, aiming for planning that's cheap enough to rerun continuously as the environment changes rather than being computed once offline. That gets demonstrated across a few settings:

- **Multi-agent UAV coordination** — quadrotors swapping positions in shared airspace while avoiding each other in real time.
- **Dynamic obstacle avoidance** — navigating cluttered and forested environments where obstacles move.
- **Ground robot exploration** — frontier-based autonomous exploration on a Pioneer 3-AT platform, using MPC (via `casadi`/`do-mpc`) for ground-vehicle control.
- **Hardware validation** — tested on real UAVs through extended flight tests, not just simulation.

The stack runs on **ROS 2 Humble**, supports Gazebo or a lightweight `fake_sim` for testing, and can be driven interactively via RViz2 with clicked goals or run headless. Installation paths cover Docker, native Linux, and Jetson ARM64 boards.

---

## The paper

The method is described in *"MIGHTY: Hermite Spline-based Efficient Trajectory Planning,"* accepted to IEEE Robotics and Automation Letters (2026) — [arxiv.org/abs/2511.10822](https://arxiv.org/abs/2511.10822). Authors include Kota Kondo, Yuwei Wu, Vijay Kumar, and Jonathan P. How.

---

## Why it's worth a look

Multi-agent aerial coordination with live dynamic-obstacle avoidance is a demanding regime for trajectory optimization — plans need to be both fast to compute and smooth enough to fly. MIGHTY packages a full ROS 2 pipeline with real hardware validation (not just sim results) and covers both aerial and ground platforms with the same underlying planner, which makes it a solid reference implementation if you're building or benchmarking real-time motion planning for UAV swarms or exploration robots.

---

*Repo: [github.com/mit-acl/mighty](https://github.com/mit-acl/mighty) · Lab: [MIT Aerospace Controls Laboratory](http://acl.mit.edu/)*
