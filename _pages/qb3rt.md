---
layout: single
title: "QB3rt: A High-Performance Open Robotics Platform for Teaching and Research"
permalink: /qb3rt/
author_profile: false
toc: true
toc_label: "Contents"
---

**Dr. Brian Deegan, University of Galway**

---

![A fleet of QB3rt robots built on the Qualcomm RB3 Gen 2 platform]({{ site.baseurl }}/_images/QB3rt.jpeg){: .align-center style="max-width: 800px;"}

## Introduction

The name is deliberate. QB3rt — pronounced *Q-Bert*, after the classic 1982 isometric arcade game — is a wheeled mobile robotics platform built around the Qualcomm RB3 Gen 2 compute board, and the playfulness of the name belies the seriousness of what it can do. Where the original Q\*bert navigated a pyramid of cubes, QB3rt navigates the real world: mapping unknown environments in 3D, localising itself with centimetre-level precision, fusing visual and inertial data into a coherent motion estimate, and reasoning about the scene in front of it with neural inference running entirely on-device. It does this on a platform that costs a fraction of comparable research systems, and it does it within a fully open, reproducible ROS 2 software stack that students can understand, modify, and extend from day one.

QB3rt is built around four principal hardware components: a WaveRover 4WD chassis, a Qualcomm RB3 Gen 2 single-board computer, an SLAMTEC RPLidar C1 rotating 2D LiDAR, and a Luxonis OAK-D Lite stereo depth camera. On top of this hardware, a carefully integrated software stack provides visual-inertial odometry (VIO), 3D RTAB-Map-based mapping, 2D SLAM via SLAM Toolbox, full autonomous navigation through Nav2, dense stereo point cloud generation, and general-purpose computer vision through the OAK-D's on-device inference engine. The result is a platform capable of supporting research contributions in autonomous navigation, perception, sensor fusion, and human-robot interaction — all on a chassis that can be carried in a backpack and assembled by a second-year undergraduate.

---

## The Hardware Stack

### WaveRover 4WD Chassis

The WaveRover provides a robust, differential-steerable four-wheel-drive base with metal gear motors, a low centre of gravity, and an aluminium alloy frame that absorbs the punishment of corridors, carpet edges, and ramp transitions alike. Unlike many plastic-framed hobby platforms, the WaveRover tolerates payload without flexing and can be driven at speeds appropriate for dynamic navigation testing indoors. Its ESP32-based motor controller communicates over a serial or WebSocket interface, which maps cleanly onto a ROS 2 hardware abstraction layer, and its geometry is well-suited to the kinematic assumptions of Nav2's differential drive model. The chassis is not trying to be a consumer toy; it is a credible mechanical foundation on which to build a research system.

### Qualcomm RB3 Gen 2

This is where QB3rt departs most sharply from the field. Almost every comparable open robotics teaching platform — TurtleBot 3, TurtleBot 4, Yahboom ROSMASTER, and their derivatives — relies on a Raspberry Pi 4 or 5 as the primary compute node. The Raspberry Pi is a fine general-purpose computer, but it was not designed for the workloads of autonomous robotics: simultaneous SLAM, dense stereo reconstruction, and neural inference running concurrently will saturate a Pi to the point where either latency climbs unacceptably or components must be dropped.

The Qualcomm RB3 Gen 2 is a fundamentally different class of hardware. Built on the QCS6490 SoC, it integrates a Kryo CPU cluster, an Adreno 643L GPU, a Hexagon DSP with dedicated tensor accelerator, and a hardware video encode/decode engine — all in a compact embedded form factor. The practical consequence is that neural network inference tasks that would saturate a Pi 4 can run on the Hexagon at a fraction of the power budget, leaving CPU and memory headroom for the rest of the autonomy stack. RTAB-Map's graph optimisation, OpenVINS propagation, and a YOLO-family detection model can coexist as concurrent ROS 2 nodes without fighting for the same compute resource. For teaching, this means students are not forced to choose between features due to hardware constraints; for research, it means the platform can serve as a genuine edge inference target rather than offloading to a workstation.

### RPLidar C1

The SLAMTEC RPLidar C1 is a compact, cost-effective 2D rotating LiDAR with a 360-degree field of view, a maximum range of around 12 metres, and a measurement frequency suitable for real-time SLAM at typical indoor navigation speeds. It publishes standard `sensor_msgs/LaserScan` data to the ROS 2 graph and is directly consumed by both SLAM Toolbox (for 2D occupancy grid mapping) and RTAB-Map (as a supplementary constraint for loop closure). Its value is not that it replaces 3D LiDAR — it does not — but that it provides reliable, low-latency planar geometry data that anchors the navigation stack in environments where visual texture is sparse or lighting conditions are challenging. Having both 2D laser scan data and stereo depth available simultaneously gives the platform a redundancy and complementarity in perception that neither sensor alone provides.

### OAK-D Lite

The Luxonis OAK-D Lite is a stereo depth camera with a built-in Intel Myriad X VPU. It provides synchronised left and right greyscale images for stereo depth computation and VIO, an RGB camera for colour scene understanding, and a hardware IMU (BNO085) for inertial measurement. Critically, the Myriad X handles stereo depth computation on-device, offloading what would otherwise be a significant CPU burden, and also supports on-device neural inference through Luxonis's DepthAI pipeline — enabling object detection, semantic segmentation, and spatial AI tasks to run without sending data off the robot.

The OAK-D Lite connects to the RB3 Gen 2 over USB 3.0 and integrates into the ROS 2 graph through the `depthai-ros` driver. With a source build of the driver (rather than the apt binary), the BNO085 IMU stream is exposed as a ROS 2 topic and can be fed directly into the VIO pipeline alongside the stereo image pair.

---

## The Software Stack

QB3rt runs ROS 2 Humble on Ubuntu 22.04 (ARM64), giving it access to the full ROS 2 ecosystem of tools, drivers, and libraries. The autonomy stack is layered from the ground up as follows.

**Visual-Inertial Odometry.** VIO fuses the stereo image stream from the OAK-D Lite with the BNO085 IMU to produce a continuous, metric 6-DoF pose estimate at high frequency. This estimate runs even in environments where wheel odometry degrades — carpet, slippery surfaces, or wheel slip under acceleration — making it a significantly more robust odometry source than encoder-based dead-reckoning alone. The VIO output feeds the RTAB-Map odometry input and the Nav2 localisation stack.

**RTAB-Map (3D Mapping and Loop Closure).** Real-Time Appearance-Based Mapping builds a 3D point cloud map of the environment from stereo data, maintaining a memory-managed graph of keyframes with appearance-based loop closure detection. When the robot revisits a previously mapped area, RTAB-Map recognises it and corrects accumulated drift, producing globally consistent maps suitable for long-duration autonomous operation. The map can be saved and reloaded, enabling multi-session operation across separate deployments.

**SLAM Toolbox (2D SLAM and Localisation).** Running in parallel with RTAB-Map, SLAM Toolbox consumes the RPLidar C1 scan data to maintain a 2D occupancy grid. This grid is the primary map representation consumed by Nav2 for path planning and obstacle avoidance. SLAM Toolbox can operate in mapping mode (building a new map), localisation mode (localising against a saved map), or lifelong mapping mode (updating an existing map while navigating). The interplay between 2D LiDAR-based SLAM and 3D visual SLAM gives QB3rt a belt-and-suspenders approach to spatial awareness.

**Nav2 (Autonomous Navigation).** Nav2 is the de facto standard autonomous navigation framework for ROS 2, providing global path planning (via NavFn or Smac planners), local obstacle avoidance (DWB or MPPI controller), behaviour trees for mission management, and a recovery action library. QB3rt's Nav2 configuration accounts for the WaveRover's differential drive kinematics and sensor footprint, and students interact with it through RViz2, setting navigation goals and observing the planner and controller in real time.

![QB3rt running Nav2 in RViz2, showing the occupancy grid map, laser scan, and an active navigation goal]({{ site.baseurl }}/_images/QB3rt_map.png){: .align-center style="max-width: 800px;"}

**Stereo Point Cloud.** Beyond RTAB-Map's internal representation, the OAK-D Lite's depth output is published as a `sensor_msgs/PointCloud2` stream, available to any node subscribing to it. This enables downstream processing: object detection with spatial coordinates, voxel-grid filtering for traversability analysis, and surface normal estimation for terrain characterisation. The point cloud is visualised directly in RViz2 and Foxglove Studio, giving students an immediate and intuitive sense of what the robot perceives.

**Computer Vision.** The OAK-D Lite's DepthAI pipeline supports arbitrary neural models in the OpenVINO intermediate representation. Object detection, person tracking, and custom-trained classification models can be deployed to the Myriad X and the results published as ROS 2 topics, complete with 3D spatial positions derived from the stereo depth. This creates a direct pipeline from model training on a workstation (or through edge AI tooling) to deployment on the robot with no code changes beyond the model file.

---

## Advantages for Teaching

### A Realistic Autonomy Stack at Undergraduate Level

The most important thing a mobile robotics course can teach is not how to write a PID controller in isolation — it is how a complete autonomy system is architected and how its components interact. QB3rt runs the same SLAM, localisation, and navigation stack that professional roboticists use on research and commercial platforms. Students who work with QB3rt are not learning a simplified simulation of autonomous robotics; they are learning the real thing. The transition from classroom to industry or research PhD is correspondingly shorter.

### Layered Complexity

A WaveRover with a serial motor driver is simple enough to be a first-year programming exercise. Add the RPLidar and SLAM Toolbox, and it becomes a second-year SLAM project. Add the OAK-D and VIO, and it is a third-year sensor fusion assignment. Add RTAB-Map, Nav2, and computer vision, and it is a final-year or master's-level research platform. The same physical robot supports a progression across all undergraduate and postgraduate years, and students develop a longitudinal familiarity with a system they have actually built rather than encountering a new black-box platform each year.

### Hardware-Software Codesign Literacy

Working with the RB3 Gen 2 exposes students to concepts that Raspberry Pi-based platforms obscure: CPU-GPU-DSP heterogeneous compute, cross-compilation workflows, power-aware scheduling, and hardware-accelerated inference. These are precisely the skills that the embedded AI and autonomous systems industry is hiring for. Students who have deployed a neural model to a Hexagon DSP, debugged a ROS 2 node on ARM64, and profiled the system under concurrent SLAM and inference load are genuinely ahead of those who have only used cloud APIs.

### Transparency and Reproducibility

The entire QB3rt software stack is open source and containerisable. Students can reproduce the full software environment on a laptop using Docker or a WSL2 instance, develop and test their code in Gazebo or Webots simulation, and then deploy it to the physical robot without modification. This reproducibility is not merely pedagogically convenient — it teaches a development practice (containerised, simulation-first, hardware-in-the-loop validation) that is the professional standard in serious robotics development.

### Cost at Scale

A laboratory of ten TurtleBot 4 Lite units represents a significant capital expenditure. QB3rt achieves comparable or superior capability at a meaningfully lower per-unit cost, and because no single component is proprietary, parts can be replaced individually rather than requiring whole-system servicing. For university programmes building or expanding a robotics laboratory, this matters.

---

## Advantages for Research

### A Genuine Edge Compute Research Target

The Qualcomm RB3 Gen 2 with its Hexagon DSP is a representative member of a class of edge AI SoCs that are increasingly deployed in autonomous vehicles, drones, and industrial robots. Research contributions on model compression, quantisation-aware training, attention mechanism efficiency, and real-time inference optimisation are far more publishable — and practically relevant — when validated on this class of hardware rather than on a laptop GPU or a cloud instance.

### Multi-Modal Sensor Fusion

Having 2D LiDAR, stereo vision, and a hardware IMU on a single affordable platform enables research into sensor fusion architectures that would otherwise require either bespoke integration work or expensive commercial platforms. Questions such as how best to fuse VIO with LiDAR SLAM for robust localisation in dynamic environments, or how to arbitrate between visual and geometric loop closure detections, are open research problems that QB3rt can directly investigate.

### V2X and Cooperative Perception Testbed

The RB3 Gen 2's connectivity capabilities, combined with its AI compute, make QB3rt a natural fit as an agent in cooperative perception research. Multiple QB3rt units sharing perception data over a local network constitute a small-scale V2X cooperative sensing system — directly relevant to research threads in connected and autonomous vehicle (CAV) perception, distributed SLAM, and multi-agent coverage tasks. This connects naturally to the kind of cooperative infrastructure sensing research emerging in the autonomous vehicle community.

### SWIR and Non-Visible Imaging Integration

The ROS 2 architecture is camera-agnostic at the pipeline level. Researchers working with shortwave infrared (SWIR), thermal, or event cameras can integrate these alongside the standard OAK-D stack, treating them as additional `sensor_msgs/Image` topics consumed by custom perception nodes. QB3rt's architecture does not assume visible-spectrum imaging; it accommodates any calibrated camera that can publish to the ROS 2 graph.

### Long-Duration Autonomous Operation

RTAB-Map's lifelong mapping mode, combined with SLAM Toolbox's localisation, supports multi-session map maintenance and re-localisation across robot restarts. This makes QB3rt suitable for research into persistent autonomy: how robots maintain useful, up-to-date world models over hours, days, and across human interventions. This is a relatively underexplored area in affordable robot research platforms.

---

## Comparison with Alternative Platforms

### TurtleBot 3 / TurtleBot 4

The TurtleBot series is the most widely adopted open ROS 2 teaching platform, and for good reason: it is well-documented, community-supported, and produced by a reputable manufacturer (ROBOTIS / iRobot respectively). However, both variants are built around Raspberry Pi compute, which caps the concurrent workload the platform can sustain. The TurtleBot 4 adds an iRobot Create 3 as its base, which abstracts the drive hardware behind a higher-level API — convenient, but less illuminating for students who benefit from understanding the motor driver layer. Neither platform offers the level of on-device AI acceleration available on the RB3 Gen 2, and the TurtleBot 4 in particular is significantly more expensive than a comparable QB3rt build. QB3rt gives students greater hardware transparency, substantially more AI compute, and a richer sensor suite for a lower or comparable total cost.

### Limo (AgileX Robotics)

The AgileX Limo is a genuinely impressive multi-modal platform supporting differential, Ackermann, and tracked configurations. It runs Ubuntu on a Jetson Nano and provides a good ROS 2 experience. Its primary advantages over QB3rt are its multi-modal kinematics and its polished industrial build quality; its disadvantages are cost, the limited lifespan of the Jetson Nano ecosystem (no longer in active production), and the relative difficulty of hardware modification. QB3rt's Snapdragon-class SoC surpasses the Jetson Nano significantly in AI compute per watt, and its modular open chassis is more amenable to student-led modification and expansion.

### Clearpath Jackal / Husky

Clearpath platforms are the de facto standard in outdoor mobile robotics research and are robustly built for demanding environments. They are also expensive — by an order of magnitude compared to QB3rt — and are not teaching platforms in any practical sense; they are research infrastructure. QB3rt does not compete with Jackal in terrain capability or payload, but for the indoor research and teaching use cases that comprise the majority of academic robotics laboratory work, it provides a credible capability at a fraction of the cost. For programmes that cannot justify Clearpath hardware for every student group, QB3rt represents a path to hands-on research-grade robotics at scale.

### DonkeyCar / JetBot

These platforms target a narrower set of tasks — lane following, behavioural cloning, simple vision-based control — and are primarily inference testbeds rather than full autonomy systems. They do not run full SLAM or navigation stacks and are not designed for the kind of multi-modal sensor fusion that QB3rt supports. They are excellent entry points into reinforcement learning and imitation learning on physical hardware, but they do not scale to the breadth of research QB3rt enables.

### Unitree Go2 / Spot (Boston Dynamics)

Legged platforms are a different category entirely, but they are worth naming because they attract significant student interest and institutional aspiration. Both are orders of magnitude more expensive than QB3rt, significantly harder to repair, and their software stacks are substantially less open. For programmes that cannot justify the budget or the maintenance overhead of a legged platform, QB3rt offers a path to serious research in autonomous navigation, 3D mapping, and AI perception with accessible hardware and a fully open stack.

---

## Limitations and Honest Caveats

No platform is without compromise, and intellectual honesty demands that QB3rt's limitations be named alongside its strengths.

The WaveRover is an indoor platform. Its small wheel diameter and ground clearance limit it to reasonably flat surfaces; it is not designed for outdoor terrain, significant ramps, or dynamic outdoor environments. For outdoor autonomy research, a more capable chassis — larger wheels, higher ground clearance, weatherproofing — would be needed with the same compute and sensor stack.

The RB3 Gen 2 is a more complex development target than a Raspberry Pi. Cross-compilation workflows, Qualcomm's SDK tooling, and the Hexagon DSP programming model have steeper learning curves. For introductory courses where the goal is ROS 2 familiarity rather than embedded AI development, this complexity may need to be abstracted. In practice, this is managed by providing pre-configured disk images for routine use and reserving the lower-level Qualcomm toolchain for advanced electives or research projects.

The OAK-D Lite's BNO085 IMU, while capable, is mounted inside the camera enclosure and may accumulate accelerometer bias over extended sessions. For research applications requiring the highest-fidelity inertial data, a dedicated tactical-grade IMU mounted rigidly to the chassis frame would improve VIO performance. This is a known limitation of the platform's design rather than a fundamental barrier, and it is addressable through hardware extension.

---

## Conclusion

QB3rt is not the cheapest wheeled robot you can build, nor the most capable. It is something more useful than either: it is the right robot for the work. It sits at a deliberate intersection of affordability, compute capability, sensor richness, and software openness that makes it genuinely suitable for both undergraduate teaching and publishable research — on the same hardware, in the same laboratory, with the same students. 

The autonomy stack it runs — VIO, RTAB-Map, SLAM Toolbox, Nav2, dense point cloud, computer vision — is not a toy version of autonomous robotics. It is autonomous robotics, running at the edge, on hardware representative of the systems the industry is building now. Students who graduate from a programme that uses QB3rt will have configured a ROS 2 navigation stack, debugged a sensor fusion pipeline on ARM64, deployed a neural model to an on-device AI accelerator, and understood why all of these things matter. That is the education the field needs.

The name is a joke, but the robot is serious.

---

*QB3rt is developed at the University of Galway within the Connacht Automotive Research (CAR) Group and the MSc in Intelligent Robotics programme. Hardware and software contributions, collaboration enquiries, and replication reports are welcome.*