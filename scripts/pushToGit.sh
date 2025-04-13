#!/bin/bash

echo "📧 Configuring Git"
git config --global user.email "$GIT_EMAIL"
git config --global user.name "$GIT_NAME"

echo "📁 Adding new posts and images"
git add posts/*.md public/images/*.png

echo "🔍 Checking for staged changes..."
if git diff --cached --quiet; then
  echo "🟡 No new changes to commit."
else
  echo "📝 Committing changes..."
  git commit -m "🤖 Auto-post: $(date)"
fi

echo "🚀 Pushing to remote..."
git push "$REPO_PUSH_URL" HEAD:main
