---
layout: single
title: "MuJoCo for Humanoid Robotics: A Practical Learning Path"
date: 2026-07-15
permalink: /resources/robotics/2026/07/15/mujoco-humanoid-learning-path/
categories:
  - resources
  - robotics
tags: [mujoco, humanoid, locomotion, reinforcement-learning, imitation-learning, sim-to-real, unitree, mjlab, isaac-lab, learning-path]
description: "Goal: Go from 'I've never opened MuJoCo' to training and deploying humanoid locomotion (and eventually whole-body) policies on real robot platforms — without getting lost in oversized research"
thumbnail: /_images/mujoco-banner.png
---

![MuJoCo banner]({{ site.baseurl }}/_images/mujoco-banner.png){: .align-center style="max-width: 700px;"}

> **Goal:** Go from "I've never opened MuJoCo" to training and deploying humanoid locomotion (and eventually whole-body) policies on real robot platforms — without getting lost in oversized research codebases.

---

## Why Start With MuJoCo?

With Isaac Sim, Isaac Lab, Gazebo, Webots, Genesis, and others all competing for attention, it's reasonable to ask why MuJoCo is still the recommended starting point for humanoid RL in 2026. A few reasons stand out:

- **It's the lingua franca of locomotion research.** DeepMimic, AMP (Adversarial Motion Priors), ASE (Adversarial Skill Embeddings), and a large fraction of PPO-based locomotion papers were built on MuJoCo. If you can read and write MJCF and understand MuJoCo's API, a huge slice of the humanoid RL literature becomes accessible.
- **A gentler learning curve than industrial simulators.** MuJoCo focuses on physics, robot models, control, and RL — not rendering pipelines, GPU clusters, or heavy middleware. That makes it easier to see *what's actually happening* under the hood.
- **Contact dynamics that actually hold up.** Foot placement, ground reaction forces, slipping, and balance recovery are the heart of bipedal locomotion, and MuJoCo's contact solver has been battle-tested for exactly this for years.
- **MJCF is readable.** Bodies, joints, sensors, actuators, and constraints are all expressed in a relatively human-friendly XML format, which makes iterating on robot models fast.
- **A mature Python ecosystem** — NumPy, JAX, PyTorch, Gymnasium, Stable-Baselines3, CleanRL, dm_control — means you spend your time on algorithms, not plumbing.
- **The Unitree ecosystem has converged on it.** Both `unitree_mujoco` (sim-to-real for G1/H1/Go2 etc.) and the newer `unitree_rl_mjlab` training stack use MuJoCo as the physics backend, so skills learned here transfer directly to real hardware workflows.

### When you might reach for something else

- **Isaac Lab / Isaac Sim** — if you need massive GPU-parallel training, photorealistic rendering, or you're committed to NVIDIA's ecosystem.
- **Gazebo** — if your priority is tight ROS 2 integration and "traditional" robotics middleware workflows (this will feel familiar territory if you've worked with ROS 2 + Gazebo/Webots before).
- **Genesis** — if you're chasing emerging differentiable-simulation and generative-robotics research.

**Bottom line:** MuJoCo isn't the only simulator worth knowing, but it remains the best *first* simulator for understanding dynamics, control, RL, and motion imitation — and everything you learn transfers cleanly to Isaac Lab, Gazebo, or Genesis later.

For a wider view of how these tools compare on physics fidelity, sensor realism, and ROS 2 integration, see our [simulation environments overview]({{ site.baseurl }}/tutorials/simulation/2025/06/08/robotics-simulators-overview/) — this post picks up where that one leaves off, and goes deep on the humanoid RL path specifically.

---

## The Roadmap

### Phase 1 — MuJoCo Fundamentals

**Objective:** Understand the simulator before you try to train anything.

Core concepts to nail down:
- MJCF robot descriptions
- Joints and actuators
- Contact dynamics
- Sensors
- Constraints
- PD control
- State observations

**Resources:**
- [MuJoCo Documentation](https://mujoco.readthedocs.io) — still the most important single resource.
- [MuJoCo GitHub repo](https://github.com/google-deepmind/mujoco) — study the examples, MJCF models, Python API, and viewer tools.
- [DeepMind Control Suite (dm_control)](https://github.com/google-deepmind/dm_control) — simple, well-understood tasks (Cartpole, Walker, Cheetah, Humanoid) that are great for learning how observations and rewards are structured.

**Milestone:** Build your own MJCF model, load it, apply torques, read sensors, and write a basic controller.

---

### Phase 2 — Reinforcement Learning for Locomotion

**Objective:** Train your first walking policy.

Avoid large humanoid stacks at this stage — focus on the fundamentals:
- PPO and SAC
- Reward design
- Curriculum learning
- Domain randomization

**Resources:**
- [LocoMuJoCo](https://loco-mujoco.readthedocs.io) — purpose-built for locomotion, cleaner than industrial stacks, includes benchmark datasets and imitation-learning support. A great first "real" project.
- [Stable-Baselines3](https://github.com/DLR-RM/stable-baselines3) — the simplest way to get PPO, SAC, TD3, and A2C running.
- [CleanRL](https://github.com/vwxyzjn/cleanrl) — single-file, highly readable implementations if you want to understand what's happening inside the algorithm rather than treating it as a black box.

**Milestone:** Train a humanoid to walk, tune rewards, visualize trajectories, and compare algorithms against each other.

---

### Phase 3 — Imitation Learning

**Objective:** Move from handcrafted rewards to learning from demonstrations — which is how most modern humanoid motion is actually produced.

Topics:
- Behavioral Cloning
- DAgger
- Motion tracking
- Offline RL
- Diffusion policies

**Resources:**
- [LocoMuJoCo motion datasets](https://loco-mujoco.readthedocs.io) — ready-made locomotion trajectories for imitation learning.
- [robomimic](https://github.com/ARISE-Initiative/robomimic) — one of the most mature open-source imitation-learning frameworks.
- [LeRobot](https://github.com/huggingface/lerobot) — Hugging Face's rapidly-growing robot learning toolkit; useful both for imitation learning and as a bridge into the broader embodied-AI ecosystem.

**Milestone:** Train from demonstrations, reproduce a reference walking motion, and track a target trajectory.

---

### Phase 4 — Real Humanoid Platforms

**Objective:** Move from abstract "humanoid" models to robot descriptions that correspond to actual hardware.

**Resource:**
- [Unitree MuJoCo](https://github.com/unitreerobotics/unitree_mujoco) — real robot models (G1, H1, Go2, and others), SDK integration, and sim-to-real workflows.

**Learn:**
- Observation pipelines
- State estimation
- PD control on real actuators
- Motor limits and safety constraints

**Milestone:** Understand *why* a simulated robot behaves differently from the real one — latency, actuator limits, sensor noise — and why domain randomization exists.

> **A note for ROS 2 users:** if your background is in ROS 2 (e.g. `ros2_control`, controller managers, hardware interfaces), this phase will feel familiar. The Unitree SDK plays a similar role to a `ros2_control` hardware interface — it's the boundary between your trained policy and the real actuators. Many people wrap the trained MuJoCo policy in a small ROS 2 node that subscribes to state topics and publishes joint commands, which lets it slot into an existing navigation/perception stack the same way a differential-drive or VIO node would.

---

### Phase 5 — Modern Humanoid RL

**Objective:** Train policies closer to current state-of-the-art systems — walking, running, turning, and recovery.

**Resource:**
- [unitree_rl_mjlab](https://github.com/unitreerobotics/unitree_rl_mjlab) — Unitree's current MuJoCo-based RL stack, supporting Go2, A2, As2, G1, R1, H1_2, and H2. It's built on top of **[mjlab](https://github.com/mujocolab/mjlab)**, which essentially ports Isaac Lab's training API onto a MuJoCo/MuJoCo-Warp physics backend — so you get Isaac-Lab-style ergonomics (vectorized training, `train` / `play` workflow, Weights & Biases checkpointing) without leaving the MuJoCo ecosystem. Motion imitation in this stack is handled via **[BeyondMimic](https://github.com/HybridRobotics/whole_body_tracking)**-style whole-body tracking.

Study topics:
- Curriculum learning
- Teacher–student policies
- Motion priors
- Privileged information
- Policy distillation

**Milestone:** Train walking, running, turning, and recovery behaviors on a real humanoid model (G1/H1-class), and export a deployable policy (e.g. ONNX) for sim-to-real testing.

---

### Phase 6 — Benchmarking Against Research

**Objective:** Compare your methods against published results.

**Resources:**
- [HumanoidBench](https://github.com/carlosferrazza/humanoid-bench) — standardized humanoid evaluation tasks for comparing algorithms and reproducing papers.
- [Isaac Lab](https://github.com/isaac-sim/IsaacLab) — the dominant large-scale robot-learning framework; useful once you want GPU-parallel training at scale (and note that `mjlab` from Phase 5 deliberately mirrors its API, so the transition is smoother than it used to be).
- [ManiSkill](https://github.com/haosulab/ManiSkill) — manipulation- and embodied-AI-focused benchmark, useful once locomotion stops being the bottleneck.

---

### Phase 7 — Whole-Body Humanoid Robotics

**Objective:** Combine locomotion with manipulation, balance, and perception — the actual end goal for most humanoid platforms.

Areas to explore:
- **Whole-body control** — QP-based control, operational-space control, MPC
- **Embodied AI / VLA models**:
  - [OpenPI](https://github.com/Physical-Intelligence/openpi)
  - [LeRobot](https://github.com/huggingface/lerobot)
  - [OpenVLA](https://github.com/openvla/openvla)

**Milestone:** A robot that can walk to an object, grasp it, carry it, and navigate around obstacles — locomotion, manipulation, and perception working together.

---

## Key Papers Worth Reading

| Area | Papers |
|---|---|
| Simulation | *MuJoCo: A Physics Engine for Model-Based Control* |
| RL | PPO, SAC, DreamerV3 |
| Humanoid control | DeepMimic, AMP (Adversarial Motion Priors), ASE (Adversarial Skill Embeddings) |
| Sim-to-real | Rapid Motor Adaptation (RMA), *Learning Agile Skills via Reinforcement Learning* |

---

## Recommended Order

If you're starting today:

1. MuJoCo Documentation
2. DeepMind Control Suite
3. Stable-Baselines3
4. LocoMuJoCo
5. robomimic
6. Unitree MuJoCo
7. unitree_rl_mjlab (built on mjlab)
8. HumanoidBench
9. Isaac Lab
10. Whole-body manipulation research (OpenPI, LeRobot, OpenVLA)

---

## Final Advice

Most beginners try to start with the hardest, most "state of the art" repositories first, then get stuck on dependency hell and research-grade code with no comments. The better path:

1. Learn MuJoCo.
2. Learn locomotion.
3. Learn imitation learning.
4. Learn sim-to-real.
5. *Then* tackle the modern humanoid stacks.

A rough effort split:

- **~20%** of your time — MuJoCo fundamentals + LocoMuJoCo.
- **~80%** of your time — the Unitree ecosystem (`unitree_mujoco` → `unitree_rl_mjlab`/`mjlab`), HumanoidBench, and whole-body research.

That ordering gives you a solid theoretical foundation *and* skills that transfer directly to real humanoid hardware.

---

## Extra Notes

- **mjlab is worth tracking on its own.** Because it mirrors the Isaac Lab API while running on MuJoCo/MuJoCo-Warp, it's becoming a common "middle ground" — Isaac-Lab-style scaling without the full Isaac Sim install. If GPU-parallel training matters to you early on, it may be worth pulling into Phase 2 rather than waiting until Phase 5.
- **MuJoCo Warp** (the GPU-accelerated MuJoCo backend used by `mjlab`) is the piece that lets MuJoCo-based stacks compete with Isaac Lab on training throughput — worth a glance once you hit Phase 5's performance limits.
- **BeyondMimic / whole-body tracking** is the current reference point for motion-imitation pipelines in the Unitree stack — useful to read once you reach Phase 3/5 and want to go from "walking" to "reproducing arbitrary motion-capture clips."
- **If you're coming from ROS 2** (controllers, `ros2_control`, DDS-based middleware), the conceptual mapping is: MJCF model ≈ URDF + simulation config, MuJoCo's PD/torque control ≈ a `ros2_control` hardware interface, and the trained policy's ONNX export ≈ a controller plugin you'd load at runtime. The RL/training loop itself has no direct ROS 2 analogue — that's the genuinely new piece.
