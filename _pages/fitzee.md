---
layout: single
title: "Educational Robotics Project: Build an 8-DOF Quadruped Robot"
permalink: /fitzee/
author_profile: false
toc: true
toc_label: "Contents"
---

A Comprehensive STEM Curriculum Project for Electronics, Mechanical Assembly, Soldering, and Embedded Programming.

![8-DOF quadruped robot]({{ site.baseurl }}/_images/fitzee.png){: .align-center style="max-width: 600px;"}

---

## 1. Project Overview & Learning Objectives
This project guides students through the complete engineering workflow of building, wiring, programming, and calibrating an 8-Degree of Freedom (8-DOF) walking quadruped robot. 

By using 2 servos per leg (Hip and Knee), the robot operates as a 2D-planar leg system. This strikes an ideal educational balance: the mechanical assembly is highly approachable, the soldering component is meaningful without being overwhelming, and the mathematics behind the walking gaits (inverse kinematics) remain understandable for students.

### Key Learning Outcomes:
* **Mechanical Design & Assembly:** Understanding 3D printing tolerances, linkages, and structural rigidity.
* **Electronics & Hardware Engineering:** Understanding voltage regulation, common ground principles, filtering current spikes, and signal routing.
* **Practical Soldering Skills:** Planning circuit layouts on prototyping perf boards, managing high-current traces, and working with breakaway headers.
* **Embedded Software Development:** Writing real-time control code, managing multiple PWM signals, implementing smooth initialization routines, and basic robotic motion sequencing.

---

## 2. Bill of Materials (BOM)

All components selected below are chosen for high global availability, low cost, and standard sizing to ensure ease of procurement for classrooms.

### A. Core Actuators & Control
| Component | Specification / Recommended Part | Qty | Purpose & Educational Rationale |
| :--- | :--- | :--- | :--- |
| **Microcontroller Board** | **ESP32 Development Board** (NodeMCU 38-pin or similar format) | 1 | Chosen over classic Arduino Uno due to dual-core processing, much higher clock speeds for inverse kinematics, and built-in Wi-Fi/Bluetooth for future remote-control expansions. |
| **Micro Servos** | **TowerPro MG90S** (Metal Gears) | 8 | Actuates the joints (2 per leg). Metal gears are highly recommended over plastic SG90s, as the constant weight and leverage of a walking quadruped will quickly strip plastic teeth. |

### B. Power Management System
*Note: A walking quadruped draws significant peak currents (up to 4–5A when recovering from a fall). Powering servos directly from the microcontroller or a computer's USB port will cause brownouts and permanently damage components.*

| Component | Specification / Recommended Part | Qty | Purpose & Educational Rationale |
| :--- | :--- | :--- | :--- |
| **Batteries** | **18650 Li-ion Cells** (3.7V nominal, unprotected high-drain) | 2 | Globally ubiquitous, inexpensive, and reliable. Two cells wired in series provide a stable $\approx 7.4\text{V}$ base supply. Avoids expensive or highly specialized drone LiPo batteries. |
| **Battery Holder** | **Dual 18650 Battery Holder** (With thick wire leads) | 1 | Securely holds the cells on the chassis. Allows easy removal of cells for standard charging, making classroom rotation management simple. |
| **Voltage Regulator** | **LM2596 DC-DC Buck Converter** (Adjustable Step-Down) | 1 | Efficiently steps down the $7.4\text{V}$ battery power to a stable $5.0\text{V}$ - $6.0\text{V}$ required by the servos. Teaches students about switching regulators and thermal management. |

### C. Prototyping & Soldering Lab Essentials
Instead of a pre-built plug-and-play servo shield, students design and solder their own power distribution system to fulfill hardware learning objectives.

| Component | Specification / Recommended Part | Qty | Purpose & Educational Rationale |
| :--- | :--- | :--- | :--- |
| **Prototyping Board** | **Double-sided FR4 Perf Board** ($4\times6\text{ cm}$ or $5\times7\text{ cm}$) | 1 | Provides a rugged base for creating custom electrical connections. Forces students to plan trace routing and map out physical component layouts. |
| **Breakaway Headers** | **2.54mm (0.1\") Male and Female Pin Headers** | 1 strip ea. | Female headers socket the ESP32 (making it reusable and removable). Male headers are grouped into 3-pin clusters (Signal, VCC, GND) to plug in the servos. |
| **Main Switch** | **SPST Rocker or Toggle Switch** | 1 | Wired directly to the battery line. Acts as a vital safety cut-off when structural errors or runaway loops occur in student code. |
| **Filter Capacitor** | **1000µF Electrolytic Capacitor** (Rated for 10V or higher) | 1 | Placed directly across the main servo power rails. Acts as a local reservoir to buffer severe voltage drops when all 8 servos actuate simultaneously. |
| **Hookup Wire** | **22 AWG Solid Core Wire** (Assorted Colors) | 1 roll | Solid core wire is significantly easier for beginners to strip, bend cleanly around perf board grids, and solder into structural power rails. |

### D. Mechanical Fasteners & Materials
| Component | Specification / Recommended Part | Qty | Purpose & Educational Rationale |
| :--- | :--- | :--- | :--- |
| **Fasteners Kit** | **M3 Hex Button Head Screws & Nuts** (8mm, 12mm, 20mm lengths) | 1 kit | Standard industrial sizing. Easily threads into 3D-printed plastic parts and provides far better physical durability than fragile M2 hobby screws. |
| **3D Printer Filament** | **Standard PLA** (Polylactic Acid) | ~200g | The easiest material to print with minimal warping. Rigid enough to support the robot chassis and legs while keeping total assembly weight low. |

---

## 3. Circuit Architecture & Custom Shield Design

The core task of the electronics phase is to construct a **Custom Custom Servo Shield** on the perf board. This circuit must separate high-current demands from delicate logic signals while maintaining a unified ground.

### Connection Architecture Strategy:
1. **The Logic Socket:** Solder two parallel rows of female headers matching the footprint of the ESP32 dev board.
2. **The High-Current Rails:** Create two parallel, heavy-gauge solder traces across the board to serve as the **5V Servo Power Rail** and **Common Ground (GND) Rail**. 
3. **The Servo Ports:** Install 8 rows of 3-pin male headers. 
   * **Pin 1 (GND):** Wired directly to the heavy Ground Rail.
   * **Pin 2 (VCC):** Wired directly to the 5V regulated Output Rail.
   * **Pin 3 (Signal):** Connected via a thin hookup jumper wire back to an allocated, PWM-capable GPIO pin on the ESP32 female socket.
4. **The Isolation Rule:** The Output of the LM2596 buck converter powers *only* the 5V Servo Power Rail. The ESP32 should be powered safely through its own onboard regulator via its `VIN` or `5V` pin (fed by the battery or a separate line), ensuring massive servo current draws do not pull down the microcontroller's logic voltage.

---

## 4. Instructional Guidelines & Common Pitfalls

### Phase 1: The "90-Degree Calibration" Standard (Crucial)
* **The Pitfall:** Students will mechanically screw the servo horns onto the 3D-printed limbs, wire up the robot, and turn it on—causing limbs to snap, slam into the body, or stall out instantly.
* **The Solution:** Before *any* mechanical legs are attached to the servos, students must flash a simple script to the ESP32 that outputs a steady $90^\circ$ (or $1500\mu\text{s}$ pulse width) signal to all 8 channels. Once the active motors have self-centered to their midpoints, students then attach the limbs perpendicularly ($90^\circ$ angles relative to the body).

### Phase 2: Staggered Soft-Start Sequencing
* **The Pitfall:** Instantly initializing all 8 servos inside the setup function (`servo.attach()`) creates a massive, concurrent current surge that can trip safety cutoffs, blow fuses, or reset the MCU immediately.
* **The Solution:** Teach students to code a "soft-start" sequence. Initialize the servos one-by-one inside a looped startup array, introducing a brief delay (e.g., `delay(100);`) between each channel activation to spread the electrical load over time.

### Phase 3: The Common Ground Rule
* **The Pitfall:** The ESP32 logic loop executes perfectly when connected via USB, but the servos behave erratically, jitter wildly, or refuse to move when switched to battery power.
* **The Solution:** Ensure students have connected the Negative (`-`) terminal of the battery pack, the Ground (`GND`) pin of the ESP32, and the Ground (`OUT-`) terminal of the LM2596 buck converter to the exact same physical wire trace on their custom perf board. Without a common reference voltage, signal logic breaks down completely.