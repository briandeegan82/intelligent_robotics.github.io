# Intelligent Robotics Website

Course-facing website for the MSc Intelligent Robotics community, built with Jekyll Academic Pages.

## Key Links

- Programme page: [University of Galway MSc Intelligent Robotics](https://www.universityofgalway.ie/courses/taught-postgraduate-courses/intelligent-robotics.html)
- Research: [CAR Group](https://car.universityofgalway.ie/)
- LinkedIn: [Brian Deegan](https://www.linkedin.com/in/brian-deegan-54928b60/)
- GitHub: [briandeegan82](https://github.com/briandeegan82)
- Course repositories:
  - [EE5109 Control, Locomotion, Navigation](https://github.com/EE5109-Control-Locomotion-Navigation)
  - [EE5108 Digital Twins](https://github.com/EE5108-DigitalTwins)
  - [EE5110 Sensing and Perception](https://github.com/EE5110-Sensing-Perception)

## Local Development

1. Install Ruby and build tools (first-time setup on Ubuntu/Debian):

	```bash
	sudo apt update
	sudo apt install -y ruby-full ruby-dev build-essential zlib1g-dev
	```

2. Install Bundler and Jekyll in your user gem path:

	```bash
	gem install --user-install bundler jekyll
	```

3. Ensure your gem bin path is on `PATH` (add once):

	```bash
	echo 'if command -v ruby >/dev/null 2>&1; then' >> ~/.bashrc
	echo '  export PATH="$HOME/.local/share/gem/ruby/$(ruby -e '\''print RbConfig::CONFIG["ruby_version"]'\'')/bin:$PATH"' >> ~/.bashrc
	echo 'fi' >> ~/.bashrc
	source ~/.bashrc
	```

4. Install site dependencies:

	```bash
	bundle config set --local path vendor/bundle
	bundle install
	```

5. Run locally:

	```bash
	bundle exec jekyll serve
	```

6. Open:

	http://127.0.0.1:4000/intelligent_robotics.github.io/

## Troubleshooting

If commands like `cat`, `sudo`, or `bundle` are suddenly missing, your `PATH` is likely broken.

1. Temporary recovery for the current shell:

	```bash
	export PATH=/usr/bin:/bin
	```

2. Reload your shell config:

	```bash
	source ~/.bashrc
	```

3. Check required commands:

	```bash
	command -v cat
	command -v sudo
	command -v ruby
	command -v bundle
	```

If `bundle install` fails with permissions under `/var/lib/gems`, run Bundler in project-local mode:

```bash
bundle config set --local path vendor/bundle
bundle install
```

## Structure

- `index.md`: Homepage (programme overview, research links, and tutorials)
- `_pages/about.md`: Redirects to homepage
- `_pages/people.md`: Course people and links
- `_pages/projects.md`: Project overview
- `_pages/publications.md`: Publications and reports
- `_posts/`: Technical posts and guides
