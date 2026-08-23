---
layout: single
title: "ROS 1 vs ROS 2 Middleware: Overview, Selection, and Optimization"
date: 2025-06-09
permalink: /tutorials/ros/2025/06/09/ros1-vs-ros2-middleware-overview/
categories:
  - tutorials
  - ros
tags: [ros, ros2, middleware, rmw, comparison, architecture]
thumbnail: /_images/tutorials/2025-06-09-ros1_vs_ros2_middleware_overview.png
thumbnail_source: ros2/rmw
---

# ROS 1 vs ROS 2 Middleware: Overview, Selection, and Optimization

## 1. Architectural Comparison: ROS 1 vs ROS 2

**ROS 1** has no real middleware abstraction layer. It is hardcoded to a
specific transport (TCPROS, with UDPROS rarely used in practice), and relies
on a centralized `roscore` master process for name resolution and discovery
via XMLRPC. This means:

- No Quality of Service (QoS) concepts — everything is effectively
  best-effort reliable TCP.
- A single point of failure: if the master dies, no new connections can be
  negotiated (existing TCP connections keep running, but nothing new can
  start).
- Poor behavior across multiple hosts/networks — `ROS_MASTER_URI` and
  `ROS_IP`/`ROS_HOSTNAME` juggling is a perennial source of pain.

**ROS 2** introduces the **RMW (ROS Middleware Interface)** — an abstraction
layer that lets different middleware implementations be plugged in without
changing application code. The default implementations are **DDS-based**
(Fast DDS, Cyclone DDS, RTI Connext), with a newer **non-DDS option based on
Eclipse Zenoh** (`rmw_zenoh`) now available and, as of the Kilted Kaiju
release (May 2025), promoted to Tier-1 support.

Key architectural differences this brings:

- **Decentralized discovery** — no master process; nodes find each other
  peer-to-peer (DDS) or via a lightweight router (Zenoh).
- **Real QoS policies** — reliability, durability, history depth, deadline,
  liveliness, etc., all negotiated per-topic.
- **Pluggable transport** — the same application code can run over DDS,
  Zenoh, or (in principle) other RMW implementations, selected at runtime via
  an environment variable.

## 2. What the ROS 2 Middleware Layer Actually Does

For **DDS-based RMWs** (Fast DDS, Cyclone DDS, Connext), three things happen
under the hood:

1. **Discovery** — participants find each other via SPDP (Simple Participant
   Discovery Protocol), typically over UDP multicast, then match up
   publishers/subscribers via SEDP (Simple Endpoint Discovery Protocol).
2. **Serialization** — messages are encoded using CDR (Common Data
   Representation).
3. **Transport** — data is sent as RTPS over UDP by default, with optional
   shared-memory (SHM) transport for same-host communication.

**QoS negotiation** sits alongside this: a publisher and subscriber will only
connect if their QoS policies are *compatible* (e.g. a reliable subscriber
won't connect to a best-effort publisher unless explicitly relaxed). A huge
fraction of "why won't my topic connect" issues trace back to a QoS mismatch
rather than a network problem.

`ROS_DOMAIN_ID` partitions the network into isolated "domains" — nodes in
different domains never discover each other, which is the primary mechanism
for avoiding cross-talk between robots/test rigs on the same network.

**`rmw_zenoh`** does the same conceptual job differently: instead of
multicast-based peer discovery, Zenoh sessions register "liveliness tokens"
and discover peers via a **Zenoh router**, which also relays data between
peers that can't reach each other directly (e.g. across NAT, or over
non-multicast links like WiFi/5G).

## 3. Choosing an RMW Implementation

| RMW | Best for | Notes |
|---|---|---|
| **Fast DDS** (`rmw_fastrtps_cpp`) | General purpose, default in most distros (incl. Humble) | Mature, widely tested. Has a Discovery Server mode for non-multicast/VPN/cloud setups. |
| **Cyclone DDS** (`rmw_cyclonedds_cpp`) | Embedded/constrained systems | Lighter footprint, often better behavior under packet loss, mature Iceoryx shared-memory integration. |
| **RTI Connext** (`rmw_connextdds`) | Safety-critical / automotive / certification contexts | Commercial, strong tooling (Admin Console), relevant if formal qualification (e.g. ISO 26262) becomes a concern. |
| **Zenoh** (`rmw_zenoh_cpp`) | Multi-robot fleets, containerized/edge deployments, WiFi/5G links | Tier-1 since Kilted, backported to Humble/Jazzy. Avoids multicast entirely — solves discovery issues in Docker, on WiFi, and across NAT. |

**Practical guidance for containerized/embedded deployments (e.g. a robot
running ROS 2 Humble in Docker on an embedded SoC):**

Multicast-based DDS discovery is a classic pain point inside Docker's default
bridge networking — multicast packets often don't traverse the bridge
correctly, leading to nodes that simply can't see each other across
containers or hosts. The usual fixes are either `--network=host`, configuring
a DDS Discovery Server / static peer list, or switching to `rmw_zenoh`, which
doesn't depend on multicast at all and is generally easier to get working
cleanly across container boundaries.

## 4. Optimization Strategies

**QoS tuning** — Be deliberate rather than relying on defaults. For
high-rate sensor topics (point clouds, camera frames, IMU), use best-effort
reliability with a shallow history depth and volatile durability so a slow
subscriber doesn't create backpressure on the publisher.

**Domain ID isolation** — Give each robot or test rig its own
`ROS_DOMAIN_ID`. This reduces discovery traffic and prevents accidental
cross-talk between systems sharing a network.

**Discovery scaling** — Multicast-based discovery traffic scales roughly
O(n²) with the number of participants. For systems with many nodes, use a
Fast DDS Discovery Server, a Cyclone DDS static peer list, or Zenoh's router
(which avoids the scaling problem structurally).

**Shared-memory transport** — Enable SHM for same-host pub/sub (Cyclone DDS
via Iceoryx, or Fast DDS's SHM transport). For large messages (images, point
clouds), this skips serialization and the loopback network stack entirely and
makes a large difference to both latency and CPU load.

**Intra-process communication** — Compose nodes into a single process using
component containers. This lets rclcpp's `IntraProcessManager` bypass the RMW
entirely for same-process pub/sub, passing messages by `shared_ptr` with zero
copy. The trade-off is that callback group configuration becomes critical:
mutually-exclusive groups will serialize callbacks you may want running
concurrently (e.g. a VIO frontend vs. an EKF update), while reentrant groups
can introduce races if shared state isn't handled carefully.

**Executor tuning** — Use dedicated callback groups to separate
time-critical callbacks (IMU, VIO frontend) from heavier, less time-sensitive
ones. On Kilted/Lyrical, the new `EventsExecutor` is event-driven rather than
polling-based and benchmarks 10–15% lower CPU than `MultiThreadedExecutor` —
worth evaluating for compute-constrained embedded targets.

**Network/socket buffer tuning** — For large messages over UDP (LiDAR scans,
SWIR frames), increase `net.core.rmem_max` / `wmem_max` via `sysctl`. DDS
fragmentation/reassembly of oversized messages is a common source of dropped
frames that presents as an unrelated-looking bug downstream.

**Minimize DDS participants per process** — Where supported, configure a
single DDS participant shared across multiple nodes in a process rather than
one participant per node, reducing discovery overhead.
