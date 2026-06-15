---
layout: post
title: "Setting Up rmw_zenoh for ROS 2"
date: 2025-06-07
categories: robotics ros
tags: [ros2, rmw_zenoh, middleware, networking, distributed-systems]
---

# Setting Up `rmw_zenoh` for ROS 2

## 1. What This Is and When to Use It

`rmw_zenoh_cpp` is a ROS 2 RMW (middleware) implementation built on
[Eclipse Zenoh](https://zenoh.io/) instead of DDS. It became a Tier-1
supported middleware with the Kilted Kaiju release (May 2025) and is
available as a backport for Humble and Jazzy as well.

It's particularly worth using when:

- You're running ROS 2 inside **Docker containers** and hitting multicast
  discovery problems between containers/hosts.
- Nodes need to communicate over **WiFi, 5G, or other links where multicast
  is unreliable or blocked**.
- You're building a **multi-robot or edge fleet** where DDS discovery traffic
  scales badly.

Unlike DDS-based RMWs, `rmw_zenoh` does **not** rely on multicast for
discovery at all — peers discover each other via a central **Zenoh router**,
which also relays "gossip" about who else is on the network.

## 2. Prerequisites

- A working ROS 2 installation (Humble, Jazzy, Kilted, or Rolling).
- `rosdep` configured if building from source.

## 3. Installation

### Option A — Binary install (recommended for stable use)

```bash
sudo apt update
sudo apt install ros-<DISTRO>-rmw-zenoh-cpp
# e.g. for Humble:
sudo apt install ros-humble-rmw-zenoh-cpp
```

### Option B — Build from source (if you need the latest features/fixes)

```bash
mkdir -p ~/ws_rmw_zenoh/src && cd ~/ws_rmw_zenoh/src
git clone https://github.com/ros2/rmw_zenoh.git -b humble   # or jazzy/rolling
cd ~/ws_rmw_zenoh
rosdep install --from-paths src --ignore-src -r -y
colcon build
source install/setup.bash
```

## 4. Switching to `rmw_zenoh`

Set the environment variable before launching any ROS 2 process:

```bash
export RMW_IMPLEMENTATION=rmw_zenoh_cpp
```

All nodes that need to talk to each other must use the same RMW
implementation — you can't mix `rmw_zenoh_cpp` and a DDS-based RMW on the
same topic graph.

## 5. Running the Zenoh Router

This is the step people most often miss. **By default, multicast discovery
is disabled in the node session config**, so without a router, nodes will
not discover each other at all.

In a separate terminal/process, start the router:

```bash
source /opt/ros/<DISTRO>/setup.bash
ros2 run rmw_zenoh_cpp rmw_zenohd
```

Nodes connect to this router and receive discovery info about other peers via
its gossip functionality.

### Controlling router-check behavior

The `ZENOH_ROUTER_CHECK_ATTEMPTS` environment variable controls whether/how a
node session waits for a router:

| Value | Behavior |
|---|---|
| (unset / default) | Indefinitely waits for a connection to a Zenoh router |
| `0` | Skips the router check entirely |
| `1` | Checks once, no retry |
| `N > 1` | Attempts `N` times, 1 second apart |

This is useful in containerized setups where the router and the node
containers might start in a slightly different order.

## 6. Testing the Setup

```bash
# Terminal 1 — router
source /opt/ros/humble/setup.bash
ros2 run rmw_zenoh_cpp rmw_zenohd

# Terminal 2 — talker
export RMW_IMPLEMENTATION=rmw_zenoh_cpp
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp talker

# Terminal 3 — listener
export RMW_IMPLEMENTATION=rmw_zenoh_cpp
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp listener
```

If everything is wired correctly, the listener should start printing received
messages on `/chatter`.

## 7. Containerized Deployments

A few things to watch for when running across Docker containers (relevant for
a setup like a containerized Humble stack on an embedded SoC):

- **No multicast required** — this is the main win over DDS here. As long as
  containers can reach the router's TCP endpoint, discovery works, even on
  Docker's default bridge network.
- **IPv6-only router listener** — the default shipped router config attempts
  to listen on IPv6 `ANY` only. On systems/containers without working IPv6,
  the router can fail to start. If you hit this, supply a custom router
  config (via `ZENOH_ROUTER_CONFIG_URI`, pointing at a JSON5 config) that
  adds an explicit IPv4 listen endpoint, e.g. `tcp/0.0.0.0:7447`. Check the
  `rmw_zenoh` repo's config examples for the current JSON5 schema, as this is
  an actively developed area.
- **Shared memory across containers** — if you want to use Zenoh's
  shared-memory transport between containers on the same host (for large
  messages), the containers need to share an IPC namespace. The simplest
  approach is running each container with `--ipc=host`. Note that Zenoh's SHM
  size configuration may need increasing if any single message exceeds ~24
  MiB.

## 8. Multi-Host Setups

For nodes on different hosts to talk to each other, point them at a shared
router (or routers configured to connect to each other). If your router is at
`192.168.1.1:7447`, sessions on other hosts can connect to it either via an
environment variable or a session config file specifying the connect
endpoint, e.g.:

```bash
export ZENOH_SESSION_CONFIG_URI=/path/to/session_config.json5
```

with the config specifying `connect.endpoints: ["tcp/192.168.1.1:7447"]`.

## 9. Known Compatibility Gotchas

- **Humble ↔ Jazzy/Kilted+ message type hashes** — Since the Iron release,
  ROS 2 includes type hashes for messages, and `rmw_zenoh` encodes these into
  Zenoh key expressions. This means **Humble nodes and Jazzy/Kilted+ nodes
  using `rmw_zenoh` will silently fail to communicate** — messages are
  dropped with no obvious error. If you have a mixed-distro setup, keep all
  `rmw_zenoh` nodes on the same ROS distro, or use a different RMW as a
  bridge.
- **Cannot interoperate with `zenoh-plugin-ros2dds`** — that plugin bridges
  DDS-based ROS 2 (mainly Cyclone DDS) to Zenoh using a different key
  expression scheme. It is a separate tool from `rmw_zenoh` and the two are
  not interchangeable.

## 10. Security (SROS2)

`rmw_zenoh` supports the full SROS2 security suite (access control,
authentication, encryption). The `zenoh_security_tools` package (shipped with
`rmw_zenoh`) can generate router/session configs with security enabled from
an SROS2 keystore and access control policy file. This is worth setting up
before any deployment that leaves a trusted local network.

## 11. Logging / Debugging

Zenoh's core is implemented in Rust; its logging is controlled via the
standard `RUST_LOG` environment variable, e.g.:

```bash
export RUST_LOG=debug
```

This is useful for diagnosing router connection issues, discovery timing, and
session negotiation problems.

## 12. Troubleshooting Checklist

- Is the Zenoh router actually running, and reachable from every
  container/host? (`rmw_zenohd` must be started before — or with retries
  configured for — the nodes.)
- Is `RMW_IMPLEMENTATION=rmw_zenoh_cpp` set in **every** terminal/container
  that needs to participate, including launch files' environments?
- Are all participants on the **same ROS 2 distro** (watch for the type-hash
  issue above)?
- If using shared memory between containers, are they sharing an IPC
  namespace (`--ipc=host` or equivalent)?
- If the router won't start, check for the IPv6-listener issue and supply an
  explicit IPv4 endpoint in the router config.
- Set `RUST_LOG=debug` to see what the router and sessions are actually doing
  during discovery.
