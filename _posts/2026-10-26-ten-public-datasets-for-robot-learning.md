---
layout: single
title: "Ten Public Datasets for Robot Learning Without a Robot"
date: 2026-10-26
permalink: /library/references/robotics/2026/10/26/ten-public-datasets-for-robot-learning/
categories:
  - library
  - references
tags: [datasets, robot-learning, imitation-learning, autonomous-driving, slam, visual-odometry, sensor-fusion, computer-vision]
description: "Akshet Patel's list of ten public datasets for learning robot manipulation, imitation learning, driving, SLAM and sensor fusion without owning hardware."
library_type: references
---

Akshet Patel shared a list of ten public datasets for learning robot learning and computer vision without owning a robot. They cover manipulation, imitation learning, autonomous driving, camera perception, visual odometry, SLAM and sensor fusion.

---

## Manipulation and imitation learning

- [Hugging Face Datasets](https://huggingface.co/datasets): hub for community robotics and vision datasets
- [Open X-Embodiment](https://robotics-transformer-x.github.io/): large cross-robot manipulation collection
- [DROID](https://droid-dataset.github.io/): in-the-wild manipulation demonstrations
- [BridgeData V2](https://rail-berkeley.github.io/bridgedata/): tabletop manipulation demonstrations

## Driving and perception

- [KITTI](https://www.cvlibs.net/datasets/kitti/)
- [nuScenes](https://www.nuscenes.org/)
- [Waymo Open Dataset](https://waymo.com/open/)
- [Oxford RobotCar](https://robotcar-dataset.robots.ox.ac.uk/)

## SLAM and visual odometry

- [TUM RGB-D](https://cvg.cit.tum.de/data/datasets/rgbd-dataset)
- [EuRoC MAV](https://projects.asl.ethz.ch/datasets/doku.php?id=kmavvisualinertialdatasets)

---

## Caveats and advice

Some of these require registration, some are licensed for research use only, and some are large downloads. Check the terms before you build anything on them.

Akshet's advice for beginners is to start with one small dataset and learn to inspect and visualize it before training a model. That pairs well with a tool like [Rerun](/library/references/robotics/2026/10/22/rerun-data-layer-for-physical-ai/).

---

*Source: [Akshet Patel on LinkedIn](https://www.linkedin.com/posts/akshetpatel_robotics-datasets-robotlearning-share-7517155491584720897-6y57/)*
