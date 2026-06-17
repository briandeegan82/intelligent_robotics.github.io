---
layout: archive
title: "Tutorials"
permalink: /tutorials/
author_profile: false
redirect_from:
  - /year-archive/
---

A curated library of step-by-step guides for robotics and embedded systems development, organized by topic.

{% assign sorted_categories = site.data.tutorials.categories | sort: "order" %}
{% for cat in sorted_categories %}
  {% assign cat_posts = site.posts | where_exp: "post", "post.categories contains cat.slug" %}
  <section class="tutorial-category">
    <h2 id="{{ cat.slug }}"><a href="{{ site.baseurl }}/tutorials/{{ cat.slug }}/">{{ cat.title }}</a></h2>
    <p>{{ cat.description }}</p>
    <p><em>{{ cat_posts.size }} tutorial{% if cat_posts.size != 1 %}s{% endif %}</em> — <a href="{{ site.baseurl }}/tutorials/{{ cat.slug }}/">View all &rarr;</a></p>
    {% for post in cat_posts limit:3 %}
      {% include archive-single.html %}
    {% endfor %}
  </section>
{% endfor %}
