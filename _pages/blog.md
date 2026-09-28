---
layout: archive
title: "Blog"
permalink: /blog/
author_profile: false
---

External articles and essays worth reading for the Intelligent Robotics community — ROS, autonomy, and related systems topics.

{% include tutorial-styles.html %}

{% if site.data.blog.posts and site.data.blog.posts.size > 0 %}
  <div class="tutorial-list">
    {% assign blog_posts = site.data.blog.posts | sort: "date" | reverse %}
    {% for post in blog_posts %}
      <article class="tutorial-card-shell">
        <div class="tutorial-card">
          <div class="tutorial-card-body">
            <h3><a href="{{ post.url }}" target="_blank" rel="noopener">{{ post.title }}</a></h3>
            <p class="tutorial-meta">
              <span class="library-badge">Blog</span>
              {% if post.author %} · {{ post.author }}{% endif %}
              {% if post.source %} · {{ post.source }}{% endif %}
              {% if post.date %} · {{ post.date | date: "%d %b %Y" }}{% endif %}
            </p>
            {% if post.description %}
              <p>{{ post.description }}</p>
            {% endif %}
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
{% else %}
  <p>No blog posts listed yet.</p>
{% endif %}
