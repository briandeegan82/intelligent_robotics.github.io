---
layout: archive
title: "Free University Courses"
permalink: /library/courses/
library_section: courses
author_profile: false
---

{% include tutorial-styles.html %}

<p class="tutorial-intro">{{ site.data.curriculum.intro }}</p>
<p><a href="{{ site.baseurl }}/library/">&larr; Back to Library</a></p>

<div class="tutorial-toolbar">
  <strong>Browse by topic</strong>
  <div class="tutorial-chip-list">
    {% for track in site.data.curriculum.tracks %}
      <a class="tutorial-chip" href="#{{ track.slug }}">{{ track.title }}</a>
    {% endfor %}
    <a class="tutorial-chip" href="#top15">Top 15</a>
    <a class="tutorial-chip" href="#path">Suggested path</a>
    <a class="tutorial-chip" href="#related">Related spotlights</a>
  </div>
</div>

<h2 id="legend">Legend</h2>
<ul class="curriculum-legend">
  {% for item in site.data.curriculum.legend %}
    <li>
      <span class="library-badge library-badge--{{ item.key }}">{{ item.label }}</span>
      {{ item.description }}
    </li>
  {% endfor %}
</ul>

<h2 id="hubs">University hubs</h2>
<ul>
  {% for hub in site.data.curriculum.hubs %}
    <li><a href="{{ hub.url }}" target="_blank" rel="noopener">{{ hub.title }}</a></li>
  {% endfor %}
</ul>

{% include library-curriculum.html %}

<h2 id="priority">Priority shortlist</h2>
<p class="tutorial-intro">If you do not want all 100+ entries, start with these.</p>

<h3>Beginner</h3>
<ul>
  {% for item in site.data.curriculum.priority.beginner %}
    <li>{{ item }}</li>
  {% endfor %}
</ul>

<h3>Core robotics</h3>
<ul>
  {% for item in site.data.curriculum.priority.core %}
    <li>{{ item }}</li>
  {% endfor %}
</ul>

<h3>Intermediate / advanced</h3>
<ul>
  {% for item in site.data.curriculum.priority.intermediate %}
    <li>{{ item }}</li>
  {% endfor %}
</ul>

<h3>Advanced / graduate</h3>
<ul>
  {% for item in site.data.curriculum.priority.advanced %}
    <li>{{ item }}</li>
  {% endfor %}
</ul>

<h2 id="top15">Top 15</h2>
<p class="tutorial-intro">If you only have time for fifteen courses, these are the highest-leverage picks.</p>
<div class="tutorial-list">
  {% for item in site.data.curriculum.top15 %}
    <article class="tutorial-card-shell">
      <div class="tutorial-card">
        <div class="tutorial-card-body">
          <h3>
            {% if item.url %}
              <a href="{{ item.url }}" target="_blank" rel="noopener">{{ item.rank }}. {{ item.title }}</a>
            {% else %}
              {{ item.rank }}. {{ item.title }}
            {% endif %}
          </h3>
          <p>{{ item.why }}</p>
        </div>
      </div>
    </article>
  {% endfor %}
</div>

<h2 id="path">Suggested free robotics path</h2>
<p class="tutorial-intro">Do not grind courses in catalogue order. Build depth, then specialise — and ship a project after every two or three courses.</p>
<ol class="curriculum-path">
  {% for step in site.data.curriculum.path %}
    <li>
      <strong>{{ step.title }}</strong>
      <ul>
        {% for item in step.items %}
          <li>{{ item }}</li>
        {% endfor %}
      </ul>
    </li>
  {% endfor %}
</ol>

<p class="tutorial-intro">{{ site.data.curriculum.caveat }}</p>

<h2 id="related">Related spotlights &amp; learning paths</h2>
<p class="tutorial-intro">Curated write-ups and learning paths published on this site.</p>
{% include library-posts.html section="courses" sort="title" %}
