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

{% include tutorial-styles.html %}

Step-by-step guides organized by track. Start with a track hub or jump to recent updates.

{% assign sorted_categories = site.data.tutorials.categories | sort: "order" %}
<div class="tutorial-category-grid">
{% for cat in sorted_categories %}
{% assign cat_posts = site.posts | where_exp: "post", "post.categories contains cat.slug" %}
  <section class="tutorial-category-card">
    <h3><a href="{{ site.baseurl }}/tutorials/{{ cat.slug }}/">{{ cat.title }}</a></h3>
    <p class="tutorial-count">{{ cat_posts.size }} tutorial{% if cat_posts.size != 1 %}s{% endif %}</p>
    <p>{{ cat.description }}</p>
    {% assign latest_post = cat_posts | first %}
    {% if latest_post %}
      <p><strong>Latest:</strong> <a href="{{ latest_post.url | prepend: site.baseurl }}">{{ latest_post.title }}</a></p>
    {% endif %}
  </section>
{% endfor %}
</div>

[View all tutorials &rarr;]({{ site.baseurl }}/tutorials/)
