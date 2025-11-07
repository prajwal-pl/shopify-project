#!/bin/bash

# Pre-Deployment Checklist Script
# Run this before deploying to catch common issues

echo "🔍 Running Pre-Deployment Checks..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 20 ]; then
    echo -e "${GREEN}✓${NC} Node.js version: $(node -v)"
else
    echo -e "${RED}✗${NC} Node.js version too old. Requires >= 20.10"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: Dependencies installed
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules found"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found. Run 'npm install'"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 3: Prisma schema
echo "🗄️  Checking database configuration..."
if grep -q "provider = \"postgresql\"" prisma/schema.prisma; then
    echo -e "${GREEN}✓${NC} Prisma configured for PostgreSQL"
elif grep -q "provider = \"sqlite\"" prisma/schema.prisma; then
    echo -e "${RED}✗${NC} Prisma still using SQLite (needs PostgreSQL for production)"
    echo "   Update prisma/schema.prisma to use PostgreSQL"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 4: Environment variables template
echo "🔐 Checking environment configuration..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example exists"
else
    echo -e "${YELLOW}⚠${NC} .env.example not found"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 5: Vercel configuration
echo "☁️  Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json exists"
else
    echo -e "${RED}✗${NC} vercel.json not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 6: Build test
echo "🏗️  Testing build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed. Run 'npm run build' to see errors"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 7: shopify.app.toml
echo "🛍️  Checking Shopify configuration..."
if [ -f "shopify.app.toml" ]; then
    if grep -q "client_id" shopify.app.toml; then
        CLIENT_ID=$(grep "client_id" shopify.app.toml | cut -d'"' -f2)
        if [ ${#CLIENT_ID} -gt 10 ]; then
            echo -e "${GREEN}✓${NC} Shopify client_id configured"
        else
            echo -e "${YELLOW}⚠${NC} Shopify client_id looks incomplete"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi

    if grep -q "application_url" shopify.app.toml; then
        APP_URL=$(grep "application_url" shopify.app.toml | cut -d'"' -f2)
        if [[ $APP_URL == *"vercel.app"* ]] || [[ $APP_URL == "https://"* ]]; then
            echo -e "${GREEN}✓${NC} Application URL configured: $APP_URL"
        else
            echo -e "${YELLOW}⚠${NC} Application URL needs updating for production"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
else
    echo -e "${RED}✗${NC} shopify.app.toml not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 8: TypeScript types
echo "📝 Checking TypeScript..."
if npm run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} TypeScript check passed"
else
    echo -e "${YELLOW}⚠${NC} TypeScript errors found (won't block deployment)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 9: Git status
echo "📋 Checking Git status..."
if [ -d ".git" ]; then
    UNCOMMITTED=$(git status --porcelain | wc -l)
    if [ $UNCOMMITTED -eq 0 ]; then
        echo -e "${GREEN}✓${NC} No uncommitted changes"
    else
        echo -e "${YELLOW}⚠${NC} You have $UNCOMMITTED uncommitted changes"
        echo "   Consider committing before deploying"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} Not a Git repository"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC} Ready to deploy 🚀"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push"
    echo "2. Deploy on Vercel: vercel --prod"
    echo "3. Update Shopify app URLs"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo -e "${GREEN}No critical errors.${NC} You can proceed with deployment."
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
