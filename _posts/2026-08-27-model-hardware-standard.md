---
layout: single
title: "Anthropic Model Hardware Standard (MHS): AI Agents for Lab and Factory Hardware"
date: 2026-08-27
permalink: /library/tools/robotics/2026/08/27/model-hardware-standard/
categories:
  - library
  - tools
tags: [mhs, lab-automation, robotics, ai-agents, mcp, hardware, manufacturing, anthropic, research-preview]
description: "Anthropic’s Model Hardware Standard (MHS) is a research preview specification for AI agents to discover, operate, and orchestrate programmable lab and manufacturing hardware — microscopes, liquid handlers, robotic arms, and more — via standardized drivers and MCP."
thumbnail: /_images/resources/model-hardware-standard.jpg
library_type: tools
redirect_from:
  - /resources/robotics/2026/08/27/model-hardware-standard/
---

Anthropic has opened a [research preview of the Model Hardware Standard (MHS)](https://www.anthropic.com/news/model-hardware-standard-research-preview) — a shared specification for AI agents to safely operate physical devices. Developed with HHMI Janelia Research Campus, MHS targets the long-standing integration problem in labs and factories: every instrument speaks its own protocol, setup takes weeks or months, and agents have no common way to discover devices or act on them safely.

---

## What it does

MHS introduces a **standardized driver** layer between an agent and programmable hardware. Devices expose simple read/write primitives (e.g. “get temperature”, “set temperature”) and a **discoverable format** so agents can find instruments on a network without bespoke glue code for each vendor stack.

Drivers also carry **natural-language tags** for operational context that rarely lives in code — arm payload limits, safety envelopes, calibration notes — and auto-generate a reference file describing what a device can measure, adjust, and enforce. Agents then orchestrate workflows through **MCP**, a **CLI**, or **code files**, chaining commands across multiple instruments in one script while supervising experiments at a higher level.

Early partners include Genentech (BCA protein assay automation across liquid handlers, arms, and plate readers), University of Washington Baker/Pinglay labs (remote qPCR monitoring and LeRobot plate handoffs), and work in quantum computing laser alignment where Claude iteratively adjusted optics and compiled the learned sequence into deterministic scripts.

---

## Why it's worth bookmarking

- **Model- and vendor-agnostic** — any agent harness can talk to any device with a programmable interface, not just Claude.
- **MCP-native** — fits the same Model Context Protocol ecosystem already spreading through robotics and dev tooling.
- **Built for safety** — explicit limits and device metadata are part of the spec, not an afterthought bolted onto ad-hoc integrations.
- **Research preview** — Anthropic is sharing early access with science and manufacturing partners ahead of open-sourcing the standard; [apply for access](https://www.anthropic.com/news/model-hardware-standard-research-preview) if you run lab automation or advanced manufacturing hardware.

For robotics programmes, MHS is a signal worth tracking: it sits at the intersection of **embodied AI**, **lab robotics**, and **industrial automation**, and could reduce the integration tax that keeps academic labs on manual bench work while factories run rigid, single-protocol lines.

---

*Announcement: [Previewing the Model Hardware Standard](https://www.anthropic.com/news/model-hardware-standard-research-preview) · Aug 27, 2026 · Anthropic*
