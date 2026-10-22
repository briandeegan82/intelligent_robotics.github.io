---
layout: single
title: "Rerun: An Open-Source Data Layer for Physical AI"
date: 2026-10-22
permalink: /library/references/robotics/2026/10/22/rerun-data-layer-for-physical-ai/
categories:
  - library
  - references
tags: [rerun, visualization, data-tools, multimodal-data, physical-ai, debugging, datasets, open-source]
description: "Rerun is an open-source SDK and viewer for logging, querying and visualizing multimodal robotics data, with a commercial Hub for large datasets."
library_type: references
---

[Rerun](https://rerun.io/) describes itself as "the data layer for Physical AI": a set of tools for handling the multi-rate, multimodal data that robots produce, from first recordings through to large datasets for training and evaluation.

---

## The problem it targets

A robot stack produces images, video, point clouds, transforms, tensors, text, time series, meshes and maps, all at different rates. Debugging perception or control means lining these streams up in time and space, and building training sets means curating them at scale. Rerun aims to cover that whole loop with one data model.

## What's in it

- **Open-source SDK** for logging, storing, querying, transforming, visualizing and training on multimodal data
- **Native and web Viewer** for inspecting recordings and live streams
- **Dataframe and SQL queries** over recorded data
- **CLI** for working with recordings
- **Logging APIs** for Python, C++ and Rust
- **Local MCP server** that lets AI agents control a running Viewer
- **Rerun Hub**, a commercial production backend that catalogs and queries large collections in object storage, so teams can mix datasets without creating exported copies

## Robotics use cases

- Inspecting robotics and spatial data
- Debugging perception and control systems
- Aligning multiple sensor streams
- Querying and transforming recordings
- Curating datasets
- Streaming selected data into training

---

## Why it's worth a look

Most robotics teams end up with ad-hoc plotting scripts and one-off dataset exports. Rerun gives you a shared timeline-based viewer for debugging and a queryable store behind it, and the same recordings can feed training. The SDK is open source and works from Python, C++ or Rust, so it fits alongside most existing stacks, including ROS-based ones. The Hub is the paid part, aimed at teams managing datasets at scale; check the pricing page before committing to it.

---

*Source: [rerun.io](https://rerun.io/)*
