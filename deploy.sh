#!/bin/bash

# Academic Pages Build and Deploy Script
# Builds Jekyll site locally and pushes changes to GitHub

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default commit message
COMMIT_MSG="${1:-Update site content}"

echo -e "${BLUE}=== Building Jekyll Site ===${NC}"
bundle exec jekyll build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo -e "${BLUE}=== Staging Changes ===${NC}"
git add -A

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${BLUE}No changes to commit${NC}"
    exit 0
fi

echo -e "${BLUE}=== Committing Changes ===${NC}"
git commit -m "$COMMIT_MSG"

echo -e "${BLUE}=== Pushing to Remote ===${NC}"

# Avoid VS Code askpass socket issues in detached terminal sessions.
unset GIT_ASKPASS
unset VSCODE_GIT_IPC_HANDLE
unset VSCODE_GIT_ASKPASS_MAIN
unset VSCODE_GIT_ASKPASS_NODE
unset VSCODE_GIT_ASKPASS_EXTRA_ARGS

git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Changes pushed successfully${NC}"
else
    echo -e "${RED}✗ Push failed${NC}"
    echo ""
    echo "Authentication help:"
    echo "1) HTTPS + Personal Access Token:"
    echo "   - Create a GitHub token with repo scope"
    echo "   - Run: git push origin main"
    echo "   - Username: your GitHub username"
    echo "   - Password: paste the token"
    echo ""
    echo "2) SSH (recommended for repeat pushes):"
    echo "   - ssh-keygen -t ed25519 -C \"you@example.com\""
    echo "   - Add ~/.ssh/id_ed25519.pub to GitHub SSH keys"
    echo "   - git remote set-url origin git@github.com:briandeegan82/intelligent_robotics.github.io.git"
    echo "   - ssh -T git@github.com"
    echo "   - git push origin main"
    exit 1
fi

echo -e "${GREEN}=== Deploy Complete ===${NC}"
