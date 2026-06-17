---
layout: archive
title: "Simulation"
permalink: /tutorials/simulation/
tutorial_category: simulation
author_profile: false
---

{% include tutorial-styles.html %}
{% assign current_category = site.data.tutorials.categories | where: "slug", page.tutorial_category | first %}
<p class="tutorial-intro">{{ current_category.description }}</p>
<p><a href="{{ site.baseurl }}/tutorials/">&larr; Back to all tutorial tracks</a></p>

{% include tutorial-posts.html category=page.tutorial_category %}
