---
layout: splash
title: Home
sidebar:
  nav: "sidebar"
---

![University of Galway Logo]({{ site.baseurl }}/_images/University_Of_Galway_Logo__Positive_Landscape.png){: .align-center style="max-width: 600px;"}

Welcome to the Intelligent Robotics website.

## MSc Intelligent Robotics

This site shares course activities, student work, and technical resources connected to the MSc Intelligent Robotics community.

## Quick Links

- LinkedIn: [Brian Deegan](https://www.linkedin.com/in/brian-deegan-54928b60/)
- GitHub: [briandeegan82](https://github.com/briandeegan82)
- Programme: [University of Galway MSc Intelligent Robotics](https://www.universityofgalway.ie/courses/taught-postgraduate-courses/intelligent-robotics.html)

## Course GitHub Organizations

- [EE5109 Control, Locomotion, Navigation](https://github.com/EE5109-Control-Locomotion-Navigation)
- [EE5108 Digital Twins](https://github.com/EE5108-DigitalTwins)
- [EE5110 Sensing and Perception](https://github.com/EE5110-Sensing-Perception)

## Focus Areas

- Sensing and perception for autonomous systems
- Control and navigation for robotics platforms
- Digital twins and simulation-to-real workflows

## Tutorials

Step-by-step guides organized by topic. Browse the full library or jump into a category:

{% assign sorted_categories = site.data.tutorials.categories | sort: "order" %}
{% for cat in sorted_categories %}
{% assign cat_posts = site.posts | where_exp: "post", "post.categories contains cat.slug" %}
- **[{{ cat.title }}]({{ site.baseurl }}/tutorials/{{ cat.slug }}/)** — {{ cat.description }}
  {% for post in cat_posts limit:2 %}
  - [{{ post.title }}]({{ post.url | prepend: site.baseurl }})
  {% endfor %}
{% endfor %}

[View all tutorials &rarr;]({{ site.baseurl }}/tutorials/)
