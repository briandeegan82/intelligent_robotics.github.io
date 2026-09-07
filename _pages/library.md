---
layout: archive
title: "Library"
permalink: /library/
author_profile: false
redirect_from:
  - /resources/
---

Curated papers, tools, free university courses, conferences, and reference material for the Intelligent Robotics community.

{% include tutorial-styles.html %}

<div class="tutorial-toolbar">
  <strong>Browse the library</strong>
  <div class="tutorial-chip-list">
    {% assign sorted_sections = site.data.library.sections | sort: "order" %}
    {% for section in sorted_sections %}
      <a class="tutorial-chip" href="#{{ section.slug }}">{{ section.title }}</a>
    {% endfor %}
    <a class="tutorial-chip" href="#latest">Latest additions</a>
  </div>
</div>

{% assign sorted_sections = site.data.library.sections | sort: "order" %}
<div class="tutorial-category-grid">
{% for section in sorted_sections %}
  {% if section.slug == 'conferences' %}
    {% assign section_count = site.data.library.conferences.size %}
  {% elsif section.slug == 'courses' %}
    {% assign section_count = 0 %}
    {% for track in site.data.curriculum.tracks %}
      {% assign section_count = section_count | plus: track.courses.size %}
    {% endfor %}
  {% elsif section.slug == 'references' %}
    {% assign section_posts = site.posts | where_exp: "post", "post.library_type == section.slug" %}
    {% assign section_count = section_posts.size %}
  {% else %}
    {% assign section_posts = site.posts | where_exp: "post", "post.library_type == section.slug" %}
    {% assign section_count = section_posts.size %}
  {% endif %}
  <section id="{{ section.slug }}" class="tutorial-category-card">
    <div class="tutorial-card-body">
      <h3><a href="{{ site.baseurl }}/library/{{ section.slug }}/">{{ section.title }}</a></h3>
      {% if section.slug == 'references' %}
        <p class="tutorial-count">{{ section_count }} item{% if section_count != 1 %}s{% endif %} + {{ site.data.library.external.size }} external links</p>
      {% else %}
        <p class="tutorial-count">{{ section_count }} item{% if section_count != 1 %}s{% endif %}</p>
      {% endif %}
      <p>{{ section.description }}</p>
      <p><a href="{{ site.baseurl }}/library/{{ section.slug }}/">Open section &rarr;</a></p>
    </div>
  </section>
{% endfor %}
</div>

<h2 id="latest">Latest Library Additions</h2>
<p class="tutorial-intro">Recently added papers, tools, courses, and references.</p>
<div class="tutorial-list">
  {% assign all_library = site.posts | where_exp: "post", "post.categories contains 'library'" %}
  {% for post in all_library limit:8 %}
    {% assign preview = post.description %}
    {% if preview == nil or preview == "" %}
      {% assign preview = post.excerpt | strip_html | strip_newlines | truncate: 150 %}
    {% endif %}
    {% assign badge_label = post.library_type | capitalize %}
    <article class="tutorial-card-shell">
      <div class="tutorial-card{% if post.thumbnail %} tutorial-card--with-thumb{% endif %}">
        {% if post.thumbnail %}
          <a href="{{ post.url | prepend: site.baseurl }}" aria-hidden="true" tabindex="-1">
            <img class="tutorial-thumb" src="{{ post.thumbnail | prepend: site.baseurl }}" alt="" loading="lazy">
          </a>
        {% endif %}
        <div class="tutorial-card-body">
          <h3><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>
          <p class="tutorial-meta"><span class="library-badge">{{ badge_label }}</span> · {{ post.date | date: "%d %b %Y" }}</p>
          <p>{{ preview }}</p>
        </div>
      </div>
    </article>
  {% endfor %}
</div>
