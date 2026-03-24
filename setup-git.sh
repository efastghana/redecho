#!/bin/bash

# RedEcho Git & Deployment Setup Script
# Run this after cloning the repo

echo "🔴 RedEcho - Git & Deployment Setup"
echo "===================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git found"

# Initialize git if not already
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial RedEcho deployment setup"
    git branch -M main
    echo "✅ Git initialized"
else
    echo "⚠️  Git repository already exists"
fi

echo ""
echo "📋 Next steps:"
echo "1. Create GitHub repository at: https://github.com/new"
echo "   - Repository name: redecho"
echo "   - Make it PUBLIC"
echo ""
echo "2. Add remote and push:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/redecho.git"
echo "   git push -u origin main"
echo ""
echo "3. Follow deployment guide:"
echo "   https://github.com/YOUR_USERNAME/redecho/blob/main/DEPLOYMENT.md"
echo ""
echo "🚀 Ready to deploy!"
