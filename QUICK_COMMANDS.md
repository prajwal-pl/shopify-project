# Quick Command Reference 🚀

**Helpful npm scripts for Phase 3.0**

---

## 📦 Phase 3.0 Helper Commands

```bash
# Set up PostgreSQL database (Day 2)
npm run phase3:setup-db

# Deploy to Heroku (Day 6)
npm run phase3:deploy

# Setup monitoring (Day 7)
npm run phase3:monitor

# Quick local test (anytime)
npm run test:local
```

---

## 🗄️ Database Commands

```bash
# Run migrations
npm run db:migrate

# Open Prisma Studio (view database)
npm run db:studio

# Reset database (development only!)
npm run db:reset
```

---

## 🧪 Development Commands

```bash
# Start development server
npm run dev

# Check TypeScript
npm run typecheck

# Build for production
npm run build

# Run production build locally
npm run start
```

---

## 📊 Useful Checks

```bash
# Check build works
npm run typecheck && npm run build

# View database
npm run db:studio

# Check routes
ls -la app/routes/

# Check services  
ls -la app/services/

# View migrations
ls -la prisma/migrations/
```

---

## 🚀 Quick Start (Day 2)

```bash
# 1. Set up PostgreSQL
npm run phase3:setup-db

# 2. Test it works
npm run dev

# 3. View database
npm run db:studio

# Done! Ready for Day 3.
```

---

**That's it! Everything else has detailed guides in `/docs` folder.**
