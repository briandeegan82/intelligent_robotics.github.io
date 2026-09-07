---
layout: archive
title: "Conferences"
permalink: /library/conferences/
library_section: conferences
author_profile: false
---

{% include tutorial-styles.html %}
{% assign current_section = site.data.library.sections | where: "slug", page.library_section | first %}
<p class="tutorial-intro">{{ current_section.description }}</p>
<p><a href="{{ site.baseurl }}/library/">&larr; Back to Library</a></p>

{% include library-conferences.html %}
