# 🚀 Setting Up Ubuntu for ROS 2 & Unity Development

## **1️⃣ System Update**
```bash
sudo apt update && sudo apt upgrade -y
```

---

## **2️⃣ Install ROS 2 (Humble)**
```bash
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
```

### **Add ROS 2 Repository & Install**
```bash
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key | sudo apt-key add -
echo "deb http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/ros2.list
sudo apt update
sudo apt install ros-humble-desktop -y
```

### **Setup ROS 2 Environment**
```bash
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

### **Install ROS 2 Dependencies**
```bash
sudo apt install python3-colcon-common-extensions python3-rosdep python3-vcstool -y
sudo rosdep init
rosdep update
```

---

## **3️⃣ Install Unity & Unity Hub**
```bash
wget https://public-cdn.cloud.unity3d.com/hub/prod/UnityHub.AppImage
chmod +x UnityHub.AppImage
./UnityHub.AppImage
```
- Install **Unity Editor (2021 LTS or 2022 LTS)** via Unity Hub.
- Add **Linux Build Support** if needed.

---

## **4️⃣ Install VS Code & Extensions**
```bash
sudo apt install wget gpg -y
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /usr/share/keyrings/
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/vscode stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update
sudo apt install code -y
```
### **Recommended Extensions:**
- **C/C++** (Microsoft)
- **Python** (Microsoft)
- **ROS** (ms-iot.vscode-ros)
- **Unity Code Snippets**
- **ShaderLab Development**

---

## **5️⃣ Install Git & Other Dev Tools**
```bash
sudo apt install git build-essential cmake python3-pip -y
pip install -U argcomplete
```

---

## **6️⃣ Install NVIDIA Container Toolkit for Docker**
```bash
curl -s -L https://nvidia.github.io/nvidia-container-runtime/gpgkey | sudo apt-key add -
distribution=$(lsb_release -cs)
curl -s -L https://nvidia.github.io/nvidia-container-runtime/$distribution/nvidia-container-runtime.list | sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
sudo apt update
sudo apt install -y nvidia-container-toolkit
sudo systemctl restart docker
```

### **Test NVIDIA Docker Support**
```bash
docker run --rm --gpus all nvidia/cuda:12.2.0-base nvidia-smi
```

---

## **7️⃣ Create a ROS 2 Dockerfile with NVIDIA GPU Support**
```dockerfile
# Use the official ROS 2 Humble image
FROM ros:humble

# Install NVIDIA runtime dependencies
RUN apt update && apt install -y \
    mesa-utils libgl1-mesa-glx libgl1-mesa-dri libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install ROS 2 development tools
RUN apt update && apt install -y \
    ros-humble-desktop python3-colcon-common-extensions python3-rosdep python3-pip git \
    && rm -rf /var/lib/apt/lists/*

# Initialize rosdep
RUN rosdep init && rosdep update

# Set up ROS 2 environment
RUN echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc

# Set NVIDIA environment variables
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility,graphics

# Set display environment variables for GUI applications
ENV DISPLAY=:0
ENV QT_X11_NO_MITSHM=1

ENTRYPOINT ["/bin/bash"]
```

### **Build & Run the Docker Image**
```bash
docker build -t ros2-nvidia .
docker run --gpus all --rm -it --net=host \
    -e DISPLAY=$DISPLAY \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    --privileged ros2-nvidia
```

---

## **8️⃣ Using a Python Virtual Environment with ROS 2**
### **Install & Set Up Virtual Environment**
```bash
python3 -m venv ~/ros2_env
source ~/ros2_env/bin/activate
pip install --upgrade pip
pip install numpy opencv-python rosbags pandas scipy matplotlib
pip install rosdep vcstool colcon-common-extensions
```

### **Link Virtual Environment to ROS 2**
```bash
echo "export PYTHONPATH=$VIRTUAL_ENV/lib/python3.10/site-packages:$PYTHONPATH" >> ~/.bashrc
```

---

### Install gazebo sim 
Assuming you have jazzy installed, you'll need gazebo harmonic. Install with
```
sudo apt-get install ros-${ROS_DISTRO}-ros-gz
```

## **9️⃣ Testing Everything**
### **Check ROS 2 Installation**
```bash
ros2 run demo_nodes_cpp talker
```
(Open another terminal)
```bash
ros2 run demo_nodes_cpp listener
```
### **Check GPU in Docker**
```bash
docker run --gpus all --rm ros2-nvidia nvidia-smi
```
### **Check Unity Installation**
1. Open **Unity Hub**
2. Create a new **3D project**
3. Open it and check if everything runs.

---

## **🎯 Summary**
✅ Installed ROS 2, Unity, VS Code, and Git.
✅ Set up **Docker with NVIDIA GPU support**.
✅ Created a **ROS 2 Dockerfile** with **GPU acceleration**.
✅ Set up a **Python virtual environment** for ROS 2 Python development.
✅ Verified installation with **test commands**.

Now you're ready for **ROS 2 & Unity development on Ubuntu! 🚀**

