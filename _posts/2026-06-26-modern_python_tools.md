# Setting Up a Modern Cross-Platform Python Project

Python has evolved significantly over the past few years. While older tutorials often recommend `virtualenv`, `pip`, and `requirements.txt`, modern projects benefit from faster package managers, reproducible lock files, and tools that work consistently across Windows, macOS, and Linux.

This guide walks through a modern Python project setup using:

* **Pixi** for environment management
* **uv** for Python package management
* **Git** for source control
* **Pytest** for testing
* **Ruff** for linting and formatting

The result is a fast, reproducible, cross-platform development environment.

---

# The Cross-Platform Challenge

Traditional Python development often begins with instructions like:

> Windows users should...
>
> macOS users should...
>
> Linux users should...

Installing Python, OpenSSL, SQLite, compilers, Git, CUDA, or FFmpeg can require different commands and package managers depending on your operating system.

For example:

| Platform   | Package Manager           |
| ---------- | ------------------------- |
| Windows    | winget, Chocolatey, Scoop |
| macOS      | Homebrew                  |
| Ubuntu     | apt                       |
| Fedora     | dnf                       |
| Arch Linux | pacman                    |

A project README quickly becomes filled with operating system-specific installation instructions.

Modern tooling aims to eliminate this complexity.

---

# A Modern Toolchain

Each tool has a clearly defined responsibility.

| Tool   | Responsibility                                                                 |
| ------ | ------------------------------------------------------------------------------ |
| Pixi   | Development environment, Python installation, system dependencies, task runner |
| uv     | Python packages and dependency locking                                         |
| Git    | Version control                                                                |
| Pytest | Testing                                                                        |
| Ruff   | Linting and formatting                                                         |

This separation keeps each tool focused while making projects easier to reproduce.

---

# Why Pixi?

Pixi is built around the idea that a project should define **its complete development environment**, not just its Python dependencies.

Instead of asking developers to install software manually, the project declares what it needs:

* Python
* Git
* OpenSSL
* SQLite
* C/C++ compiler
* FFmpeg
* CUDA
* Node.js
* Rust
* or any other supported package

Pixi installs the correct package for each operating system.

For example:

```toml
[dependencies]
python = "3.12"
git = "*"
ffmpeg = "*"
```

A Windows developer receives Windows binaries.

A macOS developer receives macOS binaries.

A Linux developer receives Linux packages.

The `pixi.toml` file remains identical across all platforms.

---

# Step 1: Create the Project

```bash
pixi init my-project
cd my-project
```

This creates the project configuration.

---

# Step 2: Install Python

```bash
pixi add python=3.12
```

Unlike traditional workflows, there is no need to install Python separately before beginning development.

Each developer receives the version specified by the project.

---

# Step 3: Initialize uv

```bash
uv init
```

This creates a standard `pyproject.toml`.

uv manages Python packages while Pixi manages the wider development environment.

---

# Step 4: Install Dependencies

Application dependencies:

```bash
uv add requests fastapi pandas
```

Development tools:

```bash
uv add --dev pytest ruff
```

uv resolves dependencies quickly and creates a reproducible lock file.

---

# Step 5: Define Common Tasks

Pixi includes a task runner.

Instead of documenting platform-specific commands, define them once:

```toml
[tasks]
run = "python -m my_project"
test = "pytest"
lint = "ruff check ."
format = "ruff format ."
```

Developers use the same commands everywhere:

```bash
pixi run run
pixi run test
pixi run lint
pixi run format
```

No PowerShell-specific scripts.

No Bash-specific scripts.

No separate Windows and Unix documentation.

---

# Cross-Platform Benefits

Traditional setup instructions often resemble:

## Windows

```text
Install Python
Install Git
Install OpenSSL
Install Visual Studio Build Tools
Install FFmpeg
```

## macOS

```text
brew install python git openssl ffmpeg
```

## Ubuntu

```text
sudo apt install python3 git ffmpeg build-essential
```

Every operating system requires different commands.

With Pixi:

```bash
pixi install
```

The same command works on every supported platform.

This dramatically reduces onboarding time for new developers.

---

# Working with Native Libraries

Many Python packages depend on native libraries.

Examples include:

* NumPy
* SciPy
* PyTorch
* GDAL
* OpenCV
* FFmpeg
* PostgreSQL client libraries

Historically these have been among the hardest parts of setting up a development environment.

Pixi installs these dependencies consistently across operating systems, reducing the need for platform-specific documentation and troubleshooting.

---

# Project Layout

A typical project might look like this:

```text
my-project/
├── pixi.toml
├── pixi.lock
├── pyproject.toml
├── uv.lock
├── src/
│   └── my_project/
├── tests/
├── README.md
└── .gitignore
```

Each file has a clear purpose:

| File             | Purpose                     |
| ---------------- | --------------------------- |
| `pixi.toml`      | Environment definition      |
| `pixi.lock`      | Locked environment versions |
| `pyproject.toml` | Python project metadata     |
| `uv.lock`        | Locked Python dependencies  |

---

# When to Use Pixi Alone

Pixi can install packages from both Conda channels and the Python Package Index (PyPI).

For many applications, this means Pixi alone is sufficient.

Typical examples include:

* data science
* machine learning
* research
* internal business applications
* scientific computing

A single tool keeps the workflow simple while remaining reproducible.

---

# When to Add uv

If you're developing a reusable Python package, uv adds additional capabilities:

* Python packaging
* publishing to PyPI
* workspace support
* dependency groups
* Python-specific workflows

In this setup:

* Pixi manages the operating system environment.
* uv manages Python packages.

The two tools complement rather than replace one another.

---

# Why This Matters

The biggest challenge in software development is often not writing code—it's getting everyone running the same code.

Modern tooling shifts the focus from "How do I install everything on my operating system?" to "Clone the repository and run one command."

Whether your team develops on Windows, macOS, Linux, or a mixture of all three, a project managed with Pixi and uv provides a consistent development experience with minimal platform-specific setup.
