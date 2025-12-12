@echo off
echo Configuring remote...
:: Add origin if missing
git remote add origin https://github.com/hussamgalal999/mimo-cli-max.git
:: Ensure origin URL is correct
git remote set-url origin https://github.com/hussamgalal999/mimo-cli-max.git

echo Syncing with GitHub...
:: Pull changes from GitHub (e.g. README) to allow merging
git pull origin main --allow-unrelated-histories --no-edit

echo Preparing files...
git add .
:: Commit if there are changes
git commit -m "Sync with remote"

echo Pushing to GitHub...
:: Push changes
git push -u origin main

echo Done! If asked for credentials, please enter them.
pause
