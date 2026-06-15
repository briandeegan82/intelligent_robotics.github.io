---
layout: single
title: "Raspberry Pi Camera Pipeline Optimization"
date: 2025-06-06
categories: robotics hardware
tags: [raspberry-pi, camera, libcamera, optimization, vision]
---

For robotics, the fastest camera pipeline on a Raspberry Pi is usually:

```text
Camera Sensor
    ↓
ISP (hardware)
    ↓
libcamera
    ↓
DMA buffers
    ↓
Your vision node
    ↓
ROS 2 transport
```

The key principle is: **avoid copies, avoid format conversions, and avoid unnecessary ROS messages.**

---

# The modern Pi camera stack

Older Raspberry Pi tutorials often use:

```text
OpenCV VideoCapture
```

or

```text
picamera
```

These are often not optimal anymore.

The modern stack is:

```text
Sensor
 → libcamera
 → DMA buffer
 → Application
```

where the camera driver allocates memory and passes references rather than repeatedly copying frames.

The relevant software component is [libcamera](https://www.libcamera.org?utm_source=chatgpt.com).

---

# Understanding where copies happen

A naive pipeline looks like:

```text
Sensor
 ↓
Kernel buffer
 ↓ copy
libcamera
 ↓ copy
OpenCV Mat
 ↓ copy
ROS Image
 ↓ copy
Subscriber
```

At 1080p 30 FPS:

```text
1920 × 1080 × 3 bytes
≈ 6 MB/frame
```

At 30 FPS:

```text
≈ 180 MB/s
```

per copy.

Four copies can easily exceed:

```text
700 MB/s
```

of memory traffic.

The CPU often spends more time moving pixels than processing them.

---

# Use YUV whenever possible

A huge mistake is forcing RGB too early.

Many vision tasks only need:

```text
Y channel (grayscale)
```

Examples:

* AprilTags
* ArUco markers
* Optical flow
* Line following
* Feature extraction
* SLAM front ends

Instead of:

```text
YUV
 → RGB
 → grayscale
```

use:

```text
YUV
 → algorithm
```

directly.

This can save a substantial amount of CPU.

---

# Resize before processing

Don't do:

```text
1920x1080 capture
 ↓
algorithm
```

when:

```text
640x480
```

would work.

Pixel count:

```text
1080p  = 2.07 million pixels
480p   = 0.31 million pixels
```

That's nearly a 7× reduction in work.

For robotics:

| Task             | Typical Resolution  |
| ---------------- | ------------------- |
| Line following   | 320×240             |
| AprilTags        | 640×480             |
| Visual odometry  | 640×480             |
| Object detection | 640×640             |
| Mapping          | 640×480 to 1280×720 |

Capture only what you need.

---

# Use DMA-backed buffers

The fastest architecture keeps image data in DMA buffers.

Conceptually:

```text
Sensor
 ↓ DMA
Buffer A
Buffer B
Buffer C
```

The ISP writes directly into these buffers.

Your application receives handles rather than repeatedly allocating memory.

Modern libcamera APIs are built around this concept.

---

# OpenCV can accidentally destroy performance

Many examples do:

```cpp
cv::Mat frame;
camera >> frame;
```

This often introduces conversions and memory copies.

Profile before assuming OpenCV is free.

Common expensive operations:

```cpp
cv::cvtColor()
cv::resize()
cv::clone()
```

Repeated per frame.

---

# ROS 2 image transport considerations

The classic ROS pattern:

```text
Camera Node
 ↓
sensor_msgs/Image
 ↓
Vision Node
 ↓
Detection Node
```

creates multiple opportunities for copies.

---

# Use ROS 2 intra-process communication

Enable:

```cpp
NodeOptions().use_intra_process_comms(true);
```

Then:

```text
Publisher
 ↓
Subscriber
```

within the same process can exchange ownership instead of copying.

This is one of the biggest ROS 2 wins.

---

# Component containers

Instead of:

```text
camera_node
vision_node
tag_node
```

as separate processes:

Run them in one component container:

```text
Component Container
 ├─ Camera
 ├─ Vision
 └─ Detection
```

Benefits:

* lower latency
* fewer copies
* less serialization

This is often worth more than CPU optimization.

---

# Loaned messages

ROS 2 supports loaned messages.

Conceptually:

```text
Allocate once
Reuse forever
```

rather than:

```text
Allocate
Copy
Free
Allocate
Copy
Free
```

every frame.

Support depends on middleware and message type, but when available it reduces allocations dramatically.

---

# Shared memory transport

For large images:

Consider shared-memory transports.

Examples include:

* [Eclipse Cyclone DDS](https://cyclonedds.io?utm_source=chatgpt.com) shared-memory support
* [iceoryx](https://iceoryx.io?utm_source=chatgpt.com) based transports

Instead of:

```text
serialize
copy
deserialize
```

you get:

```text
shared memory
```

between processes.

For multi-camera systems this can save significant CPU.

---

# Best architecture for a Pi robot

For a camera-heavy robot I'd structure things like:

```text
Camera
 ↓
libcamera
 ↓
Vision Component
 ↓
Detector Component
 ↓
Tracker Component
 ↓
Planner
```

all inside a single ROS 2 component container.

Then:

```text
Planner
 ↓
Microcontroller
```

for motor control.

This minimizes:

* serialization
* context switches
* memory copies

while keeping ROS 2 modular.

---

# CPU affinity helps

Reserve cores.

Example on a Pi 5:

```text
Core 0:
  OS

Core 1:
  Camera

Core 2:
  Vision

Core 3:
  SLAM

Core 4:
  Planning

Core 5:
  Navigation

Core 6:
  AI

Core 7:
  Spare
```

Use:

```bash
taskset
```

or cgroups/cpusets.

Camera processing becomes much more deterministic.

---

# The "maximum-performance" Pi vision stack

If I were building a high-performance robotics system today on a Pi 5:

```text
Camera Module 3
 ↓
libcamera
 ↓
DMA buffers
 ↓
YUV420 frames
 ↓
ROS 2 component container
    ├─ Vision
    ├─ Tracking
    └─ Detection
 ↓
Intra-process comms
 ↓
Cyclone DDS shared memory
 ↓
Planning
 ↓
Microcontroller
```

Avoid:

```text
RGB conversions
Frame cloning
Separate processes
Python image pipelines
Unnecessary resizing
Repeated allocations
```

Those five mistakes are responsible for the majority of lost video performance on Raspberry Pi robotics projects.
