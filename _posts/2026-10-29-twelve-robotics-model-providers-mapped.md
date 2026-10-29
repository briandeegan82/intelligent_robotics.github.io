---
layout: single
title: "Twelve Robotics Foundation Model Providers, Mapped"
date: 2026-10-29
permalink: /library/references/robotics/2026/10/29/twelve-robotics-model-providers-mapped/
categories:
  - library
  - references
tags: [vla, foundation-models, robot-learning, manipulation, benchmarks, apis, industry]
description: "Ilya Orlov mapped 12 providers of robotics foundation models by model, capability, access, pricing and benchmark results, from Physical Intelligence and DeepMind to open releases like SmolVLA and MolmoAct 2."
library_type: references
---

Ilya Orlov of FileMarket Labs compared **12 providers of robotics foundation models** by their models, what the models do, how you get access, published pricing and benchmark results. It's a useful snapshot of who is offering vision-language-action (VLA) and embodied reasoning models, and how you can get them: as a hosted API, by waitlist, or as open weights.

---

## The providers (as posted)

| Provider | Model | Focus / access | Reported result |
|---|---|---|---|
| Dream Labs | Dream-1 | Two-arm robots with parallel grippers, through a public API (a related post gives a starting price of $3/hour) | 59.3% mean progress, RoboDojo-RC Tier 1 (Robocurve) |
| Google DeepMind | Gemini Robotics ER 2 | Spatial reasoning, video understanding, task orchestration | — |
| Physical Intelligence | Pi API (beta) | Managed fine-tuning and hosted inference | — |
| Generalist | GEN-1.5 | Learns skills from short demonstrations; waitlist | — |
| Skild AI | S1 | Manipulation learned from video demonstrations | — |
| Microsoft Research | Rho-alpha | Vision, language and tactile sensing | — |
| NVIDIA | Isaac GR00T N1.7 | Downloadable robot-action models and adaptation tools | 9.5% mean progress, RoboDojo-RC (Robocurve) |
| Ai2 | MolmoAct 2 / 2-Think | Open models, training data and code | 18.9%, RoboDojo-RC |
| Hugging Face | SmolVLA | Compact 450M-parameter open VLA | 87.3% average success on LIBERO (authors) |
| Robbyant | LingBot-VLA 2.0 | Control across different robot configurations | 92.80% on RoboTwin 2.0, randomized sim, after post-training (developer) |
| Xiaomi | Xiaomi-Robotics-0 | Released weights and real-time execution tools | 98.7% on LIBERO when fine-tuned on it (developer) |
| Alibaba DAMO | RynnBrain 1.1 | Embodied perception and spatial reasoning | — |

---

## Reading the numbers

Orlov notes two caveats himself:

- **Several providers haven't published API pricing**, so it's hard to compare costs.
- **The benchmark scores mix independent and developer-reported results** on different benchmarks (RoboDojo-RC, LIBERO, RoboTwin 2.0), so the table **is not a leaderboard**. A 98.7% on LIBERO after fine-tuning and a 59.3% mean progress on a real-robot evaluation measure very different things.

---

## Why it's worth a look

The landscape is splitting into three ways of getting access: **hosted APIs** (Dream Labs, Physical Intelligence), **closed models behind waitlists or partnerships** (Generalist, Skild AI), and **open weights** you can fine-tune yourself (GR00T, MolmoAct, SmolVLA, Xiaomi-Robotics-0). For a lab or a course, the open models are the ones you can actually run and compare on your own hardware. I haven't checked these figures myself, so treat them as reported.

---

*Source: [Ilya Orlov on LinkedIn](https://www.linkedin.com/posts/orlov-ilya_i-mapped-12-robotics-model-providers-and-share-7518333215049179137-TNBl/)*
