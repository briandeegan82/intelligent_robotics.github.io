---
layout: single
title: "10 Free Courses Worth Studying Before a Robotics Master's"
date: 2026-09-28
permalink: /library/courses/robotics/2026/09/28/ten-free-courses-before-robotics-msc/
categories:
  - library
  - courses
tags: [courses, robotics-msc, linear-algebra, control, slam, ros, open-courseware, learning-path]
description: "A practical free-course prep list for a robotics Master's — linear algebra, probability, signals, control, ROS, convex optimisation, SLAM, and underactuated robotics — based on Akshet Patel's curated recommendations."
library_type: courses
---

If you are heading into a robotics Master's (or want the same foundation without enrolling yet), you do not need to wait for term to start. [Akshet Patel](https://www.linkedin.com/in/akshetpatel) published a short list of **ten free courses** he would study first — maths and systems foundations, then classical robotics, ROS, control, optimisation, SLAM, and underactuated dynamics. The point is not to finish everything in a few weeks; it is to build the background that makes graduate robotics much easier to absorb.

Here is that list with direct course links, grouped in a sensible study order, plus how it maps onto this site's [Free University Courses]({{ site.baseurl }}/library/courses/) curriculum.

---

## Maths and systems foundations

1. **[Linear Algebra — MIT (Gilbert Strang / 18.06)](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/)**  
   Matrices, vector spaces, eigenvalues — the language of kinematics, Kalman filters, and almost every robotics paper.

2. **[Probability — Harvard (Stat 110)](https://projects.iq.harvard.edu/stat110/youtube)**  
   Probability as modelling, not just formulas. Essential for estimation, SLAM, and anything probabilistic.

3. **[Signals and Systems — MIT (6.003)](https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/)**  
   LTI systems, convolution, frequency-domain thinking — the bridge into control and filtering.

4. **[Introduction to Linear Dynamical Systems — Stanford (EE263)](https://ee263.stanford.edu/)**  
   Stephen Boyd's course on linear systems, least squares, and dynamical models used throughout control and estimation.

---

## Robotics core

5. **[Introduction to Robotics — Stanford (CS223A)](https://see.stanford.edu/Course/CS223A)**  
   Classical manipulator robotics: kinematics, dynamics, control, and planning. One of the strongest open foundations available.

6. **[Programming for Robotics (ROS) — ETH Zürich](https://rsl.ethz.ch/education-students/lectures.html)**  
   Practical robot software and ROS — so theory can land on a real stack.

---

## Control, optimisation, and perception

7. **[Control Bootcamp — Steve Brunton](https://www.youtube.com/playlist?list=PLMrJAkhIeNNR20Mz-VpzgfQs5zrYi085m)**  
   A fast, intuition-first tour of modern/optimal control: LQR, Kalman filtering, LQG, and related ideas with MATLAB examples.

8. **[Convex Optimization — Stanford (Boyd / EE364a)](https://web.stanford.edu/class/ee364a/)**  
   Convex sets, duality, and practical optimisation — the backbone of trajectory optimisation, estimation, and many planning formulations.

9. **[Robot Mapping / SLAM — University of Freiburg (Stachniss)](https://www.youtube.com/playlist?list=PLgnQpQtFTOGQrZ4O5QzbIHgl3b1JHimN_)**  
   Probabilistic SLAM families, filters, and graph-based mapping. Pair with this site's [SLAM algorithms overview]({{ site.baseurl }}/library/references/robotics/2026/08/21/types-of-slam-algorithms/).

10. **[Underactuated Robotics — MIT (Russ Tedrake)](https://underactuated.csail.mit.edu/)**  
    Nonlinear dynamics, optimal control, and locomotion — the advanced control course many robotics programmes assume you can grow into.

---

## How to use the list

Treat it as a **foundation stack**, not a binge:

| Phase | Focus | Courses |
| --- | --- | --- |
| 1 | Linear algebra + probability | 1–2 |
| 2 | Systems + linear dynamics | 3–4 |
| 3 | Classical robotics + ROS | 5–6 |
| 4 | Control + optimisation | 7–8 |
| 5 | Mapping + advanced dynamics | 9–10 |

Ship a small project after every two or three courses — even a simple simulated manipulator, EKF tracker, or ROS turtle demo — so the maths sticks to something physical.

For a broader, topic-organised directory (Michigan, MIT, Stanford, ETH, NPTEL, and more), use the [Free University Courses]({{ site.baseurl }}/library/courses/) page. Several of the courses above already appear there under mathematical foundations, classical robotics, control, perception, and programming tracks.

---

*Source: [Akshet Patel on LinkedIn — "10 Free Courses I Would Study Before a Robotics MSc"](https://www.linkedin.com/posts/akshetpatel_robotics-roboticsengineering-mastersdegree-share-7506694566155321344-bDOU/) · Profile: [linkedin.com/in/akshetpatel](https://www.linkedin.com/in/akshetpatel)*
