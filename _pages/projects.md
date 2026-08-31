---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
---

This page tracks course and cohort projects linked to the MSc Intelligent Robotics programme.

## Current Focus

- Sensing and perception pipelines
- Control and autonomous navigation workflows
- Digital twin implementation for robotics systems

## Projects

{% include tutorial-styles.html %}
{% include project-posts.html %}

## Related Tools

Open-source stacks and platforms highlighted in the [Library]({{ site.baseurl }}/library/tools/):

{% if site.data.library.related_tools %}
<div class="tutorial-list">
  {% for item in site.data.library.related_tools %}
    <article class="tutorial-card-shell">
      <div class="tutorial-card">
        <div class="tutorial-card-body">
          <h3><a href="{{ item.url | prepend: site.baseurl }}">{{ item.title }}</a></h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </article>
  {% endfor %}
</div>
{% endif %}
