---
layout: single
title: "LeRobot + SO-101 Pick-and-Place Setup & Training Guide"
date: 2025-06-03
permalink: /robotics/hardware/2025/06/03/lerobot_so_101_pick_place_setup_training_guide/
categories:
  - tutorials
  - hardware
tags: [lerobot, so-101, robot-arm, pick-and-place, training]
---

# LeRobot + SO-101 Pick-and-Place Setup & Training Guide

This guide walks through:

1. Hardware setup for the SO-101 robot arm
2. Installing LeRobot
3. Configuring and calibrating the arms
4. Collecting a pick-and-place dataset
5. Training a policy model
6. Running inference on the robot
7. Common troubleshooting tips

The workflow is designed for a standard teleoperation setup:

- 1x SO-101 Leader Arm
- 1x SO-101 Follower Arm
- USB camera
- Linux or macOS workstation with Python
- NVIDIA GPU recommended for training

---

# 1. Hardware Requirements

## Recommended System

### Minimum

- 16 GB RAM
- Quad-core CPU
- USB 3.0 ports
- 50+ GB free disk space

### Recommended for Training

- NVIDIA RTX 3060 or better
- CUDA-capable GPU with 8–24 GB VRAM
- Ubuntu 22.04
- Python 3.10+

## Robot Components

You will need:

- SO-101 Leader Arm
- SO-101 Follower Arm
- Feetech STS3215 motors
- Motor bus controller boards
- 5V or 12V power supplies (matching your motors)
- USB cables
- Camera (Logitech C920/C922 works well)
- Stable desk or mounting plate

Official SO-101 assembly docs:

- https://huggingface.co/docs/lerobot/so101
- https://huggingface.co/docs/lerobot/main/en/assemble_so101

---

# 2. Install LeRobot

## Clone the Repository

```bash
git clone https://github.com/huggingface/lerobot.git
cd lerobot
```

## Create Python Environment

Using conda:

```bash
conda create -n lerobot python=3.10 -y
conda activate lerobot
```

Or using venv:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## Install Dependencies

```bash
pip install -U pip
pip install -e ".[feetech]"
```

## Install PyTorch

Example for CUDA 12.1:

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

Verify installation:

```bash
python -c "import torch; print(torch.cuda.is_available())"
```

Expected output:

```bash
True
```

---

# 3. Configure the SO-101 Motors

## Find Motor Ports

Connect each controller board via USB and power.

Run:

```bash
lerobot-find-port
```

You should see something like:

```bash
/dev/ttyUSB0
/dev/ttyUSB1
```

Write down:

- Leader arm port
- Follower arm port

---

## Configure Follower Motors

Run:

```bash
lerobot-setup-motors \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyUSB0
```

The script will ask you to connect each motor individually.

Follow the prompts carefully.

---

## Configure Leader Motors

Run:

```bash
lerobot-setup-motors \
  --teleop.type=so101_leader \
  --teleop.port=/dev/ttyUSB1
```

Again, configure each motor one-by-one.

---

# 4. Calibrate the Robot

Calibration is critical.

Poor calibration causes:

- inaccurate motion
- jitter
- failed imitation learning
- poor pick-and-place performance

## Run Calibration

```bash
python -m lerobot.calibration.run \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyUSB0
```

Repeat for the leader arm.

### Calibration Tips

- Place arms on a flat table
- Ensure joints are mechanically aligned
- Tighten loose screws
- Recalibrate after collisions
- Avoid cable tension on joints

---

# 5. Connect the Camera

LeRobot uses camera observations during training.

## Test Camera

Check connected devices:

```bash
v4l2-ctl --list-devices
```

Test camera stream:

```bash
ffplay /dev/video0
```

Recommended settings:

- Resolution: 640x480
- FPS: 30
- Fixed lighting
- Static background

Mount the camera so it sees:

- workspace
- object
- gripper
- drop zone

Top-down or angled-front views work best.

---

# 6. Build the Pick-and-Place Environment

Start simple.

## Recommended First Task

Pick up:

- colored cube
- foam block
- small bottle

Place into:

- bowl
- marked square
- tray

## Environment Setup Tips

### Use:

- high contrast colors
- consistent lighting
- uncluttered backgrounds
- fixed object positions initially

### Avoid:

- reflective surfaces
- transparent objects
- changing shadows
- crowded scenes

---

# 7. Teleoperate the Robot

The leader arm controls the follower arm.

## Start Teleoperation

Example:

```bash
python -m lerobot.teleoperate \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyUSB0 \
  --teleop.type=so101_leader \
  --teleop.port=/dev/ttyUSB1
```

Test:

- smooth motion
- gripper open/close
- joint synchronization
- no oscillation

If movement is jerky:

- reduce cable tension
- recalibrate
- check motor IDs
- reduce camera FPS

---

# 8. Record Demonstrations

Imitation learning quality depends heavily on dataset quality.

## Goal

Record clean demonstrations of:

1. approach object
2. grasp object
3. lift object
4. move to target
5. release object
6. return home

---

## Recording Dataset

Example command:

```bash
python -m lerobot.record \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyUSB0 \
  --teleop.type=so101_leader \
  --teleop.port=/dev/ttyUSB1 \
  --camera.index=0 \
  --dataset.repo_id=my_pick_place_dataset
```

You will teleoperate while LeRobot records:

- images
- joint states
- actions
- timestamps

---

## Dataset Collection Best Practices

### Recommended:

- 50–200 demonstrations
- 5–15 seconds each
- smooth trajectories
- consistent grasp strategy
- varied object positions

### Include:

- slight variations
- small perturbations
- recovery motions

### Avoid:

- failed grasps
- abrupt motions
- camera bumps
- partially visible objects

---

# 9. Inspect the Dataset

Before training, verify the dataset.

## Check Samples

```bash
python -m lerobot.dataset.visualize \
  --dataset.repo_id=my_pick_place_dataset
```

Look for:

- synchronized video/actions
- proper timestamps
- visible objects
- smooth trajectories

Bad data will destroy policy quality.

---

# 10. Train the Policy

## Recommended First Model: ACT

ACT works well for beginner SO-101 tasks.

Advantages:

- stable
- data efficient
- easier than diffusion models
- works with smaller datasets

---

## Start Training

Example:

```bash
python -m lerobot.train \
  --dataset.repo_id=my_pick_place_dataset \
  --policy.type=act \
  --output_dir=outputs/pick_place_act
```

Training may take:

- 30 minutes to several hours
- depending on GPU and dataset size

---

## Monitor Training

Watch:

- training loss
- validation loss
- checkpoint saves

Good signs:

- smooth loss decrease
- stable validation curve

Bad signs:

- exploding loss
- severe overfitting
- frozen learning

---

# 11. Run Inference on the Robot

After training:

```bash
python -m lerobot.infer \
  --policy.path=outputs/pick_place_act/checkpoints/latest \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyUSB0 \
  --camera.index=0
```

The robot should:

- observe scene
- move toward object
- grasp
- place object

Expect imperfect behavior initially.

Usually the first successful policy requires:

- several training iterations
- dataset cleanup
- calibration refinement

---

# 12. Improve Performance

## Increase Dataset Diversity

Add:

- different object positions
- different lighting
- small orientation changes
- slight workspace variations

## Improve Camera Setup

A better camera setup often improves performance more than larger models.

### Recommended:

- stable mount
- consistent exposure
- no motion blur
- visible gripper

---

## Collect Recovery Demonstrations

Include examples where:

- grasp slips
- object shifts
- robot retries

This significantly improves robustness.

---

# 13. Advanced Training Options

## Diffusion Policy

More powerful but harder to train.

Example:

```bash
python -m lerobot.train \
  --dataset.repo_id=my_pick_place_dataset \
  --policy.type=diffusion
```

Requires:

- more GPU memory
- larger datasets
- longer training

---

## Multi-Camera Training

You can add:

- wrist camera
- side camera
- top camera

This improves:

- depth perception
- grasp reliability
- generalization

---

# 14. Recommended Training Strategy

For beginners:

## Phase 1

- fixed object location
- fixed drop location
- single object
- ACT policy
- 50 demonstrations

## Phase 2

- randomize object positions
- increase demonstrations
- improve camera placement

## Phase 3

- multiple objects
- clutter
- harder grasps
- diffusion policy

---

# 15. Common Problems

## Robot Jerks or Vibrates

Possible causes:

- bad calibration
- loose screws
- wrong motor IDs
- power instability

Fix:

- recalibrate
- tighten hardware
- verify motor config

---

## Policy Does Nothing

Usually caused by:

- poor dataset
- failed camera feed
- mismatched checkpoint
- normalization issues

Fix:

- inspect dataset visually
- retrain
- recollect demonstrations

---

## Grasping Fails Frequently

Try:

- larger objects
- slower motions
- improved lighting
- more demonstrations
- better gripper alignment

---

# 16. Practical Advice

The biggest improvements usually come from:

1. Better calibration
2. Better demonstrations
3. Better camera placement
4. Cleaner environments

Not larger models.

For first success:

- keep the task extremely simple
- constrain the environment
- use large easy-to-grasp objects
- prioritize consistency over complexity

---

# 17. Useful Resources

LeRobot Documentation:

- https://huggingface.co/docs/lerobot

SO-101 Documentation:

- https://huggingface.co/docs/lerobot/so101

Assembly Guide:

- https://huggingface.co/docs/lerobot/main/en/assemble_so101

NVIDIA SO-101 Sim-to-Real:

- https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/

GitHub:

- https://github.com/huggingface/lerobot

---

# 18. Recommended Beginner Workflow

If your goal is a reliable first pick-and-place success:

1. Assemble carefully
2. Calibrate thoroughly
3. Use one camera
4. Use one cube
5. Use fixed lighting
6. Record 50–100 clean demos
7. Train ACT
8. Evaluate
9. Re-record bad demonstrations
10. Retrain

This approach is much faster than jumping directly into large VLA models or diffusion policies.

---

# References

The setup and configuration process in this guide is based on the official LeRobot SO-101 documentation and community workflows.

