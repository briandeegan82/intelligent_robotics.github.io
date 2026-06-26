---
layout: single
title: "RoboStack: Conda-Powered ROS 2 Without the Pain"
date: 2025-09-01
author: Dr. Brian Deegan
permalink: /tutorials/ros/2025/09/01/robostack-tutorial/
categories: [tutorials, ros]
tags: [robostack, conda, mamba, ros2, humble, jazzy, environment-management]
description: >
  A practical guide to installing ROS 2 via RoboStack — and why conda-based
  packaging is a game-changer compared to the traditional apt/source approach.
---

> **Prerequisites:** Basic familiarity with the terminal and with ROS 2 concepts
> (nodes, topics, packages). No prior conda experience required.

---

## What is RoboStack?

[RoboStack](https://robostack.github.io/) is a set of conda packaging recipes
that brings the entire ROS and ROS 2 ecosystems into the
[conda-forge](https://conda-forge.org/) packaging infrastructure. In practice,
this means you can install a fully functional ROS 2 environment with a single
`mamba install` command — on **Ubuntu, macOS, or Windows** — without touching
`apt`, without needing a specific Ubuntu version, and without root access.

It is maintained as an open-source community project and supports:

| Distribution | ROS Version | Status |
|---|---|---|
| Noetic | ROS 1 | Stable |
| Humble | ROS 2 | Stable (LTS) |
| Iron | ROS 2 | Stable |
| Jazzy | ROS 2 | Stable (LTS) |
| Rolling | ROS 2 | Nightly builds |

---

## Why Bother? RoboStack vs. Traditional ROS 2 Setup

Before diving into the installation, it is worth understanding the fundamental
differences between the two approaches.

### Traditional (apt / source) install

The official ROS 2 installation path ties you to a specific Ubuntu release via
Debian packages from `packages.ros.org`. Setting up a new machine typically
involves:

1. Adding a signed apt repository for your exact Ubuntu/Debian version
2. Installing with `apt install ros-humble-desktop`
3. Sourcing `/opt/ros/humble/setup.bash` in every terminal
4. Managing system-wide Python packages — often in conflict with your own
   projects
5. Repeating the entire process if you need a second ROS distribution

**The friction points are real:**
- Locked to one ROS version per Ubuntu release cycle
- Python dependency collisions with `pip`/system packages
- Root access required for installation and package management
- Non-trivial to run on macOS or Windows without a VM
- Reproducibility across machines requires careful manual documentation

### RoboStack (conda) install

RoboStack wraps every ROS package — and all its system-level dependencies
(OpenCV, PCL, Qt, Ogre, etc.) — as conda packages. Everything lives inside
an isolated conda environment.

| Feature | Traditional apt | RoboStack (conda) |
|---|---|---|
| Ubuntu version dependency | ✅ Hard lock | ❌ None |
| macOS support | ❌ No | ✅ Yes |
| Windows support | ❌ No (without WSL) | ✅ Yes |
| Root access required | ✅ Yes | ❌ No |
| Multiple ROS versions side-by-side | ⚠️ Painful | ✅ Trivial |
| Isolated Python environment | ❌ Shared system Python | ✅ Per-environment |
| Reproducible environments | ⚠️ Manual | ✅ `environment.yml` |
| CI/CD integration | ⚠️ Heavy Docker setup | ✅ Native conda runner |
| Custom packages from source | ✅ colcon build | ✅ colcon build (same) |

The key insight is that **conda environments are first-class citizens** — you
can have `ros2-humble`, `ros2-jazzy`, and `ros1-noetic` environments on the
same laptop and switch between them in seconds with `conda activate`.

---

## Installation

### Step 1 — Install Miniforge

Miniforge is a minimal conda installer that defaults to the `conda-forge`
channel. It ships with `mamba`, a drop-in replacement for `conda` written in
C++ that resolves packages dramatically faster.

**Linux / macOS:**

```bash
curl -L -O "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh"
bash Miniforge3-$(uname)-$(uname -m).sh
```

Follow the prompts. When asked whether to initialise conda in your shell,
choose **yes** (or run `conda init` manually afterwards). Close and reopen
your terminal.

**Windows:**

Download and run the
[Miniforge installer for Windows](https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Windows-x86_64.exe)
and use the resulting **Miniforge Prompt** or enable conda in PowerShell with:

```powershell
conda init powershell
```

Verify the installation:

```bash
mamba --version
# mamba 1.x.x
conda --version
# conda 24.x.x
```

---

### Step 2 — Create a ROS 2 Environment

Replace `ros2-humble` with your preferred environment name and `humble` with
your target ROS 2 distribution (`jazzy`, `iron`, etc.).

```bash
mamba create -n ros2-humble python=3.11
mamba activate ros2-humble
```

> **Python version guidance:**
> Humble targets Python 3.10; Jazzy targets Python 3.12. Specifying an
> explicit version avoids solver conflicts.

---

### Step 3 — Add the RoboStack Channel and Install ROS 2

```bash
# Add robostack-staging channel (contains nightly + release builds)
conda config --env --add channels robostack-staging
conda config --env --add channels conda-forge
conda config --env --set channel_priority strict

# Install ROS 2 Humble desktop (includes RViz2, rqt, demo nodes)
mamba install ros-humble-desktop
```

For a **headless / server** install (no GUI tools):

```bash
mamba install ros-humble-ros-base
```

For **Jazzy** on a modern Ubuntu 24.04 or macOS system:

```bash
mamba install ros-jazzy-desktop
```

The solver will pull in all system-level dependencies automatically — no
separate `rosdep install` step is needed for the core stack.

---

### Step 4 — Install the ROS 2 Environment Hooks

RoboStack uses conda activation hooks to source the ROS 2 setup scripts
automatically whenever you activate the environment.

```bash
mamba install conda-robostack-humble
```

> For Jazzy: `mamba install conda-robostack-jazzy`

Deactivate and reactivate for the hooks to take effect:

```bash
conda deactivate
mamba activate ros2-humble
```

Verify the installation:

```bash
ros2 --version
# ros2, version 0.18.x

printenv ROS_DISTRO
# humble
```

---

### Step 5 — Run a Quick Smoke Test

Open two terminals, activate the environment in each, then:

**Terminal 1 — publisher:**

```bash
mamba activate ros2-humble
ros2 run demo_nodes_cpp talker
```

**Terminal 2 — subscriber:**

```bash
mamba activate ros2-humble
ros2 run demo_nodes_py listener
```

You should see `[INFO] ... I heard: "Hello World: N"` in the second terminal.
If you do, your RoboStack installation is fully functional.

---

### Step 6 — Add Extra Packages

Any binary ROS package available on conda-forge can be added to the
environment at any time:

```bash
# Navigation2
mamba install ros-humble-navigation2

# slam-toolbox
mamba install ros-humble-slam-toolbox

# MoveIt 2
mamba install ros-humble-moveit

# RealSense SDK + ROS wrapper
mamba install ros-humble-realsense2-camera

# OAK-D / DepthAI
mamba install ros-humble-depthai-ros
```

Search for available packages:

```bash
mamba search 'ros-humble-*' | grep pointcloud
```

---

### Step 7 — Building Your Own Packages with colcon

RoboStack does not replace `colcon` — you still build custom packages exactly
as you would in a traditional workspace. The conda environment provides all
the system dependencies so `rosdep` is largely unnecessary for CI workflows.

```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws
colcon build --symlink-install
source install/setup.bash
```

Add `source ~/ros2_ws/install/setup.bash` to your conda activation hook if
you want it loaded automatically:

```bash
# Append to the activation hook inside the environment
HOOK="$CONDA_PREFIX/etc/conda/activate.d/ros_ws.sh"
echo "source ~/ros2_ws/install/setup.bash" >> "$HOOK"
```

---

## Reproducible Environments with environment.yml

One of the most compelling features of the conda approach is that your entire
development environment — ROS distribution, Python packages, ML libraries,
OpenCV version — can be captured in a single YAML file.

```yaml
# environment.yml
name: ros2-humble
channels:
  - robostack-staging
  - conda-forge
dependencies:
  - python=3.11
  - ros-humble-desktop
  - conda-robostack-humble
  - ros-humble-navigation2
  - ros-humble-slam-toolbox
  - ros-humble-depthai-ros
  - pytorch          # ML stack alongside ROS — no conflicts!
  - numpy
  - scipy
  - pip:
    - open3d
```

Reproduce the environment on any machine:

```bash
mamba env create -f environment.yml
mamba activate ros2-humble
```

This is enormously useful for:
- Onboarding new lab members or students in minutes
- Pinning a known-good environment for a publication artefact
- Running identical environments in GitHub Actions CI

---

## Common Gotchas

| Issue | Cause | Fix |
|---|---|---|
| `ros2` command not found after install | Hooks not loaded | `conda deactivate && mamba activate <env>` |
| GUI tools (RViz2, rqt) fail on macOS | Missing display backend | `mamba install compilers cmake pkg-config make ninja` and ensure XQuartz is running |
| `colcon` not found | Not installed in env | `mamba install colcon-common-extensions` |
| Slow `conda` solver | Using conda instead of mamba | Always use `mamba install`, never `conda install` for ROS packages |
| Package not found | Wrong channel priority | Ensure `channel_priority strict` and channels set per-environment |
| `libGL` errors on headless server | Missing Mesa libs | `mamba install mesa-libgl-cos7-x86_64` |

---

## Running Multiple ROS Distributions Side-by-Side

This is trivially simple with RoboStack — and essentially impossible with the
traditional apt approach without Docker:

```bash
# Create a Noetic (ROS 1) environment
mamba create -n ros1-noetic python=3.9
mamba activate ros1-noetic
mamba install ros-noetic-desktop conda-robostack-noetic

# Create a Jazzy (ROS 2) environment
mamba create -n ros2-jazzy python=3.12
mamba activate ros2-jazzy
mamba install ros-jazzy-desktop conda-robostack-jazzy
```

Switch between them instantly:

```bash
mamba activate ros1-noetic  # ROS_DISTRO=noetic
mamba activate ros2-jazzy   # ROS_DISTRO=jazzy
```

---

## Summary

RoboStack removes most of the environmental friction that makes ROS 2 hard
to teach and hard to reproduce. For a robotics lab context, the benefits are
particularly compelling:

- **Students get a working environment on their own laptops** (Linux, macOS,
  Windows) without needing a specific Ubuntu version or a VM.
- **Lab setups are reproducible** — a single `environment.yml` captures the
  entire stack.
- **Deep learning and ROS can share the same environment** — PyTorch,
  TensorFlow, and Open3D install cleanly alongside ROS packages without the
  Python version conflicts that plague the traditional approach.
- **CI/CD is simpler** — GitHub Actions and GitLab CI can activate a conda
  environment directly, no Docker image maintenance required.

The colcon build workflow, package structure, and ROS 2 concepts remain
identical — RoboStack changes only the *delivery mechanism*, not the
programming model.

---

## Further Reading

- [RoboStack Documentation](https://robostack.github.io/)
- [RoboStack GitHub](https://github.com/RoboStack)
- [Miniforge Releases](https://github.com/conda-forge/miniforge/releases)
- [Mamba Documentation](https://mamba.readthedocs.io/)
- [conda-forge ROS packages](https://prefix.dev/channels/robostack-staging)

---

*Posted as part of the [MSc in Intelligent Robotics](https://www.universityofgalway.ie/)
resource series at the University of Galway. Questions or corrections?
Open an issue on the
[course GitHub](https://github.com/briandeegan82/intelligent_robotics.github.io).*
