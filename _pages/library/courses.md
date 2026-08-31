---
layout: archive
title: "Courses & Lectures"
permalink: /library/courses/
library_section: courses
author_profile: false
---

{% include tutorial-styles.html %}
{% assign current_section = site.data.library.sections | where: "slug", page.library_section | first %}
<p class="tutorial-intro">{{ current_section.description }}</p>
<p><a href="{{ site.baseurl }}/library/">&larr; Back to Library</a></p>

{% include library-posts.html section=page.library_section sort="title" %}
