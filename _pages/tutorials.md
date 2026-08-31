---
layout: archive
title: "Tutorials"
permalink: /tutorials/
author_profile: false
redirect_from:
  - /year-archive/
---

A curated library of step-by-step guides for robotics and embedded systems development, organized by topic.

{% include tutorial-styles.html %}

<div class="tutorial-toolbar">
  <strong>Find tutorials quickly</strong>
  <div class="tutorial-chip-list">
    {% assign sorted_categories = site.data.tutorials.categories | sort: "order" %}
    {% for cat in sorted_categories %}
      <a class="tutorial-chip" href="#{{ cat.slug }}">{{ cat.title }}</a>
    {% endfor %}
    <a class="tutorial-chip" href="{{ site.baseurl }}/library/">Library</a>
    <a class="tutorial-chip" href="#latest">Latest updates</a>
  </div>
</div>

{% assign sorted_categories = site.data.tutorials.categories | sort: "order" %}
<div class="tutorial-category-grid">
{% for cat in sorted_categories %}
  {% assign cat_posts = site.posts | where_exp: "post", "post.categories contains cat.slug" %}
  <section id="{{ cat.slug }}" class="tutorial-category-card">
    {% if cat.thumbnail %}
      <a href="{{ site.baseurl }}/tutorials/{{ cat.slug }}/" aria-hidden="true" tabindex="-1">
        <img class="tutorial-thumb" src="{{ cat.thumbnail | prepend: site.baseurl }}" alt="" loading="lazy">
      </a>
    {% endif %}
    <div class="tutorial-card-body">
      <h3><a href="{{ site.baseurl }}/tutorials/{{ cat.slug }}/">{{ cat.title }}</a></h3>
      <p class="tutorial-count">{{ cat_posts.size }} tutorial{% if cat_posts.size != 1 %}s{% endif %}</p>
      <p>{{ cat.description }}</p>
      <p><a href="{{ site.baseurl }}/tutorials/{{ cat.slug }}/">Open track &rarr;</a></p>
    </div>
  </section>
{% endfor %}
</div>

<p class="tutorial-intro">External references, papers, and curated tools live in the <a href="{{ site.baseurl }}/library/">Library</a>.</p>

<h2 id="latest">Latest Tutorial Updates</h2>
<p class="tutorial-intro">New and refreshed guides across all tracks.</p>
<div class="tutorial-list">
  {% assign all_tutorials = site.posts | where_exp: "post", "post.categories contains 'tutorials'" %}
  {% for post in all_tutorials limit:8 %}
    {% assign preview = post.excerpt | strip_html | strip_newlines | truncate: 150 %}
    <article class="tutorial-card-shell">
      <div class="tutorial-card{% if post.thumbnail %} tutorial-card--with-thumb{% endif %}">
        {% if post.thumbnail %}
          <a href="{{ post.url | prepend: site.baseurl }}" aria-hidden="true" tabindex="-1">
            <img class="tutorial-thumb" src="{{ post.thumbnail | prepend: site.baseurl }}" alt="" loading="lazy">
          </a>
        {% endif %}
        <div class="tutorial-card-body">
          <h3><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>
          <p class="tutorial-meta">{{ post.date | date: "%d %b %Y" }}</p>
          <p>{{ preview }}</p>
        </div>
      </div>
    </article>
  {% endfor %}
</div>
