@echo off
REM RedEcho Git & Deployment Setup Script (Windows)
REM Run this from project root

echo 🔴 RedEcho - Git and Deployment Setup
echo.
echo Checking git installation...

git --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo ✅ Git found
echo.

if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial RedEcho deployment setup"
    git branch -M main
    echo ✅ Git initialized
) else (
    echo ⚠️ Git repository already exists
)

echo.
echo 📋 Next steps:
echo.
echo 1. Create GitHub repository at: https://github.com/new
echo    - Repository name: redecho
echo    - Make it PUBLIC
echo.
echo 2. Add remote and push:
echo    git remote add origin https://github.com/YOUR_USERNAME/redecho.git
echo    git push -u origin main
echo.
echo 3. Follow deployment guide in DEPLOYMENT.md
echo.
echo 🚀 Ready to deploy!
pause
