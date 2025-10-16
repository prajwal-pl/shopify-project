# PostgreSQL Migration Guide

**From:** SQLite (development)  
**To:** PostgreSQL (production)  
**Phase:** 3.0  
**Date:** October 14, 2025

---

## 🎯 WHY POSTGRESQL?

**SQLite Limitations:**

- ❌ Single file database (not scalable)
- ❌ No concurrent writes
- ❌ Limited for multi-tenant SaaS
- ❌ Not recommended for production

**PostgreSQL Benefits:**

- ✅ Handles 1000+ concurrent merchants
- ✅ Full ACID compliance
- ✅ Row-level security (RLS)
- ✅ Better indexing and performance
- ✅ Production-ready scalability

---

## 📋 MIGRATION STEPS

### Step 1: Set Up PostgreSQL Database

**Option A: Local PostgreSQL (Testing)**

```bash
# macOS with Homebrew
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb ring_builder_production

# Create user
psql postgres
CREATE USER ring_builder WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ring_builder_production TO ring_builder;
```

**Option B: Hosted PostgreSQL (Production)**

**Heroku Postgres:**

```bash
heroku addons:create heroku-postgresql:mini
heroku pg:info
# Get DATABASE_URL from output
```

**Supabase:**

1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database

**DigitalOcean:**

1. Create managed PostgreSQL cluster
2. Get connection string
3. Add to environment variables

**Railway:**

1. Create new PostgreSQL database
2. Copy connection URL
3. Add to environment variables

---

### Step 2: Update Prisma Schema

**File:** `prisma/schema.prisma`

**Change:**

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:dev.sqlite"
}
```

**To:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### Step 3: Set Environment Variable

**Development:**

```bash
# .env
DATABASE_URL="postgresql://ring_builder:your_password@localhost:5432/ring_builder_production"
```

**Production (Heroku):**

```bash
heroku config:set DATABASE_URL="postgresql://..."
```

**Production (Other):**

- Add DATABASE_URL to environment variables in your hosting platform

---

### Step 4: Run Migrations

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Run all migrations
npx prisma migrate deploy

# Verify migrations
npx prisma migrate status
```

**Expected Output:**

```
✅ All migrations applied successfully
```

---

### Step 5: Migrate Existing Data (Optional)

If you have existing SQLite data you want to keep:

**Option A: Manual Export/Import**

```bash
# Export from SQLite
npx prisma db execute --file=export-data.sql --schema=prisma/schema-sqlite.prisma

# Import to PostgreSQL
psql -h localhost -U ring_builder -d ring_builder_production -f export-data.sql
```

**Option B: Use Prisma Studio**

1. Open SQLite: `npx prisma studio` (with SQLite config)
2. Copy important data (configurations, settings)
3. Switch to PostgreSQL
4. Open PostgreSQL: `npx prisma studio`
5. Paste data

**Option C: Start Fresh**

- For development/testing, just start with empty database
- No migration needed

---

### Step 6: Test Database Connection

```bash
# Test connection
npx prisma db execute --stdin <<< "SELECT 1;"

# View database
npx prisma studio
```

**Should See:**

- All tables created
- Connection successful
- Prisma Studio opens

---

### Step 7: Update Application Code

**No code changes required!** ✅

Prisma ORM abstracts the database, so your application code works with both SQLite and PostgreSQL without changes.

---

### Step 8: Test Application

```bash
# Run app
npm run dev

# Test:
# 1. Create merchant
# 2. Create subscription
# 3. Add products
# 4. Create configurations
# 5. Customer inquiries
```

---

## 🔧 POSTGRESQL-SPECIFIC OPTIMIZATIONS

### Enable Row-Level Security (Optional but Recommended)

**Why:** Extra layer of multi-tenant isolation

**SQL:**

```sql
-- Enable RLS on all ring builder tables
ALTER TABLE "Merchant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Configuration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StoneMetadata" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SettingMetadata" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomerInquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppSettings" ENABLE ROW LEVEL SECURITY;

-- Example policy (app user can only access own shop's data)
CREATE POLICY shop_isolation_policy ON "Configuration"
  FOR ALL
  USING (shop = current_setting('app.current_shop')::TEXT);
```

### Add Database Indexes

**Run after migration:**

```sql
-- Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_merchant_status ON "Merchant"(status);
CREATE INDEX IF NOT EXISTS idx_subscription_plan ON "Subscription"(plan);
CREATE INDEX IF NOT EXISTS idx_config_created ON "Configuration"(shop, "createdAt" DESC);
```

**Note:** Most indexes already defined in Prisma schema!

---

## 📊 CONNECTION POOLING (Production)

### For High Traffic

**Update DATABASE_URL:**

```
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=20"
```

**Or use PgBouncer:**

```bash
# Add PgBouncer for connection pooling
# Heroku: Add buildpack
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-pgbouncer

# Or use Supabase (has built-in pooling)
```

---

## 🚨 TROUBLESHOOTING

### Connection Errors

**Error:** `Can't reach database server`

- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Check firewall rules
- Test connection: `psql $DATABASE_URL`

**Error:** `SSL required`

- Add `?sslmode=require` to DATABASE_URL
- Or: `?sslmode=disable` (local dev only)

**Example:**

```
DATABASE_URL="postgresql://...?sslmode=require"
```

### Migration Errors

**Error:** `Migration failed to apply`

- Check PostgreSQL version (need 12+)
- Ensure user has CREATE privileges
- Try running migrations individually

**Error:** `Table already exists`

- Reset database: `npx prisma migrate reset`
- Or manually drop tables and re-run

### Performance Issues

**Slow queries:**

```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM "StoneMetadata" WHERE shop = 'test.myshopify.com';

-- Add missing indexes if needed
CREATE INDEX idx_custom ON "StoneMetadata"(shop, shape, carat);
```

---

## ✅ VALIDATION CHECKLIST

After migration, verify:

**Database:**

- [ ] All tables created
- [ ] All indexes created
- [ ] Foreign keys working
- [ ] Queries fast (< 100ms)

**Application:**

- [ ] App starts successfully
- [ ] Can create merchant
- [ ] Can create subscription
- [ ] Can add products
- [ ] Customer flow works
- [ ] Admin flow works

**Performance:**

- [ ] Build succeeds
- [ ] TypeScript passes
- [ ] Page load < 2s
- [ ] Queries < 100ms

---

## 🚀 PRODUCTION CHECKLIST

Before going live:

**Database:**

- [ ] PostgreSQL 14+ installed
- [ ] Database created with proper user
- [ ] Connection pooling configured
- [ ] Backups enabled (automated)
- [ ] Monitoring set up

**Environment:**

- [ ] DATABASE_URL set
- [ ] All env vars configured
- [ ] SSL mode enabled
- [ ] Connection limit set

**Security:**

- [ ] Strong database password
- [ ] Network firewall rules
- [ ] No public access (except app)
- [ ] Encrypted connections

---

## 💾 BACKUP & RESTORE

### Automated Backups

**Heroku:**

```bash
heroku pg:backups:schedule DATABASE_URL --at '02:00 America/New_York'
heroku pg:backups
```

**Manual Backup:**

```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

**Restore:**

```bash
psql $DATABASE_URL < backup-20251014.sql
```

---

## 📈 MONITORING

### Query Performance

```sql
-- Enable slow query logging
ALTER DATABASE ring_builder_production SET log_min_duration_statement = 1000;

-- View slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Database Size

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('ring_builder_production'));

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🎯 NEXT: PRODUCTION DEPLOYMENT

After PostgreSQL migration:

1. Deploy to production hosting
2. Configure environment variables
3. Run migrations in production
4. Test end-to-end
5. Submit to App Store

See: `docs/DEPLOYMENT.md` for deployment guide

---

**Document Version:** 1.0  
**Last Updated:** October 14, 2025  
**Status:** Ready to Use
