@echo off
echo Initializing Git repository...
git init
git add .
git commit -m "Initial commit"
git branch -M main
echo Adding remote origin...
git remote add origin https://github.com/hussamgalal999/mimo-cli-max.git
echo Pushing to GitHub...
git push -u origin main
echo Done.
pause
