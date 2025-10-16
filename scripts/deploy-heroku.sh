#!/bin/bash
# Heroku Deployment Script
# Automates deployment to Heroku

set -e  # Exit on error

echo "🚀 Heroku Deployment - Ring Builder"
echo "==================================="
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
  echo "❌ Heroku CLI not installed!"
  echo ""
  echo "Install with:"
  echo "  brew install heroku/brew/heroku"
  echo ""
  exit 1
fi

echo "✅ Heroku CLI found"
echo ""

# Login check
echo "🔐 Checking Heroku authentication..."
heroku auth:whoami || {
  echo "❌ Not logged in to Heroku"
  echo "Run: heroku login"
  exit 1
}
echo "✅ Logged in to Heroku"
echo ""

# App name
read -p "Enter Heroku app name (e.g., my-ring-builder): " APP_NAME

if [ -z "$APP_NAME" ]; then
  echo "❌ App name required!"
  exit 1
fi

# Create app (if doesn't exist)
echo "📱 Creating Heroku app..."
heroku create $APP_NAME || echo "App already exists, continuing..."
echo ""

# Add PostgreSQL
echo "🗄️  Adding PostgreSQL..."
heroku addons:create heroku-postgresql:mini --app $APP_NAME || echo "PostgreSQL already added, continuing..."
echo ""

# Set environment variables
echo "⚙️  Setting environment variables..."
echo ""
echo "Please provide the following (from your Shopify Partner Dashboard):"
echo ""

read -p "SHOPIFY_API_KEY: " API_KEY
read -p "SHOPIFY_API_SECRET: " API_SECRET

APP_URL="https://$APP_NAME.herokuapp.com"

heroku config:set \
  SHOPIFY_API_KEY="$API_KEY" \
  SHOPIFY_API_SECRET="$API_SECRET" \
  SHOPIFY_APP_URL="$APP_URL" \
  SCOPES="write_products,read_products,write_orders,read_orders,write_customers,read_customers" \
  NODE_ENV="production" \
  --app $APP_NAME

echo "✅ Environment variables set"
echo ""

# Optional: Email service
read -p "Do you want to configure email service (SendGrid)? (y/n): " CONFIGURE_EMAIL

if [ "$CONFIGURE_EMAIL" = "y" ]; then
  read -p "SendGrid API Key: " SENDGRID_KEY
  read -p "From Email Address: " FROM_EMAIL
  
  heroku config:set \
    SENDGRID_API_KEY="$SENDGRID_KEY" \
    EMAIL_FROM_ADDRESS="$FROM_EMAIL" \
    EMAIL_FROM_NAME="Ring Builder" \
    --app $APP_NAME
    
  echo "✅ Email configured"
  echo ""
fi

# Add git remote (if not exists)
echo "🔗 Adding Heroku git remote..."
git remote add heroku https://git.heroku.com/$APP_NAME.git 2>/dev/null || echo "Remote already exists"
echo ""

# Deploy
echo "🚀 Deploying to Heroku..."
echo "This may take a few minutes..."
echo ""
git push heroku main || git push heroku master

echo ""
echo "✅ Deployment complete!"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
heroku run npx prisma migrate deploy --app $APP_NAME
echo "✅ Migrations complete"
echo ""

# Open app
echo "🌐 App URL: $APP_URL"
echo ""

read -p "Open app in browser? (y/n): " OPEN_APP

if [ "$OPEN_APP" = "y" ]; then
  heroku open --app $APP_NAME
fi

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "Next steps:"
echo "1. Update Shopify app settings with new URL: $APP_URL"
echo "2. Test the app: $APP_URL"
echo "3. Check logs: heroku logs --tail --app $APP_NAME"
echo "4. Monitor: heroku ps --app $APP_NAME"
echo ""
echo "App Store URLs to update:"
echo "- App URL: $APP_URL"
echo "- Privacy Policy: $APP_URL/privacy-policy.html"
echo "- Terms of Service: $APP_URL/terms-of-service.html"
echo ""

