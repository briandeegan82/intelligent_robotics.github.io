---
layout: post
title: "ROS and ROS 2: History, Concepts, and the Transition"
date: 2025-06-11
categories: robotics ros
tags: [ros, ros2, framework, middleware, history]
---

# ROS and ROS 2: History, Concepts, and the Transition

## Introduction

The Robot Operating System (ROS) is the dominant open-source framework for building robot software. Despite the name, it isn't an operating system in the traditional sense — it runs on top of Linux, Windows, or macOS — but rather a collection of libraries, tools, conventions, and communication infrastructure that lets developers build complex robotic systems out of smaller, reusable pieces. Today, "ROS" usually refers to two related but architecturally distinct generations: the original ROS (often called "ROS 1") and its successor, ROS 2. This article covers where they came from, what they actually are, why ROS 2 exists, and the trade-offs between them.

## A Brief History

ROS traces its roots to research at Stanford University in the mid-2000s, particularly the STAIR (STanford AI Robot) project and related work on flexible robot software architectures. In 2007, much of that effort moved to **Willow Garage**, a robotics research lab and incubator founded by Scott Hassan. Willow Garage built the PR2 robot as a development platform and released ROS as open-source software to give the robotics community a shared foundation, rather than every lab reinventing drivers, transforms, and messaging from scratch.

The first official ROS distribution, **Box Turtle**, was released in 2010. From there, ROS followed a pattern of named, versioned distributions roughly once a year (Electric Emys, Fuerte Turtle, Hydro Medusa, Indigo Igloo, Kinetic Kame, Melodic Morenia, and finally **Noetic Ninjemys** in 2020). Over the 2010s, ROS became the de facto standard in robotics research and education, with an enormous ecosystem of packages for navigation, manipulation, perception, simulation (Gazebo), and visualization (RViz).

As ROS use expanded beyond research labs into commercial products, drones, autonomous vehicles, and multi-robot fleets, its original architectural assumptions began to show their limits. Discussions about a redesign began around 2014, and the **Open Source Robotics Foundation (OSRF)**, with significant support from companies including Intel and later acquisition by Open Robotics (now part of Intrinsic/part of the broader ROS ecosystem under the ROS 2 Technical Steering Committee), led the development of **ROS 2**. The first ROS 2 distribution, **Ardent Chimera**, shipped in December 2017, built from the ground up on a different middleware foundation.

ROS 2 then matured through its own series of named distributions — Bouncy Bolson, Crystal Clemmys, Dashing Diademata, Eloquent Elusor, Foxy Fitzroy, Galactic Geochelone, Humble Hawksbill, Iron Irwini, Jazzy Jalisco, Kilted Kaiju, and **Lyrical Luth** (released May 2026, the most recent Long-Term Support release at the time of writing). ROS 1's final distribution, Noetic Ninjemys, reached end-of-life in May 2025, meaning ROS 2 is now the only actively supported line and the recommended starting point for any new project.

## What ROS Is

At its core, classic ROS provides:

- **A communication layer** built around a publish/subscribe model. Independent programs, called **nodes**, exchange data over named **topics** (e.g., a camera node publishes images, a perception node subscribes to them).
- **Services and actions** for request/response and long-running goal-oriented interactions, layered on top of the same messaging system.
- **A central coordinator**, `roscore`, which runs the ROS Master — a naming and registration service that lets nodes find each other. All communication setup depends on this single process.
- **Standard message and data types**, including a transform library (`tf`/`tf2`) for tracking coordinate frames over time — essential for anything involving sensors, robot arms, or mobile bases.
- **A build and packaging system** (catkin), and a huge community repository of packages covering everything from motor drivers to SLAM algorithms to full navigation stacks (the `nav` stack) and manipulation pipelines (MoveIt).
- **Tooling**, including RViz for 3D visualization, rqt for introspection and plotting, and rosbag for recording and replaying data — all of which remain conceptually present in ROS 2.

ROS 1 was, and remains, primarily a Linux-and-Python/C++ research tool: powerful, flexible, and backed by an unmatched library of existing algorithms, but built around assumptions (a single master, a custom transport protocol, no built-in security) that made sense for a research lab's PR2 but less sense for a commercial fleet of delivery robots.

## What ROS 2 Is

ROS 2 keeps the same fundamental mental model — nodes, topics, services, actions, transforms — so that concepts and even much application-level code can carry over. The major change is underneath: ROS 2's communication layer is built on **DDS (Data Distribution Service)**, an established OMG industry standard for real-time, distributed publish/subscribe communication, widely used in aerospace, defense, and industrial automation.

This brings several structural differences:

- **No central master.** Nodes discover each other dynamically via DDS discovery protocols, removing the single point of failure that `roscore` represented.
- **Quality of Service (QoS) policies.** Each topic or service connection can specify reliability (best-effort vs. reliable), durability, history depth, and deadlines — letting a developer tune, say, a lossy-but-fast camera feed differently from a must-not-drop command topic.
- **Multi-platform support.** ROS 2 officially supports Linux, Windows, macOS, and real-time operating systems used in embedded contexts, rather than being Linux-first.
- **Real-time capability.** With the right RMW (ROS Middleware) implementation, real-time operating system, and careful design, ROS 2 supports deterministic, real-time execution paths — something ROS 1 never reliably offered.
- **Security.** SROS2 adds authentication, encryption, and access control built on DDS-Security, important for production and safety-relevant systems.
- **Lifecycle management.** "Managed nodes" have a formal state machine (unconfigured, inactive, active, finalized), useful for orchestrating startup/shutdown in larger systems.
- **Modern build tooling.** `ament` and `colcon` replace catkin, with cleaner support for mixed-language workspaces.
- **Pluggable middleware.** Multiple DDS/RTPS implementations (Fast DDS, Cyclone DDS, RTI Connext, Zenoh-based RMWs, etc.) can be swapped depending on platform and performance needs.

## What Drove the Move to ROS 2

The shift wasn't cosmetic — it was a response to ROS 1's growing mismatch with how robots were actually being deployed:

1. **Single point of failure.** The ROS Master was a bottleneck and a fragile dependency; if it crashed, the whole system's discovery mechanism went with it. Production systems needed resilience.
2. **Multi-robot and distributed systems.** ROS 1's networking model worked poorly across multiple machines or robots on unreliable networks. DDS's decentralized discovery and configurable QoS were designed precisely for this.
3. **Real-time and embedded targets.** As robotics moved into drones, automotive systems, and embedded controllers, the lack of real-time guarantees and the Linux-only assumption became serious blockers.
4. **Production-grade requirements.** Companies building commercial products needed security, determinism, certification pathways, and support for operating systems beyond Linux — none of which ROS 1 was designed to provide.
5. **Aging core dependencies.** ROS 1 was tied to an aging Python 2 ecosystem and custom transport (TCPROS/UDPROS) that wasn't going to evolve gracefully alongside the rest of the software world.
6. **Industry standardization.** Rather than build another bespoke transport, the ROS 2 team chose to build on DDS — a mature, vendor-neutral standard already trusted in safety- and mission-critical domains — so robotics could benefit from (and contribute to) that broader ecosystem.

## Pros and Cons

### ROS 1
**Pros**
- Extremely mature, with two decades of accumulated packages, tutorials, and community knowledge.
- Simple conceptual model and lower overhead for small, single-machine research setups.
- Still the basis for a huge amount of existing code and published research that hasn't been ported.

**Cons**
- Reached end-of-life (Noetic, May 2025) — no further security patches or official support.
- Single master architecture is fragile and a poor fit for distributed or multi-robot systems.
- No real-time guarantees, no built-in security, Linux-centric.
- New hardware drivers and major libraries are increasingly ROS 2-only.

### ROS 2
**Pros**
- No single point of failure; decentralized discovery suits multi-robot and distributed systems.
- Configurable QoS lets a single framework serve both "fire and forget" sensor streams and mission-critical control messages.
- Real-time support, multi-platform (Linux/Windows/macOS/RTOS), and built-in security (SROS2) make it viable for commercial and safety-relevant products.
- Actively developed, with annual releases and a clear LTS cadence (e.g., Humble, Jazzy, Lyrical).
- Lifecycle-managed nodes and improved tooling make large systems easier to orchestrate and debug.

**Cons**
- Steeper learning curve — QoS, DDS discovery, and the new build tooling (`ament`/`colcon`) add concepts beyond plain pub/sub.
- DDS discovery traffic can cause real operational headaches in multi-distro or large multi-node networks (e.g., excessive discovery traffic between mismatched ROS 2 versions sharing a network), often requiring careful `ROS_DOMAIN_ID` management or alternative RMWs.
- Some legacy ROS 1 packages still lack a direct ROS 2 equivalent, though this gap has narrowed substantially.
- Slightly higher baseline resource usage on very constrained embedded targets unless QoS and middleware are deliberately tuned.

### The practical takeaway
For any new project today, **ROS 2 is the default choice** — ROS 1 is end-of-life, and the ecosystem (drivers, simulators, tutorials, course material) has largely moved over. The main reason to still touch ROS 1 is maintaining or migrating an existing codebase.

## Further Resources

- **ROS website:** https://www.ros.org/
- **ROS 2 documentation (all distributions, including Rolling and Lyrical Luth):** https://docs.ros.org/
- **ROS 2 tutorials:** https://docs.ros.org/en/rolling/Tutorials.html
- **ROS 2 design documents (architecture rationale, DDS choice, etc.):** https://design.ros2.org/
- **ROS 2 distributions and support timelines:** https://docs.ros.org/en/rolling/Releases.html
- **ROS 1 wiki (for legacy reference):** https://wiki.ros.org/
- **ROS Discourse (community discussion and announcements):** https://discourse.ros.org/
- **Robotics Stack Exchange (Q&A, successor to ROS Answers):** https://robotics.stackexchange.com/
- **ROS 2 source repositories:** https://github.com/ros2
- **OMG DDS specification (the middleware standard underpinning ROS 2):** https://www.omg.org/spec/DDS/
- **SROS2 security documentation:** https://docs.ros.org/en/rolling/Tutorials/Advanced/Security/
- **Nav2 (ROS 2 navigation stack):** https://docs.nav2.org/
