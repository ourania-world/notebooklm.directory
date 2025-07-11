#!/bin/bash

echo "🚀 Deploying notebooklm.directory to production"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Ask which platform to deploy to
echo "📦 Where would you like to deploy?"
echo "1) Vercel"
echo "2) Netlify"
echo "3) GitHub Pages"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        netlify deploy --prod
        ;;
    3)
        echo "🚀 Deploying to GitHub Pages..."
        
        # Check if gh-pages branch exists
        if git rev-parse --verify gh-pages &>/dev/null; then
            echo "gh-pages branch exists, updating..."
        else
            echo "Creating gh-pages branch..."
            git checkout --orphan gh-pages
            git rm -rf .
            echo "# NotebookLM Directory" > README.md
            git add README.md
            git commit -m "Initial gh-pages commit"
            git push origin gh-pages
            git checkout main
        fi
        
        # Create a temporary directory for the build
        mkdir -p dist
        cp index.html dist/
        cp detail.html dist/
        cp styles.css dist/
        cp favicon.ico dist/ 2>/dev/null || echo "No favicon found, skipping..."
        
        # Switch to gh-pages branch and update
        git checkout gh-pages
        cp -r dist/* .
        rm -rf dist
        
        git add .
        git commit -m "Update GitHub Pages site"
        git push origin gh-pages
        
        # Switch back to main branch
        git checkout main
        
        echo "✅ Deployed to GitHub Pages"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "✅ Deployment complete!"