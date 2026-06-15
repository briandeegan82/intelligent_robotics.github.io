---
layout: post
title: "Nix Flakes for Robotics and Embedded Development: A Practical Guide"
date: 2025-06-05
categories: embedded development
tags: [nix, flakes, reproducible-builds, environment-management, rb3]
---

# Nix Flakes for Robotics and Embedded Development: A Practical Guide

*A survey of reproducible environment management for teams working on autonomous systems, edge AI, and embedded Linux targets like the Qualcomm RB3 Gen 2.*

---

## Introduction

Environment management is one of those problems that seems trivial until it isn't. A perception pipeline that works perfectly on your dev machine silently breaks on a colleague's laptop. A ROS2 node runs fine in simulation but fails on the embedded board because the OpenCV version is subtly different. A paper's results can't be reproduced six months later because the conda environment drifted.

These are not exotic failure modes. They are the everyday friction of robotics and autonomous systems research, where software stacks are deep, hardware dependencies are tight, and the gap between development and deployment is wide.

This article surveys the modern landscape of environment management tools — with a focus on **Nix flakes** — from the perspective of a research group working on autonomous driving, computer vision, and embedded perception. Along the way we look concretely at the **Qualcomm RB3 Gen 2** as a representative embedded target, and discuss what each tool can and cannot offer for that kind of deployment.

---

## What Are Nix Flakes?

Nix is a purely functional package manager that has existed since 2003, but for most of its life it was powerful and unwieldy in equal measure. **Flakes**, introduced in 2021, are the modern interface to Nix that address its main practical shortcomings: unpinned dependencies, inconsistent conventions, and builds that weren't truly reproducible.

At its core, a flake is a directory containing two files:

- `flake.nix` — declares what the flake depends on (inputs) and what it produces (outputs)
- `flake.lock` — a generated lock file that pins every input to an exact content hash

The `flake.nix` structure looks like this:

```nix
{
  description = "My robotics project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [ pkgs.python3 pkgs.opencv pkgs.cmake ];
        };
      });
}
```

Running `nix develop` in this directory drops you into a shell with exactly those packages — same versions, same hashes, on any machine running Nix. The lock file ensures the inputs don't drift between runs or between teammates.

### The reproducibility guarantee

What makes Nix different from other tools is that reproducibility is enforced at the build level, not just at the version-declaration level. Every package in the Nix store is identified by a hash of its entire build graph — inputs, build script, compiler flags, environment variables. If two builds produce the same hash, they are guaranteed to be identical. This is what the Nix community calls a *hermetic* build.

This is a stronger guarantee than Docker (where layer caches can diverge from mutable sources) and much stronger than conda (where the solver can produce different results on different days).

---

## Comparison with Docker and Conda

Understanding where Nix sits in the landscape requires being clear about what each tool is actually solving.

**Docker** isolates at the OS process level. You ship a full Linux userspace image, with strong runtime isolation via Linux namespaces and cgroups. This is powerful for deployment and for multi-tenant services, but it comes with overhead: a daemon, full image layers, and the complexity of passing hardware through container boundaries.

**Conda** manages language-level packages, primarily for Python and R. It is the lowest-friction entry point for scientific computing, but its reproducibility story is weak — `environment.yml` files pin versions loosely, the solver can produce different results over time, and environments routinely drift.

**Nix flakes** operate at the build level, with no runtime isolation but with the strongest reproducibility guarantees of the three. There is no daemon, no container overhead, and the entire dependency graph is content-addressed.

| | Nix Flakes | Docker | Conda |
|---|---|---|---|
| Isolation mechanism | Nix store paths | Linux namespaces + cgroups | PATH manipulation |
| Reproducibility | Bit-for-bit (content-addressed) | Best-effort (layer cache) | Solver-dependent, drifts |
| Overhead | Negligible | Daemon + full OS image | Lightweight |
| Scope | Any language, full system | Anything | Primarily Python/R |
| Cross-compilation | First-class | Possible but slow | No |
| Learning curve | Steep | Moderate | Low |

These tools are not mutually exclusive. A common and effective pattern is to use Nix to build software reproducibly and then package the result into a minimal Docker image for deployment — without writing a Dockerfile at all:

```nix
packages.x86_64-linux.dockerImage = pkgs.dockerTools.buildImage {
  name = "my-perception-node";
  contents = [ self.packages.x86_64-linux.default ];
};
```

This produces a Docker image whose contents are entirely determined by the Nix build graph — reproducible, minimal, and auditable.

---

## The Qualcomm RB3 Gen 2 as a Target

The Qualcomm RB3 Gen 2 (QCS6490) is an interesting embedded target for robotics and edge AI work. It features an octa-core Cortex-A78/A55 CPU, an Adreno 643L GPU, and a Hexagon 770 NPU delivering 12 TOPS of AI inference performance. It runs Qualcomm Linux (a Yocto-based BSP) and supports standard aarch64 Linux userspace.

This last point is key: `aarch64-linux` is one of Nix's two fully supported platforms, with prebuilt binaries available from the official cache at `cache.nixos.org`. Nix runs on the RB3 without any special configuration.

### Running Nix directly on the board

Install Nix on the RB3's Qualcomm Linux as you would on any ARM64 machine:

```bash
sh <(curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install) --daemon
```

From there, `nix develop` and `nix build` work natively, pulling aarch64 binaries from the cache where available. For common packages (Python, NumPy, OpenCV on CPU) this works well. For anything that needs to be built from source, on-board compilation is feasible but slow.

### Cross-compiling from a development machine

The more practical workflow for iterative development is to cross-compile on a faster x86_64 machine and deploy the result. Nixpkgs has first-class support for this via `pkgsCross`:

```nix
outputs = { self, nixpkgs, flake-utils }:
  let
    pkgsCross = nixpkgs.legacyPackages.x86_64-linux.pkgsCross.aarch64-multiplatform;
  in {
    packages.x86_64-linux.rb3-node = pkgsCross.stdenv.mkDerivation {
      name = "perception-node";
      src = ./.;
      buildInputs = [ pkgsCross.opencv pkgsCross.eigen ];
    };
  };
```

Running `nix build .#rb3-node` on an x86_64 laptop produces a native aarch64-linux binary, ready to copy to the board. The entire build is reproducible and pinned — if it works today, it works next year.

### Docker on the RB3: where it struggles

Docker is a less natural fit for the RB3, and the reason is the proprietary hardware stack. The Hexagon NPU, Adreno GPU, and Spectra ISP are exposed via closed-source kernel drivers and userspace blobs that are tightly coupled to the Qualcomm Linux BSP kernel. To access the NPU from inside a Docker container requires passing through device nodes and mounting host libraries:

```bash
docker run \
  --device /dev/fastrpc-sdsp \
  -v /usr/lib/rfsa:/usr/lib/rfsa \
  -v /usr/lib/libcdsprpc.so:/usr/lib/libcdsprpc.so \
  my-inference-image
```

This is fragile: it re-couples the container to the host BSP, requires ABI compatibility between the container's glibc and the host blobs, and partially defeats the point of containerisation. There is also a practical concern: the Qualcomm Linux BSP kernel may not fully support the cgroup and namespace features that Docker requires.

Nix sidesteps all of this. Because it never pretended to isolate from the host kernel, it runs naturally alongside the BSP and inherits access to all hardware through the normal host userspace path.

The appropriate architecture for Nix on the RB3 is therefore layered:

```
┌─────────────────────────────────────────┐
│         Application layer               │  ← Managed by Nix
│  ROS2 nodes, OpenCV, Python, MPC, etc.  │
├─────────────────────────────────────────┤
│         Qualcomm middleware             │  ← Left to Qualcomm Linux BSP
│  QNN runtime, camera HAL, FastRPC       │
├─────────────────────────────────────────┤
│         Qualcomm Linux (Yocto)          │  ← BSP kernel + drivers
│  Hexagon driver, Adreno, Spectra ISP    │
└─────────────────────────────────────────┘
```

Nix manages everything above the BSP boundary reproducibly; the proprietary middleware and kernel stay under Qualcomm's control.

---

## macOS Compatibility

macOS is a common development platform and it deserves honest treatment. Nix runs well on macOS (both Intel and Apple Silicon), and the Determinate Systems installer handles the macOS-specific quirks cleanly. The basic workflow — `nix develop`, `nix build`, `nix run` — works fine.

The limitation is that `nixpkgs` is Linux-first. Not every package builds on Darwin, and ROS2 in particular does not build natively on macOS through Nix. For a team with Mac users, the standard pattern is to use `lib.optionals` to conditionally include platform-specific dependencies:

```nix
devShells.default = pkgs.mkShell {
  buildInputs = [
    pkgs.python3
    pkgs.cmake
  ] ++ pkgs.lib.optionals pkgs.stdenv.isLinux [
    pkgs.linuxHeaders
    # ROS2 packages, etc.
  ] ++ pkgs.lib.optionals pkgs.stdenv.isDarwin [
    pkgs.darwin.apple_sdk.frameworks.CoreFoundation
  ];
};
```

This gives Mac developers a useful shell for Python, notebooks, formatters, and editors, while Linux users get the full embedded stack.

For cross-compiling to the RB3 from macOS, a Linux remote builder is the standard solution. Register a Linux machine (or the RB3 itself) as a Nix build host:

```
# /etc/nix/nix.conf on macOS
builders = ssh://user@linux-box x86_64-linux,aarch64-linux /path/to/key 8 1
```

Then `nix build .#packages.aarch64-linux.my-node` on the Mac transparently delegates the build to the Linux machine.

---

## Alternatives Worth Knowing

### Pixi

Pixi is the most interesting recent development for scientific Python work. Built by the team behind `mamba`, it uses the conda-forge ecosystem but with a proper lock file and a fast solver. Crucially, it supports ROS2 via RoboStack — giving Mac and Windows users a working ROS2 environment through a single tool.

```toml
[dependencies]
python = "3.11.*"
ros-humble-ros-base = "*"   # via RoboStack channel
opencv = "*"
```

Pixi is not as reproducible as Nix (the solver can produce different results), but it is much more accessible for a mixed team and is a reasonable choice if the priority is low onboarding friction over strong reproducibility guarantees.

### Yocto / Buildroot

These operate at a completely different level: they build a full embedded Linux image from source, including the kernel. Qualcomm's RB3 BSP is itself a Yocto project. For research purposes, extending the BSP is usually overkill. For product development — where you need to own the full image, minimise footprint, and control the init system — Yocto becomes necessary.

### Apptainer (formerly Singularity)

The standard container format for HPC clusters. Unlike Docker, Apptainer runs containers as the invoking user with no daemon, making it suitable for shared compute environments where users don't have root. Relevant if your research group has cluster access for large-scale simulation or model training.

### uv

If your work includes a significant pure-Python component, `uv` (from Astral, the makers of Ruff) is now the fastest and most ergonomic Python project manager. It is not a general environment manager — no cross-compilation, no system packages, no ROS2 — but for Python-heavy components like MPC solvers, notebooks, and data pipelines, it is worth using alongside Nix.

---

## Practical Recommendations

There is no single right answer. The appropriate stack depends on whether you are optimising for team accessibility, deployment correctness, or long-term research reproducibility.

For a robotics research group working on autonomous systems with embedded targets:

**Use Nix flakes as the foundation** on Linux development machines and for deployment to embedded boards like the RB3. The cross-compilation story is excellent, the reproducibility guarantees are the strongest available, and the storage efficiency matters on constrained hardware.

**Use Pixi or devcontainers as an escape hatch** for Mac users or collaborators who will not invest time in learning Nix. A devcontainer with a ROS2 base image gets someone productive in minutes; it is not reproducible in the Nix sense, but it is good enough for algorithmic work.

**Use uv inside Nix shells** for fast Python iteration. The two compose well: Nix manages the system environment and pinned interpreter; uv manages the Python package graph within that environment.

**Use Yocto only when you own the product**. If the research eventually becomes a deployed system, the BSP layer will need to be owned and customised. That is a significant engineering investment and should not be taken on prematurely.

**Leave the proprietary hardware stack to the BSP**. For the RB3 and similar Qualcomm targets, the Hexagon NPU, camera HAL, and GPU compute stack are tightly coupled to the kernel. Do not attempt to containerise or abstract these. Nix manages everything above that line; the BSP manages everything below.

---

## Conclusion

Nix flakes represent a significant advance in environment management for systems software and robotics research. The combination of content-addressed builds, first-class cross-compilation, and a large package set (over 122,000 packages in nixpkgs) makes them the most capable tool in this space for teams working close to hardware.

The learning curve is real. The Nix language takes time to become comfortable with, and the mental model — hermetic builds, derivations, the store — is different from everything else in this space. But for research groups where reproducibility matters across machines, over time, and across the gap between a development laptop and an embedded board, that investment pays back quickly.

The best starting point is a simple `devShells.default` in a `flake.nix` — just enough to replace an `environment.yml` or a Dockerfile used only for development. From there, the cross-compilation and deployment features reveal themselves naturally as the need arises.

---

*This article is based on a technical discussion covering Nix flakes, Docker, conda, and alternative environment management tools in the context of robotics and embedded development for autonomous systems research.*
