---
layout: single
title: "PhoneBot: An Open-Source Humanoid Built Around an Old Smartphone"
date: 2026-10-09
permalink: /library/references/robotics/2026/10/09/phonebot-open-source-humanoid-smartphone/
categories:
  - library
  - references
tags: [humanoid, open-source, low-cost, smartphone, legged-locomotion, sim-to-real, education]
description: "UCLA's PhoneBot: a 48 cm, 1.8 kg open-source humanoid that reuses a retired Android phone as its computer and sensor suite, for about $400 in parts."
library_type: references
---

Heise reports on [PhoneBot](https://www.heise.de/en/news/PhoneBot-Humanoid-open-source-robot-based-on-an-old-smartphone-11481931.html) (Oliver Bünte, October 9, 2026), a small open-source humanoid from UCLA researchers. It uses a retired Android smartphone as both its main computer and its sensor package. The aim is a humanoid platform that university labs and students can actually afford.

---

## The robot

- **Size:** 48 cm tall, 1.8 kg
- **Actuation:** 13 motors, six per leg plus one for torso rotation
- **Cost:** roughly **$400 in parts**, not counting the phone
- **Phones tested:** Honor 9 (2017), Moto G 2024, Moto G 2025, Samsung Galaxy A16 5G. A current flagship is not needed.

## What the phone does

The smartphone already has most of what a small robot needs:

- compute for actuator control and image processing
- an IMU for orientation and balance
- cameras for perception and person following
- GPS, plus Wi-Fi for remote control

Reusing an old phone gets a capable, integrated sensor and compute stack for free instead of assembling an SBC, IMU, and camera separately.

## Control and training

The locomotion policy was trained in simulation, with the physical limits of the hardware included in the model. To fix an asymmetric gait, the team used a **mirroring technique** rather than retraining the whole policy.

## Current capabilities

- walking on flat ground
- following a person
- standing back up after a fall
- turning the torso to point the camera

## Limitations and next steps

PhoneBot has no arms yet and only walks on level terrain. Voice control currently runs on an external computer. Planned work covers uneven terrain, simple arm manipulation, and moving voice control onto the phone.

---

## Why it's worth reading

Humanoid research hardware is usually expensive, which limits who can do hands-on work in legged locomotion and sim-to-real transfer. PhoneBot shows how far a cheap phone and a handful of servos can go. It is a useful reference for teaching labs and for anyone who wants to build a small humanoid on a student budget.

The paper is on arXiv: [*PhoneBot: A Low-Cost Open Humanoid Robot Platform Reusing Smartphones*](https://arxiv.org/abs/2610.08737).

---

*Source: [heise online](https://www.heise.de/en/news/PhoneBot-Humanoid-open-source-robot-based-on-an-old-smartphone-11481931.html)*
