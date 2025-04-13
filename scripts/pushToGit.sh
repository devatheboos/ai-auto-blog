#!/bin/bash

git config --global user.email "$GIT_EMAIL"
git config --global user.name "$GIT_NAME"

git add posts/*.md public/images/*.png
git commit -m "🤖 Auto-post: $(date)"
git push "$GITHUB_REPO" HEAD:main
