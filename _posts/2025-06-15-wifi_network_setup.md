---
layout: single
title: "WiFi Network Setup for ROS 2 with TP-Link AC750"
date: 2025-06-15
permalink: /tutorials/ros/2025/06/15/wifi-network-setup/
categories:
  - tutorials
  - ros
tags: [wifi, tp-link, ros2, portable-setup, rb5, network-config]
---

Setting up a small ROS 2 network using your **TP-Link AC750 WiFi Travel Adapter** (likely the **TL-WR902AC**) is a great solution for a portable robotics setup. Here's how to configure it for your **Ubuntu MATE laptop (ROS2 base station)** and **Qualcomm RB5 (robot)**:

---

### **Step 1: Configure the TP-Link AC750 as an Access Point (AP)**
1. **Connect to the Travel Router**  
   - Plug the TP-Link into power and connect your laptop via Ethernet or WiFi.
   - Default IP: `192.168.0.1` (check manual).  
   - Login via browser (default credentials: `admin/admin`).

2. **Set Up Access Point Mode**  
   - Go to **Operation Mode** → Select **Access Point (AP) Mode**.
   - Configure WiFi:
     - **SSID**: `ros2_network` (or your choice)
     - **Password**: Set a secure password (e.g., `robotics123`).
     - **Security**: WPA2-PSK (AES recommended).
   - Save settings and reboot.

---

### **Step 2: Connect Devices to the Network**
- **Laptop (Ubuntu MATE)**:
  - Connect to `ros2_network` via WiFi or Ethernet.
  - Check IP with `ip a` (should be `192.168.0.x`).
- **Qualcomm RB5**:
  - Connect to the same `ros2_network` (WiFi/Ethernet).
  - Verify IP with `ip a`.

---

### **Step 3: Configure ROS 2 Communication**
1. **Install ROS 2** (if not already installed)  
   - Follow [ROS 2 installation guide](https://docs.ros.org/en/humble/Installation.html) for both devices.

2. **Set ROS 2 Environment Variables**  
   On **both devices**, edit `~/.bashrc`:
   ```bash
   echo "export ROS_DOMAIN_ID=42" >> ~/.bashrc  # Pick a unique number (0-101)
   echo "export ROS_IP=$(hostname -I | awk '{print $1}')" >> ~/.bashrc
   echo "export ROS_MASTER_URI=http://$(hostname -I | awk '{print $1}'):11311" >> ~/.bashrc
   source ~/.bashrc
   ```
   - Replace `ROS_MASTER_URI` with the laptop's IP if using **ROS1 bridge**.

3. **Test Communication**  
   - On **laptop**, run:
     ```bash
     ros2 run demo_nodes_cpp talker
     ```
   - On **RB5**, run:
     ```bash
     ros2 run demo_nodes_py listener
     ```
   - If messages are received, the network is working!

---

### **Step 4: Optional Optimizations**
- **Static IPs** (recommended): Assign fixed IPs in the TP-Link DHCP settings.
- **Firewall Rules**: Allow ROS2 ports (`11311`, `11883` for DDS):
  ```bash
  sudo ufw allow from 192.168.0.0/24 to any port 11311
  sudo ufw allow from 192.168.0.0/24 to any port 11883
  ```
- **Multicast Setup**: If using DDS (like FastDDS), ensure multicast is enabled:
  ```bash
  sudo route add -net 224.0.0.0 netmask 240.0.0.0 dev wlan0  # Replace `wlan0` with your interface
  ```

---

### **Troubleshooting**
- **No Communication?**  
  - Check `ROS_DOMAIN_ID` matches on both devices.
  - Verify no firewall blocks (`sudo ufw disable` temporarily).
  - Use `ros2 topic list` to check visibility.
- **Slow Performance?**  
  - Reduce WiFi interference (use 5GHz if available).
  - Limit bandwidth-heavy nodes.

---

Yes, running ROS 2 in **Docker** introduces some additional considerations for networking, especially when using your **TP-Link AC750 travel router** as the access point. Here’s how to adapt the setup:

---

### **Key Challenges with ROS 2 in Docker**
1. **Network Isolation**  
   - By default, Docker containers run in their own network namespace and may not see the host’s WiFi/Ethernet interfaces directly.
2. **Multicast Issues**  
   - ROS 2’s DDS (e.g., FastDDS or CycloneDDS) relies on multicast for discovery, which Docker blocks by default.
3. **IP Address Assignment**  
   - Containers may get different IPs than the host, breaking ROS 2 communication.

---

### **Solution: Configure Docker for ROS 2 Networking**
#### **Option 1: Use `--network=host` (Simplest)**
Run the container in **host mode** to share the host’s network stack:
```bash
docker run --network=host -it ros:humble  # Replace with your ROS 2 image
```
- **Pros**: No extra setup; multicast works.  
- **Cons**: Less isolation (container shares host’s network).

#### **Option 2: Use a Bridged Network (More Secure)**
1. **Create a custom Docker network** with multicast enabled:
   ```bash
   docker network create --driver=bridge --subnet=192.168.0.0/24 --attachable ros2_net
   ```
2. **Run containers on this network**:
   ```bash
   docker run --net=ros2_net -it ros:humble
   ```
3. **Manually set ROS 2 IPs** inside containers:
   ```bash
   export ROS_IP=<container_ip>  # Must be in the same subnet as host (e.g., 192.168.0.x)
   export ROS_MASTER_URI=http://<host_ip>:11311
   ```

#### **Option 3: Use Docker Compose (Recommended for Multi-Container)**
Example `docker-compose.yml`:
```yaml
version: '3'
services:
  ros2_node:
    image: ros:humble
    network_mode: host  # Or use custom network as above
    environment:
      - ROS_DOMAIN_ID=42
      - ROS_IP=<host_or_container_ip>
    volumes:
      - /tmp:/tmp  # Shared memory for DDS
```

---

### **Additional Fixes for Docker-Specific Issues**
1. **Enable Multicast** (if not using `host` mode):  
   ```bash
   docker run --sysctl net.ipv4.icmp_echo_ignore_broadcasts=0 --cap-add=NET_ADMIN ...
   ```
2. **Share Host’s DDS Configuration**:  
   Bind-mount the host’s ROS 2 configs into the container:
   ```bash
   docker run -v /opt/ros/humble:/opt/ros/humble -v ~/.ros:/root/.ros ...
   ```
3. **Test Discovery**:  
   Inside the container, run:
   ```bash
   ros2 daemon stop  # Restart the daemon
   ros2 topic list   # Should show topics from other devices
   ```

---

### **Step-by-Step Setup with Docker**
1. **On the Host (Laptop)**  
   - Ensure the host is connected to the TP-Link AP (`ros2_network`).  
   - Run the ROS 2 container in `host` mode (Option 1) for simplicity.

2. **On the Qualcomm RB5**  
   - If also running Docker, use the same `--network=host` or a bridged network.  
   - Set matching `ROS_DOMAIN_ID` and `ROS_IP` environment variables.

3. **Verify Communication**  
   - **Host (container)**:
     ```bash
     ros2 run demo_nodes_cpp talker
     ```
   - **RB5 (container or host)**:
     ```bash
     ros2 run demo_nodes_py listener
     ```
   - If no messages, check `ROS_IP` and firewall rules.

---

### **Troubleshooting**
- **Error: "No multicast traffic received"**  
  - Use `--network=host` or manually enable multicast (see Option 2).  
  - Run `sudo wireshark` to check if multicast packets (e.g., `239.255.0.1`) are reaching the host.  
- **ROS 2 nodes can’t discover each other**  
  - Set `export ROS_DISCOVERY_SERVER=<host_ip>:11811` (if using discovery servers).  
  - Alternatively, switch DDS middleware (e.g., `export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp`).  

---

### **Summary**
- For simplicity, **use `--network=host`** in Docker.  
- If security is critical, **create a custom bridged network** and configure ROS IPs manually.  
- Ensure **multicast is enabled** and **firewalls allow ROS 2 ports**.  

Let me know if you hit any snags!
