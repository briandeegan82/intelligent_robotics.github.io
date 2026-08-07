---
layout: single
title: "ROCK 4C+ Setup Guide: Armbian vs. Radxa Debian (and Getting the CSI Camera Working)"
date: 2026-08-07
permalink: /tutorials/embedded/2026/08/07/rock-4c-plus-armbian-radxa-guide/
categories:
  - tutorials
  - embedded
tags: [rock-4c-plus, radxa, armbian, rockchip, rk3399, csi-camera, embedded-linux, sbc, debian, gstreamer]
---

![Radxa ROCK 4C+ single-board computer]({{ site.baseurl }}/_images/rock4c-plus-board.webp){: .align-center style="max-width: 700px;"}

The [Radxa ROCK 4C+](https://radxa.com/products/rock4/4cp/) (RK3399-T, the same SoC family as the ROCK Pi 4) is a solid, cheap SBC for robotics work — until you need its CSI camera port. The mainline kernel that Armbian's community builds run on doesn't include a driver for the Rockchip ISP, so the camera silently doesn't work no matter what you do. If you don't need the camera, Armbian is the better choice: it's actively maintained, minimal, and easy to keep updated. If you do need the camera, you have to switch to Radxa's own vendor-kernel Debian build instead.

This guide covers both paths.

| | Armbian Community | Radxa Debian build |
|---|---|---|
| Kernel | Mainline | Vendor (BSP) |
| CSI camera | ❌ Not supported | ✅ Supported |
| Maintenance | Actively updated, minimal images | Maintained by Radxa, heavier default image |
| Best for | Headless robots, compute nodes, anything without a camera | Vision projects that need the CSI port |

---

## Path A: Armbian Community (no CSI camera)

### 1. Flash the image

Go to the board's page on [armbian.com/boards/rockpi-4cplus](https://armbian.com/boards/rockpi-4cplus) and use **Armbian Imager** to write the image to an SD card or eMMC module. Don't use the direct link from an old release tag — Armbian's release tags churn constantly (new trunk builds ship every few days), so old release URLs 404 within months. The board page always points at whatever is current.

As of this writing the board offers a minimal **Debian 13 CLI** image and a ready-made **Ubuntu Xfce desktop** image. If you know you want a desktop environment, grabbing the Xfce variant directly saves you the manual DE install in Step 6 below.

### 2. First boot & command-line setup

Armbian's CLI image has no desktop environment by default. On first login it walks you through:
- Setting a root password
- Creating your default (non-root) user and password

### 3. Connect to Wi-Fi

```bash
sudo apt install network-manager
nmtui
```

Use `nmtui`'s menu to select a network and enter the password. A phone hotspot is the easiest way to get connectivity for this first boot — it avoids fighting with captive portals or enterprise Wi-Fi.

### 4. Set the date and time

Without a working NTP sync yet (or on a board with no RTC battery), the clock can be far enough off to break TLS/APT. Set it manually:

```bash
sudo timedatectl set-ntp false
sudo timedatectl set-time 2026-08-07
sudo timedatectl set-time 18:40
```

Once Wi-Fi and NTP are confirmed working, re-enable automatic sync with `sudo timedatectl set-ntp true`.

### 5. Update the system

```bash
sudo apt update
sudo apt upgrade
```

### 6. Add a desktop environment (optional)

Skip this if you downloaded the Xfce image directly in Step 1. If you're on the minimal CLI image and want a GUI afterwards:

```bash
sudo apt install lxdm
sudo apt remove nodm
sudo dpkg-reconfigure lxdm

sudo apt install xfce4 xorg

sudo reboot
```

After reboot, make Xfce the default session:

```bash
sudo update-alternatives --config x-session-manager
# choose xfce4-session from the list
```

To enable auto-login, edit LXDM's own config (not LightDM's — they're different display managers, and only one of them is actually running):

```bash
sudo nano /etc/lxdm/lxdm.conf
```

In the `[base]` section, uncomment and set:

```ini
autologin=your_username
```

### 7. Python virtual environments

```bash
sudo apt install python3-venv
```

Useful if you're running any robotics Python stack (ROS 2 nodes, model inference scripts, etc.) that shouldn't touch the system Python.

---

## Path B: Radxa Debian build (CSI camera support)

![Raspberry Pi Camera Module V2]({{ site.baseurl }}/_images/rpi-camera-v2.jpg){: .align-center style="max-width: 500px;"}

If you need the camera, use Radxa's own image from **[github.com/radxa-build/rock-4c-plus/releases](https://github.com/radxa-build/rock-4c-plus/releases)** instead of Armbian. This ships the Rockchip vendor kernel with the ISP and camera drivers Armbian's mainline kernel lacks.

One thing worth flagging: Radxa's current default build has moved on from Debian Bullseye + Xfce to **Debian Bookworm + KDE**, and Radxa now only actively supports that one desktop variant going forward. If you specifically want the lighter Bullseye/Xfce image, you'll need to dig into the release history for an older build — it still works, but it's no longer the maintained default.

### 1. Pre-boot configuration

Before you boot the card for the first time, the SD card's boot/config partition contains two files: `before.txt` and `config.txt`. Edit `before.txt`:
- Add your Wi-Fi SSID and password and uncomment the relevant lines
- Comment out the line that disables SSH (SSH is off by default on these images)

This lets the board come up on your network headless, without needing a monitor/keyboard for first boot.

### 2. Boot and log in

Boot the board and wait for it to come up (first boot takes longer than usual while it expands the filesystem). Default login is `radxa` / `radxa` unless you changed it in `before.txt`.

### 3. Set the date and time

Same as Path A — useful if the board doesn't have network time yet:

```bash
sudo timedatectl set-ntp false
sudo timedatectl set-time 2026-08-07
sudo timedatectl set-time 18:40
```

### 4. Enable the camera overlay

Radxa's images ship an interactive config tool, `rsetup`:

```bash
sudo rsetup
```

Navigate to **Overlays → Manage overlays**, enable the overlay matching your camera module (e.g. **Raspberry Pi Camera v2** for an IMX219-based module), save, and reboot.

> If your image doesn't have `rsetup`, or the camera overlay isn't listed, the older/manual equivalent is to edit `/boot/hw_intfc.conf` and uncomment the matching `intfc:dtoverlay=...` line (e.g. `imx219` for a Camera v2 module), then reboot.

### 5. Test the camera

First, confirm which video device node the camera actually landed on — it isn't always `/dev/video0` or `/dev/video1`, and varies by board and overlay:

```bash
v4l2-ctl --list-devices
```

Then, using the correct device path, preview, capture, and record with GStreamer:

**Preview:**
```bash
gst-launch-1.0 v4l2src device=/dev/video1 io-mode=4 ! videoconvert ! video/x-raw,format=NV12,width=1920,height=1080 ! xvimagesink
```

**Take a picture:**
```bash
gst-launch-1.0 v4l2src device=/dev/video1 io-mode=4 ! videoconvert ! video/x-raw,format=NV12,width=1920,height=1080 ! jpegenc ! multifilesink location=file.jpg
```

**Record video:**
```bash
gst-launch-1.0 v4l2src num-buffers=512 device=/dev/video1 io-mode=4 ! videoconvert ! video/x-raw,format=NV12,width=1920,height=1080,framerate=30/1 ! tee name=t ! queue ! mpph264enc ! queue ! h264parse ! mpegtsmux ! filesink location=file.mp4
```

`mpph264enc` uses Rockchip's hardware H.264 encoder — that's another thing that only works on the vendor kernel, not on mainline Armbian.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Camera not detected at all | You're on Armbian (mainline kernel) — switch to the Radxa build |
| `rsetup` has no camera overlay option | Older image — fall back to editing `/boot/hw_intfc.conf` directly |
| `xvimagesink` preview window doesn't appear | You need a desktop session / X11 running, or forward the display over SSH (`-X`) |
| APT/HTTPS failures right after first boot | Clock is wrong — set it manually (Step 4 / Step 3) before anything that touches TLS |
| `x-session-manager` still launches the wrong session | Re-run `update-alternatives --config x-session-manager` and confirm `xfce4-session` is selected |

---

## Summary

- **No camera needed:** Armbian Community, via [armbian.com/boards/rockpi-4cplus](https://armbian.com/boards/rockpi-4cplus). Minimal, well-maintained, mainline kernel.
- **Camera needed:** Radxa's own build, via [github.com/radxa-build/rock-4c-plus](https://github.com/radxa-build/rock-4c-plus/releases). Vendor kernel, heavier default image, but the ISP and camera overlays actually work.
- Either way, set the clock manually before your first `apt update` on a fresh board with no NTP yet — it saves a confusing round of TLS failures.
