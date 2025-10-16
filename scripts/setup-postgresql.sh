#!/bin/bash
# PostgreSQL Setup Script for Production
# Run this after setting up your PostgreSQL database

set -e  # Exit on error

echo "🗄️  PostgreSQL Setup for Ring Builder"
echo "===================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable not set!"
  echo ""
  echo "Please set it first:"
  echo "  export DATABASE_URL='postgresql://user:password@host:5432/database'"
  echo ""
  echo "Or for Heroku:"
  echo "  heroku config:get DATABASE_URL"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Backup current schema (if exists)
echo "📦 Backing up current schema..."
if [ -f "prisma/schema.prisma.sqlite" ]; then
  echo "Backup already exists, skipping..."
else
  cp prisma/schema.prisma prisma/schema.prisma.sqlite
  echo "✅ Backed up to prisma/schema.prisma.sqlite"
fi
echo ""

# Update Prisma schema for PostgreSQL
echo "🔧 Updating Prisma schema for PostgreSQL..."
cat > prisma/schema.prisma.postgres << 'SCHEMA'
// This is your Prisma schema file for PostgreSQL
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
SCHEMA

# Append the rest of the schema (models)
tail -n +15 prisma/schema.prisma >> prisma/schema.prisma.postgres

# Replace schema
mv prisma/schema.prisma.postgres prisma/schema.prisma
echo "✅ Schema updated for PostgreSQL"
echo ""

# Generate Prisma Client
echo "🔨 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Run migrations
echo "🚀 Running database migrations..."
npx prisma migrate deploy
echo "✅ Migrations applied"
echo ""

# Test connection
echo "🧪 Testing database connection..."
npx prisma db execute --stdin <<< "SELECT 1 as test;" > /dev/null 2>&1 && echo "✅ Database connection successful!" || echo "❌ Database connection failed!"
echo ""

# Show database info
echo "📊 Database Information:"
echo "---------------------"
npx prisma db execute --stdin <<< "
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
ORDER BY table_name;
"
echo ""

echo "🎉 PostgreSQL setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npx prisma studio (to view database)"
echo "2. Run: npm run dev (to test app)"
echo "3. Deploy to production"
echo ""

