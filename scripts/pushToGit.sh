#!/bin/bash

echo "🔧 Setting up Git..."
git config --global user.email "$GIT_EMAIL"
git config --global user.name "$GIT_NAME"

echo "📁 Git status BEFORE"
git status

echo "➕ Staging files..."
git add posts/*.md public/images/*.png logs/*.log 2>/dev/null || echo "⚠️ No files matched pattern"

echo "📝 Committing if changes exist..."
if git diff --cached --quiet; then
  echo "🟡 No changes to commit."
else
  git commit -m "🤖 Auto-post: $(date)"
fi

echo "🔗 Checking remotes"
git remote -v

echo "🚀 Attempting push to $REPO_PUSH_URL"
git push "$REPO_PUSH_URL" HEAD:main || {
  echo "❌ Git push failed with exit code $?"
  exit 128
}
