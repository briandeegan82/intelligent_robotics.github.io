---
layout: single
title: "SolidCraft: Open-Source Parametric CAD in Rust, with URDF Export and an MCP Server"
date: 2026-10-29
permalink: /library/references/robotics/2026/10/29/solidcraft-open-source-rust-parametric-cad/
categories:
  - library
  - references
tags: [open-source, cad, rust, mcp, urdf, step, design-tools, ai-agents]
description: "SolidCraft from Tangency Labs is an open-source parametric 3D CAD application written in Rust. It runs on the desktop, in the browser and headless, exports URDF, and includes an MCP server so AI agents can build models."
library_type: references
---

**SolidCraft** from Tangency Labs is an open-source parametric 3D CAD application written entirely in Rust. You sketch, add constraints and build solids on an editable feature timeline, and changing a dimension rebuilds the model. The same commands run in the desktop app, in the browser (WASM), from a headless CLI and through a built-in **Model Context Protocol (MCP)** server for AI agents.

---

## What's in it

- **Sketches and constraints:** lines, arcs, splines and text, solved by the project's own constraint solver, with dimensions driven by parameters
- **Features:** extrude, revolve, sweep, loft, fillet, chamfer, shell, draft, holes, threads, patterns, mirror, split and combine
- **Parameters and configurations** with unit-aware expressions
- **Assemblies** with joints, motion studies, contact sets, interference checks and mass properties
- **Sheet metal** (flanges, hems, fold/unfold, flat patterns) and plastic enclosure features
- **File formats:** STEP, IGES, 3MF, STL, OBJ and glTF, plus **URDF export**
- **Scripting:** a JSON list of the same commands the UI runs, executed with `solidcraft-cli run`

---

## Why it matters for robotics

- **URDF export from assemblies with joints** shortens the step from a CAD model to a robot description you can load in ROS, Isaac Sim or MuJoCo-based tooling.
- **The MCP server** (`solidcraft-cli mcp`) lets an agent such as Claude Code create and edit parametric parts. It can run its own headless session, or with `--connect` drive the running app so you can watch the agent work.
- **Scriptable, headless builds** mean brackets, mounts and enclosures can be generated from parameters in CI, the way code is.

---

## Maturity

The README calls it "early but usable for simple parts". The team checks it against 76 public reference parts by comparing volume, area, centre of mass and bounding box with analytic or FreeCAD-computed values, and 75 of the 76 match; the remaining one is a tracked bug. It is dual-licensed MIT or Apache-2.0 and is developed under clean-room contribution rules. Builds are available for Windows, macOS, Linux (AppImage, Snap, Flatpak, .deb, .rpm) and the web. I haven't tested it on a real robot design, so expect gaps compared with established CAD packages for complex assemblies.

---

*Source: [tangency-labs/solidcraft on GitHub](https://github.com/tangency-labs/solidcraft) · [solidcraft.io](https://solidcraft.io)*
