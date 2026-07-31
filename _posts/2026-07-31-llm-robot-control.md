---
layout: single
title: "Controlling Robots with an LLM: Claude + ROS 2 via ROSA"
date: 2026-07-31
permalink: /resources/robotics/2026/07/31/llm-robot-control/
categories:
  - resources
  - robotics
tags: [llm, claude, ros2, rosa, langchain, gazebo, nav2, natural-language, simulation]
---

![LLM robot control infographic]({{ site.baseurl }}/_images/llm-robot-control-infographic.webp){: .align-center style="max-width: 700px;"}

[Controlling Robots using a Large Language Model](https://mikelikesrobots.github.io/blog/llm-robot-control/) by Michael Hart (Mike Likes Robots) is a practical, end-to-end walkthrough of putting a cloud-hosted LLM in the driver's seat of a ROS 2 robot. Rather than staying at the "wouldn't it be cool" level, the post builds a working demo: Claude 3.5 Sonnet commanding a simulated Robotnik Summit mobile robot around a household Gazebo environment using plain English — "go to the kitchen", "move backwards 1.5 metres", "explore the map".

---

## The architecture

The demo stacks three layers, and the separation between them is the real lesson of the post:

**LLM in the cloud.** Claude is reached over the Anthropic API through [LangChain](https://www.langchain.com/). The robot itself never runs the model — it just needs a network connection, since most robot compute can't host a capable LLM on-device.

**Tools as the interface.** Python functions — move relative, navigate to a named location, list available locations — are decorated as tools the LLM can invoke. The LLM never emits raw velocity commands; it decides *which* tool to call and with *what* arguments.

**ROS 2 does the actual work.** NASA-JPL's [ROSA](https://github.com/nasa-jpl/rosa) framework bridges the tool calls to ROS 2 topics and services, and the robot's native stack — [nav2](https://nav2.org/) for autonomous navigation, SLAM for mapping — executes the motion. The LLM invokes navigation; it doesn't perform it.

This division of labour matters: language understanding goes to the model, safety-critical real-time control stays with the proven robotics stack.

---

## What you need to run it

The whole thing is containerised: a Docker image bundles Gazebo, RViz, ROS 2, and the agent code, with the NVIDIA Container Toolkit recommended because GPU acceleration makes a big difference to simulation speed (and Windows GPU passthrough proved painful). On the API side, an Anthropic key with a small balance (~$5 minimum) is enough for the demo. Code is on GitHub: the [original group project](https://github.com/RAP-2025-Project-Group-2/RAP-2025-Project-Group-2) and Hart's [fork used in the post](https://github.com/mikelikesrobots/RAP-2025-Project-Group-2).

The demonstrated results cover relative movements, navigating to predefined semantic locations like the kitchen, autonomously exploring a mapped environment, and asking the robot what it can do — that last one being a genuinely useful property of LLM interfaces that traditional teleop lacks.

---

## Why it's worth your time

If you've been following the surge of language-conditioned robotics — from vision-language-action models to voice-commanded manipulators — this post is one of the most accessible on-ramps available. It uses off-the-shelf pieces (ROS 2, LangChain, ROSA, nav2) rather than a bespoke research stack, so everything transfers directly to your own robot. It's also honest about the caveats: a flaky network breaks the whole loop, API keys shouldn't be baked into distributed Docker images, and the LLM's authority is deliberately limited to invoking high-level behaviours.

For students, it's an ideal weekend project: you get hands-on experience with tool-calling agents, ROS 2 integration, and simulation infrastructure in one sitting — the exact skill set that language-driven robotics work increasingly demands.

---

*Post: [mikelikesrobots.github.io/blog/llm-robot-control](https://mikelikesrobots.github.io/blog/llm-robot-control/) · Code: [RAP-2025-Project-Group-2](https://github.com/RAP-2025-Project-Group-2/RAP-2025-Project-Group-2) · ROSA: [github.com/nasa-jpl/rosa](https://github.com/nasa-jpl/rosa)*
