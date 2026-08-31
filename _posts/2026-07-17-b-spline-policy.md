---
layout: single
title: "Paper Spotlight: B-Spline Policy — Continuous Action Representations for Faster Manipulation"
date: 2026-07-17
permalink: /library/papers/manipulation/2026/07/17/b-spline-policy/
categories:
  - library
  - papers
tags: [manipulation, imitation-learning, diffusion-policy, act, action-representation, visuomotor-policy, robot-learning]
description: "B-Spline Policy (BSP): a continuous action representation for visuomotor"
thumbnail: /_images/bspline-method.svg
library_type: papers
redirect_from:
  - /resources/manipulation/2026/07/17/b-spline-policy/
---

![B-Spline Policy method diagram]({{ site.baseurl }}/_images/bspline-method.svg){: .align-center style="max-width: 700px;"}

## Project

**B-Spline Policy (BSP): a continuous action representation for visuomotor policies**  
Xiaoshen Han (Harvard), Haoyu Xiong (MIT), with collaborators from Harvard, MIT, and UT Austin, including Antonio Torralba.

## Links

- Project page: [b-spline-policy.github.io](https://b-spline-policy.github.io/)
- Paper: [arXiv:2607.09648](https://arxiv.org/abs/2607.09648)
- Code: [github.com/B-spline-policy/bspline-policy](https://github.com/B-spline-policy/bspline-policy)
- Interactive demo: Google Colab notebook (linked from the project page)

## Why this matters

Most modern visuomotor policies (Diffusion Policy, ACT, and their descendants) predict action chunks as sequences of discrete, fixed-rate waypoints. That treats every timestep in a chunk as equally important, which caps how fast a policy can be executed — push the control frequency up and the motion gets jerky and hard to track, because there's no notion of a smooth curve underneath the waypoints, only a list of points.

BSP replaces the waypoint sequence with a continuous B-spline curve, defined by a small set of knots and control points. Because the action is a curve rather than a list of samples, it can be:

- **resampled at any control frequency**, including rescaling the timeline after the fact to speed up or slow down execution,
- **queried for velocity**, since the derivative of a spline is well-defined, giving velocity-aware control "for free,"
- **dropped into existing pipelines** — the paper reports integrating BSP into both Diffusion Policy and ACT with minimal changes to the rest of the stack.

## Key takeaways

- Action chunking is not the bottleneck — the *discretization* of the chunk is. A continuous parameterization decouples "what motion to execute" from "how fast to execute it."
- Reported results show consistent completion-time reductions on real-world tasks (cube picking, table cleaning, speed stacking), with success rates maintained or improved in 14 of 18 comparisons against baselines.
- In simulation (Push-T, RoboMimic, RoboCasa), BSP matches or exceeds baseline task success while enabling up to 4× temporal rescaling at inference time.
- The method is representation-level, not architecture-level — it's a drop-in replacement for the action head's output space rather than a new policy backbone, which is why it composes with both diffusion- and transformer-based (ACT) policies.

## Classroom and project relevance

For MSc robotics projects working on manipulation or imitation learning, this is a useful reference for:

- rethinking action representations in imitation-learning pipelines rather than only tuning the policy backbone,
- evaluating whether execution speed, not sample efficiency or success rate, is the actual bottleneck in a manipulation demo,
- building velocity-aware controllers on top of learned policies without a separate trajectory-smoothing post-processing step.

## Suggested follow-up

If you're building on this idea, useful comparisons include:

1. fixed-rate action chunking (vanilla Diffusion Policy / ACT) vs. BSP at matched control frequencies,
2. post-hoc trajectory smoothing/interpolation of discrete waypoints vs. learning the continuous representation directly,
3. how far temporal rescaling can be pushed before task success degrades, and whether that limit is task- or object-dependent.
