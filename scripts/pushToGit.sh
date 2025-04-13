#!/bin/bash

echo "📧 Setting Git user info"
git config --global user.email "$GIT_EMAIL"
git config --global user.name "$GIT_NAME"

echo "📁 Staging new posts and images"
git add posts/*.md public/images/*.png

echo "✅ Checking for changes..."
if git diff --cached --quiet; then
  echo "🟡 No changes to commit."
else
  echo "📝 Committing changes..."
  git commit -m "🤖 Auto-post: $(date)"
fi

echo "🚀 Pushing to repo..."
git remote -v
git push "$REPO_PUSH_URL" HEAD:main
