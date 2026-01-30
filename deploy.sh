#!/bin/bash

# PRODUCTION
set -e

echo "📥 Pulling latest code..."
git reset --hard
git checkout master
git pull origin master

echo "🧩 Rebuilding and starting production..."
npm i
npm run build
pm2 start process.config.js --env production

echo "✅ Deployment finished successfully!"

# DEVELOPMENT
# git reset --hard
# git checkout develop
# git pull origin develop

# npm i
# pm2 start "npm run start:dev" --name=TopGear