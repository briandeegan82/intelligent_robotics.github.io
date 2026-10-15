---
layout: single
title: "LeRobot Humanoid: An Open-Source Biped for Robot Learning Research"
date: 2026-10-15
permalink: /library/references/robotics/2026/10/15/lerobot-humanoid-open-source-biped/
categories:
  - library
  - references
tags: [humanoid, open-source, lerobot, bipedal, sim-to-real, mjlab, legged-locomotion, hugging-face]
description: "Hugging Face's LeRobot Humanoid: a roughly $2,500, 3D-printed open-source biped with hardware docs, runtime, system identification and training environments for sim-to-real research."
library_type: references
---

The Hugging Face blog post [LeRobot Humanoid](https://huggingface.co/blog/VirgileBatto/lerobot-humanoid) (Virgile Batto, Caroline Pascal, Steven Palma, Maxime Ellerbach, Nicolas Rabault, Martino Russi, and haixuan tao, May 21, 2026) introduces an open-source bipedal robot platform built for robot learning research. The authors say the goal is reproducibility and hackability, not state-of-the-art performance.

---

## The robot

- **Cost:** roughly **$2,500 in parts**
- **Construction:** 3D-printed mechanical components, off-the-shelf hardware, and affordable actuators and electronics
- **Philosophy:** easy to build, modify and iterate on, rather than minimum cost

## What's in the release

The project is split into five pieces:

1. **Hardware documentation** with assembly instructions
2. **Design tools** that use simplified robot representations and control benchmarks
3. **Runtime stack** for controlling both simulation and the real robot
4. **Identification tools** for fitting simulator parameters to the hardware
5. **Training environments** in `lerobot-legged-zoo`, with MJLab support

The corresponding repositories are `lerobot-humanoid` (overview), `lerobot-humanoid-hardware`, `lerobot-humanoid-runtime`, `lerobot-humanoid-identification` and `lerobot-legged-zoo`.

## Current results

The early demonstration is a **sim-to-real standing policy**: trained in simulation and deployed on the physical robot. It shows the full pipeline from training environment to identified simulator to hardware, which is the part most DIY humanoid projects lack.

## Limitations

- The platform is explicitly experimental.
- Real-world use needs careful calibration, safety procedures and motor setup expertise.
- It currently focuses on bipedal locomotion. Upper-body capabilities are on the roadmap.

---

## Why it's worth reading

Most open humanoid projects publish a CAD model and stop. This one also ships system identification and a training environment, so you can reproduce the sim-to-real loop rather than only print the parts. At about $2,500 it sits above very cheap platforms like [PhoneBot](/library/references/robotics/2026/10/09/phonebot-open-source-humanoid-smartphone/), but it plugs into the LeRobot ecosystem and the MJLab training stack. It is a good starting point for a lab or hobbyist who wants to study humanoid locomotion with real hardware.

---

*Source: [Hugging Face blog](https://huggingface.co/blog/VirgileBatto/lerobot-humanoid)*
