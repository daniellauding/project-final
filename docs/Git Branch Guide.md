# Git Branch Guide — Separating Features from School Project

This project started as a Technigo bootcamp final project on `main`. New features
(like pin-drop comments) are developed on feature branches so the school submission
stays clean and new work can be reviewed via PRs.

## Current setup

```
main                ← school project submission (protected)
feature/pin-drop-comments  ← Figma-style pin comments
```

## How to work with branches

### Start a new feature
```bash
git checkout main
git pull
git checkout -b feature/your-feature-name
# ... work ...
git add -A && git commit -m "Add your feature"
git push -u origin feature/your-feature-name
```

### Create a PR
```bash
gh pr create --base main --title "Add pin-drop comments" --body "Description here"
```

### If you want to move main to a "school" branch and make main your production branch
```bash
# 1. Create a snapshot of the school submission
git checkout main
git checkout -b school/final-submission   # frozen copy

# 2. Push the snapshot
git push -u origin school/final-submission

# 3. Now main becomes your production branch — merge features into it
git checkout main
git merge feature/pin-drop-comments
git push
```

### If you want to keep main as the school project
```bash
# Create a separate "production" branch
git checkout main
git checkout -b production
git merge feature/pin-drop-comments
git push -u origin production

# Future features merge into production, not main
```

## Recommended approach

Keep `main` as the school submission. Create a `production` branch for post-school
development. Feature branches merge into `production` via PRs. This way you can
always point your teacher at `main` and show off new work on `production`.

```
main (school) ──────────────────────────────────→
       \
        production ──── merge features here ────→
              \         /
               feature/pin-drop-comments
```
