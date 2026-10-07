---
layout: single
title: "Inside the Tiny, Unfixable Eye: iFixit's iPhone 18 Pro Teardown"
date: 2026-10-07
permalink: /library/references/robotics/2026/10/07/ifixit-iphone-18-pro-teardown-variable-aperture/
categories:
  - library
  - references
tags: [teardown, camera, actuators, micro-mechanisms, repairability, ifixit, hardware-design]
description: "iFixit's iPhone 18 Pro and Pro Max teardown: a hair-thin six-blade magnetic variable aperture, electrically releasable battery adhesive, and a provisional 7/10 repairability score."
library_type: references
---

iFixit's [iPhone 18 Pro and Pro Max teardown](https://www.ifixit.com/News/119329/inside-the-tiny-unfixable-eye-iphone-18-pro-and-pro-max-teardown) (Elizabeth Chamberlain with Carsten Frauenheim, September 20, 2026) is a phone story, but it is also a good look at miniature actuation and design-for-service trade-offs. Both matter in robot vision and sensing hardware.

---

## The "eye": a variable aperture camera

Apple's first variable aperture uses **six polymer composite blades, each about as thin as a human hair**. The blades are driven magnetically and form a nearly perfectly round opening as they move. The tolerances are tight enough that iFixit treats the module as effectively unrepairable. If it is damaged, the realistic fix is replacing the whole camera assembly, at roughly $249 or more.

For robotics, this is a working example of a precision micro-actuator in a consumer-priced, mass-produced part. Controllable aperture also matters for machine vision, because it trades depth of field against light throughput without changing exposure time.

---

## What is more repairable

- **Battery:** A 13-screw metal tray replaces the old adhesive-heavy design. **Electrically releasable adhesive** lets the battery separate cleanly in about 90 seconds. The catch is that the job still needs front-screen access, which carries its own risk.
- **Thermal:** The A20 Pro chip sits outside the logic board sandwich, and the vapor chamber has roughly tripled in surface area, which helps sustained-load cooling.
- **Face ID:** The infrared camera moved beneath the display using selective pixel removal, similar to Samsung's approach, which shrinks the Dynamic Island.

## What is worse

- **Display frame:** Three of the four phones iFixit opened had cracked or peeling white plastic display frames. The cause is unclear, and iFixit calls it the biggest unanswered repair question.
- **Storage:** NAND now sits inside the logic board sandwich, so data recovery is more invasive.

**Provisional repairability score: 7/10.**

---

## Why it's worth reading

Electrically releasable adhesive, magnetic micro-actuation, and thermal packaging all carry over to compact robot sensors and wearables. The mix of one clever serviceability win and one sealed-off precision mechanism is also the usual tension in hardware design.

---

*Source: [iFixit News](https://www.ifixit.com/News/119329/inside-the-tiny-unfixable-eye-iphone-18-pro-and-pro-max-teardown)*
