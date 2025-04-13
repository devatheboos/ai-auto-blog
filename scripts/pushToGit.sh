#!/bin/bash

git config --global user.email "$GIT_EMAIL"
git config --global user.name "$GIT_NAME"

git add posts/*.md public/images/*.png

# Only commit if there are changes
git diff-index --quiet HEAD || git commit -m "🤖 Auto-post: $(date)"

# Push using the custom-named secret
git push "$REPO_PUSH_URL" HEAD:main
