---
layout: single
title: "Text-to-CAD: AI-Powered CAD Design and Manufacturing"
date: 2026-07-07
permalink: /projects/2026/07/07/text-to-cad/
categories:
  - projects
  - ai-robotics
tags: [cad, ai-agents, design-automation, manufacturing, python, javascript, step-files, 3d-printing]
description: "Library for AI agents to generate and modify CAD files and robotics descriptions through natural language, with manufacturing integrations."
thumbnail: /_images/text-to-cad.png
---

# Text-to-CAD: Natural Language CAD Design

[Text-to-CAD](https://github.com/earthtojake/text-to-cad) is a powerful library that enables AI agents to generate, modify, and work with computer-aided design (CAD) files and robotics descriptions through natural language. It bridges the gap between AI and physical design by allowing agents to create manufacturing-ready designs without manual CAD work.

---

## Key Capabilities

### CAD Modeling
- Generate 3D models directly from natural language descriptions
- Export to industry-standard formats: STEP, STL, 3MF, and GLB
- Full geometry operations powered by OpenCASCADE

### Robot Description Files
Create standardized robotics descriptions with support for:
- **URDF** (Unified Robot Description Format)
- **SRDF** (Semantic Robot Description Format)
- **SDF** (Simulation Description Format)

### Design & Manufacturing
- **2D Design**: Create and export DXF drawings
- **G-code Generation**: Generate print instructions using real slicer tools
- **Part Sourcing**: Integrate with step.parts for off-the-shelf components
- **Manufacturing Integration**: Direct integration with SendCutSend and Bambu Labs printers

### Browser-Based Visualization
- Local, browser-based CAD visualization
- Real-time design previewing without external CAD software

---

## Technical Stack

Built primarily in **Python** and **JavaScript**, the project provides:

- Clean Python API for CAD operations
- JavaScript frontend for visualization
- Support for STEP file exports
- Integration with OpenCASCADE for robust geometry operations

---

## Use Cases

Text-to-CAD is particularly valuable for:

- **Rapid Prototyping**: Quickly iterate on design ideas through conversation
- **Automated Manufacturing**: Generate designs that can be directly sent to manufacturing partners
- **Robotics Development**: Create robot descriptions and associated CAD models in one workflow
- **Design Accessibility**: Enable non-CAD-experts to participate in design processes through natural language

---

## Community & Status

The project has **7.8k+ GitHub stars** with **896 forks** and maintains active development. Installation is available through the Skills CLI for agent platforms like Claude Code, making it easy to integrate into AI workflows.

Text-to-CAD exemplifies how AI agents can now participate meaningfully in hardware design, bringing automation and accessibility to traditionally manual CAD workflows.

---

**Repository**: [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad)
