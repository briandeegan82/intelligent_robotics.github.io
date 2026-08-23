---
layout: single
title: "MKCad: Onshape Extension for Robotics COTS Parts"
date: 2026-06-17
permalink: /tutorials/cad/2026/06/17/mkcad-onshape-extension/
categories:
  - tutorials
  - cad
tutorial_order: 3
tags: [onshape, mkcad, cad, cots-parts, robotics]
thumbnail: /_images/tutorials/2026-06-17-mkcad-onshape-extension.png
thumbnail_source: juliaschatz/onshape-library-window
---

For competitive robotics and advanced mechanism design, the **MKCad** library is the gold standard in Onshape. It is maintained by the community and regularly updated with accurate, lightweight CAD models of commercial off-the-shelf (COTS) parts—including planetary gearboxes, brushless motors (like the REV NEO or Kraken X60), standard bearings, and metric/imperial structural extrusions.

Instead of downloading files to your desktop and uploading them manually, MKCad integrates directly inside the Onshape interface as an **App Extension**.

---

## 1. How to Install MKCad in Onshape

Because MKCad runs as an official App Store plugin, adding it to your workspace takes less than a minute and is completely free.

1. Navigate to the **Onshape App Store** (accessible directly at `appstore.onshape.com` or by clicking the **App Store** button in the top right corner of your Onshape dashboard).
2. In the search bar, type **MKCad**.
3. Select the **MKCad App** (published by Julia and the MKCad team).
4. Click **Subscribe** (it will show as $0.00/month).
5. Authorize the application to link with your Onshape account when prompted.

---

## 2. Using MKCad inside an Assembly

MKCad only works inside an **Assembly** tab, because it drops pre-modeled components into your environment to be mated together. You cannot use it directly inside a Part Studio tab.

### Step-by-Step Import Process

1. Open your document and switch to or create an **Assembly** tab.
2. Look at the **toolbar on the far right edge** of your screen. You will see a vertical row of small icons. Click the icon corresponding to the **MKCad App** (typically looks like a gear or a distinct robotics logo).
3. A slide-out panel will appear on the right side of your workspace.
4. Browse through the highly organized folders:
* **Motors:** Contains everything from hobby servos to heavy-duty industrial and brushless robotics motors.
* **Gears / Pulleys / Sprockets:** Lets you configure teeth counts, pitch, and bore styles (e.g., 8mm round vs. 1/2" hex).
* **Bearings & Bushings:** Standard metric and imperial sizes (like 608 skate bearings or flanged hex bearings).
* **Structure:** Extrusions, gussets, and plates.


5. Click on the specific part you need. For configurable items (like a configurable planetary gearbox or a specific length of structural channel), select your desired options from the drop-down menus within the panel.
6. Click **Insert**. The model will generate and appear at the origin of your assembly, ready for you to position.

---

## 3. Best Practices for Working with MKCad Components

Using these components efficiently prevents your large assemblies from lagging and ensures your 3D-printed mounts align perfectly.

### Simplify Assemblies with "Simplified" Configurations

Many complex MKCad parts (like planetary gearboxes or high-power motors) contain intricate internal geometries like steel gear teeth or internal rotor coils. If you leave these fully detailed, they can bog down your browser's graphics performance.

* **The Fix:** When inserting a complex motor from the MKCad panel, look for a configuration checkbox or drop-down labeled **Simplified** or **No Internals**. This keeps the exact outer dimensions and mounting holes identical but turns the internal complexity into a solid block, keeping your viewport lightning-fast.

### Replicating Holes via In-Context Editing

When you need to design a custom 3D-printed bracket to hold an MKCad motor, don't waste time looking up data sheets to manually measure the distance between the mounting threads.

1. Insert your MKCad motor into your **Assembly**.
2. Click the **In-Context Edit** button (or right-click the empty space and select *Create Part Studio in Context*). This allows you to design a new custom part *around* the active assembly.
3. Start a new sketch on the face of your custom bracket.
4. Use the **Use/Project (U)** tool to click directly on the bolt holes of the imported MKCad motor.
5. Onshape will instantly project those exact coordinates onto your sketch plane, ensuring your 3D-printed mount perfectly lines up with the real hardware on the first try.
