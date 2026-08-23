---
layout: single
title: "Exporting from Onshape to Slicers: STEP, STL, and 3MF"
date: 2026-06-17
permalink: /tutorials/cad/2026/06/17/step-files-export-guide/
categories:
  - tutorials
  - cad
tutorial_order: 4
tags: [onshape, step, stl, 3mf, 3d-printing, export]
thumbnail: /_images/tutorials/2026-06-17-step-files-export-guide.png
thumbnail_source: juliaschatz/onshape-library-window
---

When exporting hardware designs from Onshape into modern slicers like **PrusaSlicer** or **Bambu Studio**, your settings directly dictate whether curved surfaces print smooth or faceted, and whether bolt holes line up exactly as dimensioned.

---

## 1. File Format: STEP vs. STL vs. 3MF

Modern slicers have evolved significantly. While STL was the old standard, it is no longer the optimal choice for precision robotics engineering.

| Feature | **STEP** (`.step` / `.stp`) | **3MF** (`.3mf`) | **STL** (`.stl`) |
| --- | --- | --- | --- |
| **Geometry Type** | **True Mathematical Curves** (NURBS) | Tessellated Triangles (High Density) | Tessellated Triangles |
| **Assembly Support** | Retains individual part multi-bodies | Retains individual parts + metadata | Smashes everything into one mesh (unless zipped) |
| **Slicer Curve Handling** | **Perfectly Smooth**. Slicer calculates Arc moves ($G2/G3$) | Segmented. Slicer approximates arcs from dense triangles | Segmented. Visibly faceted on low/medium settings |
| **Robotics Use Case** | **Best for structural parts & assemblies** | Good for multi-material or painted parts | Legacy fallback only |

### The Verdict: Use STEP Files

Always choose **STEP** when exporting functional mechanical parts. Because a STEP file saves the actual mathematical description of a curve rather than a mesh of triangles, modern slicers can translate a round hole into native printer arc commands ($G2$ and $G3$). This results in **perfectly circular bolt holes and cylindrical bearings**, smoother printer motion, and drastically reduced file sizes.

---

## 2. Onshape Export Configurations

When you right-click a **Part Studio tab**, an **Assembly tab**, or individual items from the **Parts List** and hit **Export**, use these explicit parameters based on your chosen format:

### Option A: If Exporting as STEP (Recommended)

* **Format:** `STEP`
* **Version:** `AP242` (This is the most modern standard and preserves the highest fidelity data, though `AP214` is also perfectly fine).
* **Units:** `Millimeter`
* **Splines as Polylines:** Leave this **unchecked**. Checking this forces Onshape to turn smooth curves into jagged linear line segments, destroying the primary benefit of using a STEP file.

### Option B: If Exporting as STL (Legacy Fallback)

If you must use an STL, you have to manually configure the mesh resolution to balance surface smoothness against file size:

* **Format:** `STL`
* **Units:** `Millimeter`
* **Binary/ASCII:** `Binary` (Binary files are significantly smaller and faster for slicers to compute than ASCII).
* **Resolution:** Switch this from *Medium* or *Fine* to **Custom**.

Once **Custom** is selected, input these high-precision values tailored for mechanical fits:

* **Angular Deviation:** `2.5 degrees` (Prevents curves from looking like low-poly stop signs).
* **Chordal Tolerance:** `0.025 mm` (This dictates the maximum allowable distance between the true CAD curve and the flat triangle face. This tight tolerance ensures bearing seats fit properly).
* **Minimum Facet Width:** `0.025 mm`

---

## 3. The Unit Mismatch Trap (Millimeters vs. Inches)

A frequent point of frustration when importing CAD into a slicer is a part suddenly rendering $25.4\times$ too small or too large.

* **The Issue:** The STL file format is **unitless**. It only knows that a wall is "100" units long. If you modeled in inches in Onshape but your export settings are set to millimeters, your slicer (which defaults to metric) reads that "100" as 100 millimeters.
* **The Fix:** Always explicitly select **Millimeter** in the Onshape export dialog box, regardless of what your workspace document units are set to. Both PrusaSlicer and Bambu Studio assume incoming data is metric by default.

---

## 4. Exporting Assemblies vs. Part Studios

How you trigger the export changes how your slicer interprets your components:

* **Exporting from a Part Studio Tab:** If your studio contains a custom motor bracket, a spacer, and a clamp face, exporting the whole tab as a STEP file will bring all three items into PrusaSlicer or Bambu Studio simultaneously. The slicer will ask if you want to import them as a **Single Object with Multi-parts** or **Separate Objects**. Choose *Separate Objects* so you can arrange, rotate, or duplicate individual pieces on your build plate.
* **Exporting from an Assembly Tab:** Essential if you want to print a complex mechanism pre-arranged in its physical space. Modern slicers will maintain the absolute spatial coordinates of the components relative to each other, allowing you to print interlocking parts or print-in-place mechanisms exactly where they belong.
