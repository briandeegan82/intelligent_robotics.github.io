---
layout: single
title: "Paper Spotlight: Fast Onboard Tracking of Active Blinking Markers"
date: 2026-07-03
permalink: /resources/robotics/2026/07/03/active-blinking-markers-relative-localization/
redirect_from:
  - /tutorials/perception/2026/07/03/active-blinking-markers-relative-localization/
categories:
  - resources
  - robotics
tags: [multi-robot, localization, uav, tracking, vision]
description: "Towards agile multi-robot systems in the real world: Fast onboard tracking of active blinking markers for relative"
---

## Paper

**Towards agile multi-robot systems in the real world: Fast onboard tracking of active blinking markers for relative localization**  
Tim Lakemann, Daniel Bonilla Licea, Viktor Walter, Tomas Baca, Martin Saska  
*Robotics and Autonomous Systems* (2025), Article 105175  
DOI: [10.1016/j.robot.2025.105175](https://doi.org/10.1016/j.robot.2025.105175)

## Links

- ScienceDirect: [Article page](https://www.sciencedirect.com/science/article/pii/S0924424725005175?__cf_chl_f_tk=gz8Yx0GCkwAK5WKsQS.SP4NEKXg5xk1nnXb7fis6ezw-1783062819-1.0.1.1-EULOUuzbJagsDMlE9JeEmZ4tuFpbzr3CqR3qan7BoFU)
- DOI landing page: [https://doi.org/10.1016/j.robot.2025.105175](https://doi.org/10.1016/j.robot.2025.105175)

## Why this matters

Relative localization is still a bottleneck for agile multi-robot flight in real-world conditions. This paper focuses on a practical onboard pipeline for tracking actively blinking markers, which is useful when GNSS is unreliable or unavailable and teams need robust robot-to-robot state estimation.

## Key takeaways

- Active blinking markers can improve detection robustness for fast multi-robot motion.
- Onboard processing is central for low-latency relative localization in dynamic environments.
- The approach targets real-world deployment constraints, not only lab-only demonstrations.

## Classroom and project relevance

For MSc robotics projects, this is a useful reference for:

- designing relative localization stacks for UAV swarms,
- comparing marker-based methods against UWB/VIO alternatives,
- understanding trade-offs between sensing reliability, latency, and compute budget.

## Suggested follow-up

If you are implementing this idea in a project, benchmark against:

1. UWB-only relative localization,
2. visual-inertial odometry without active markers,
3. hybrid marker + inertial fusion pipelines.
