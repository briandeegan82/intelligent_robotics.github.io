---
layout: splash
title: Home
sidebar:
  nav: "sidebar"
redirect_from:
  - /about/
---

![University of Galway Logo]({{ site.baseurl }}/_images/University_Of_Galway_Logo__Positive_Landscape.png){: .align-center style="max-width: 600px;"}

This site supports the **MSc Intelligent Robotics** community at the [University of Galway](https://www.universityofgalway.ie/). It is a shared hub for programme information, course resources, technical notes, and project activity across core robotics modules.

## MSc Intelligent Robotics

**Master AI, robotics, and automation for tomorrow's technology.**

The MSc in Intelligent Robotics equips students with cutting-edge expertise in robotics, AI, computer vision, simulation, human–robot interaction, and automation. Graduates gain hands-on skills to develop advanced robotic systems — from digital twins and computer vision to autonomous navigation and smart manufacturing.

| | |
|---|---|
| **Award** | Master of Science (Level 9 NFQ) |
| **Course code** | 1MIR1 |
| **Duration** | 1 year, full-time |
| **Delivery** | On campus |
| **ECTS** | 90 |
| **Average intake** | 15 |
| **Next intake** | September 2026 |
| **College** | [College of Science and Engineering](https://www.universityofgalway.ie/science-engineering/) |

[Official programme page](https://www.universityofgalway.ie/courses/taught-postgraduate-courses/intelligent-robotics.html) · [How to apply](https://www.universityofgalway.ie/courses/taught-postgraduate-courses/intelligent-robotics.html#how-to-apply)

### Why choose this programme?

**Employability** — Prepares graduates for impactful careers across sectors driving technological change, from autonomous systems and advanced manufacturing to IoT, AI, and data analytics.

**Practical training** — Students develop expertise in AI, IoT, and data analytics through real-world projects, preparing for roles in research, innovation, and development.

**Specialist depth** — The programme builds advanced skills in robotics, computer vision, and control systems for cutting-edge industry and research careers.

## What you will study

The programme is structured as **90 ECTS** over one academic year:

- **60 ECTS taught modules** (Autumn and Spring semesters)
- **30 ECTS research thesis** on a state-of-the-art intelligent robotics topic, undertaken across the full year

All students complete the research thesis. You also choose advanced technology modules (45–50 ECTS combined) and transferable skills modules (10–15 ECTS).

### Required modules

| Module | Title | Credits |
|--------|-------|---------|
| EE5110 | Sensing and Perception for Robotics and Autonomous Vehicles | 5 |
| EE5109 | Robotic Control, Navigation and Locomotion | 5 |
| EE5108 | Digital Twins for Robotics | 5 |
| EE5132 | MSc Project Thesis | 30 |

### Indicative elective modules

Module availability may vary by year. Examples include:

- Robotic Control, Navigation and Locomotion
- Embedded Image Processing · Embedded Computer Vision
- Sensing and Perception for Automation and Robotics
- Digital Twins for Robotics
- Internet of Things Systems Design
- Machine Learning · Data Analytics
- Mobile Networks: Architecture and Services
- Digital Signal Processing · Computer Security

**Transferable skills options** include financial management, technology innovation and entrepreneurship, research methods for engineers, lean systems, project management, safety engineering, and introduction to sustainability.

## Programme features

- **Year-long research thesis (30 ECTS)** — Apply theory to real-world intelligent robotics challenges.
- **Flexible specialisation (45–50 ECTS)** — Tailor your expertise across AI, computer vision, digital twins, IoT, and autonomous systems.
- **Professional skills (10–15 ECTS)** — Build competencies in innovation, business, regulation, and research methods.
- **Integrated curriculum** — Combines deep technical knowledge with practical and professional development.
- **Career-ready profile** — Designed for both industry and research pathways.

## Careers

Graduates are prepared for dynamic roles in autonomous vehicles, advanced manufacturing, IoT, AI, and data analytics — wherever robotics, computer vision, and control systems expertise is in demand. The programme supports careers in innovation, research, and development across technology, science, and sustainable engineering.

## Research

Teaching and projects on this programme connect to active robotics research at the University of Galway. For ongoing research in control, autonomy, and robotics systems, see the **[Control &amp; Autonomy Research (CAR) Group](https://car.universityofgalway.ie/)**.

## Learning and assessment

Learning combines lectures, seminars with industry experts, and laboratory sessions with expert faculty. You will work on case studies, data-driven projects, coding exercises, group projects, and individual assignments, using cutting-edge robotic hardware and industry-standard tools.

Assessment includes continuous coursework (reports, essays, presentations, laboratory work), written and oral examinations, and a substantial research thesis developing robotic solutions for real-world use cases.

## Entry requirements

Candidates typically hold at least a **Second Class Honours Level 8** degree in a related subject, or a related primary degree without honours plus three years of relevant practical experience.

Applicants whose first language is not English require **IELTS 6.5** overall (no less than 6.5 in Writing and no less than 6.0 in any other band), or equivalent. Applications are accepted on a rolling basis.

Full entry requirements, fees, scholarships, and supporting documents are on the [official programme page](https://www.universityofgalway.ie/courses/taught-postgraduate-courses/intelligent-robotics.html#entry-requirements).

**Programme contact:** [brian.deegan@universityofgalway.ie](mailto:brian.deegan@universityofgalway.ie)

## This website

- Publish module-aligned technical content and tutorials
- Showcase student and cohort project outcomes
- Maintain reusable robotics references for future cohorts

## Course GitHub Organizations

- [EE5109 Control, Locomotion, Navigation](https://github.com/EE5109-Control-Locomotion-Navigation)
- [EE5108 Digital Twins](https://github.com/EE5108-DigitalTwins)
- [EE5110 Sensing and Perception](https://github.com/EE5110-Sensing-Perception)

## Explore the site

[Tutorials]({{ site.baseurl }}/tutorials/) · [Library]({{ site.baseurl }}/library/) · [Projects]({{ site.baseurl }}/projects/) · [Jobs Board]({{ site.baseurl }}/robotics-jobs/)

## Tutorials

{% include tutorial-styles.html %}

Step-by-step guides organized by track. Start with a track hub or jump to recent updates.

{% assign sorted_categories = site.data.tutorials.categories | sort: "order" %}
<div class="tutorial-category-grid">
{% for cat in sorted_categories %}
{% assign cat_posts = site.posts | where_exp: "post", "post.categories contains cat.slug" %}
  <section class="tutorial-category-card">
    {% if cat.thumbnail %}
      <a href="{{ site.baseurl }}/tutorials/{{ cat.slug }}/" aria-hidden="true" tabindex="-1">
        <img class="tutorial-thumb" src="{{ cat.thumbnail | prepend: site.baseurl }}" alt="" loading="lazy">
      </a>
    {% endif %}
    <div class="tutorial-card-body">
      <h3><a href="{{ site.baseurl }}/tutorials/{{ cat.slug }}/">{{ cat.title }}</a></h3>
      <p class="tutorial-count">{{ cat_posts.size }} tutorial{% if cat_posts.size != 1 %}s{% endif %}</p>
      <p>{{ cat.description }}</p>
      {% assign latest_post = cat_posts | first %}
      {% if latest_post %}
        <p><strong>Latest:</strong> <a href="{{ latest_post.url | prepend: site.baseurl }}">{{ latest_post.title }}</a></p>
      {% endif %}
    </div>
  </section>
{% endfor %}
</div>

[View all tutorials &rarr;]({{ site.baseurl }}/tutorials/)
