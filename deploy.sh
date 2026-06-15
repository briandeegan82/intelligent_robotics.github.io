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
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Changes pushed successfully${NC}"
else
    echo -e "${RED}✗ Push failed${NC}"
    exit 1
fi

echo -e "${GREEN}=== Deploy Complete ===${NC}"
