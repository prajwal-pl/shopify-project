# AI Memory Folder - Documentation Guide

**Purpose:** Streamlined documentation for AI assistants  
**Last Updated:** October 14, 2025  
**Status:** Cleaned and organized

---

## 📁 ACTIVE FILES (Read These)

### **START HERE:** AI_CONTEXT_MASTER.md

**The single source of truth for AI assistants**

- Project overview and current status
- Architecture patterns
- Quick references
- Common tasks
- Troubleshooting guide

### PHASE_2_COMPLETE_FINAL.md

**Final Phase 2.0 completion report**

- All tasks completed
- Feature list
- File inventory
- Validation results
- Next steps

### PHASE_2_FINAL_STATUS_ANALYSIS.md

**Comprehensive PRD vs implementation analysis**

- Requirements compliance (100%)
- Task completion breakdown
- Success metrics
- Deployment readiness

### SECURITY_AUDIT_PHASE_2.md

**Security audit and recommendations**

- Security score: 8.5/10
- Authentication validation
- Input sanitization review
- Recommendations for production

---

## 📦 ARCHIVE FOLDER

**Contains:** Historical progress reports and incremental validations

**Purpose:** Reference only - not needed for active development

**Contents:**

- 40+ progress reports from development sessions
- Task-specific validation reports
- Incremental status updates
- Phase 1.0 historical documents

**When to Use:**

- Researching how a feature was built
- Understanding historical decisions
- Troubleshooting legacy issues

**Default Action:** Ignore archive - use active files above

---

## 🎯 FOR AI ASSISTANTS

### Quick Start

1. Read `AI_CONTEXT_MASTER.md` first
2. Check `PHASE_2_COMPLETE_FINAL.md` for current status
3. Refer to `../docs/` for specific guides

### When Working on Features

- Use patterns from `AI_CONTEXT_MASTER.md`
- Check security requirements in `SECURITY_AUDIT_PHASE_2.md`
- Validate against PRD compliance in `PHASE_2_FINAL_STATUS_ANALYSIS.md`

### When Debugging

- Check `AI_CONTEXT_MASTER.md` troubleshooting section
- Review architecture in same file
- Look at recent git changes

---

## 📚 DOCUMENTATION STRUCTURE

```
ai-memory/
├── AI_CONTEXT_MASTER.md          ⭐ START HERE
├── PHASE_2_COMPLETE_FINAL.md      📊 Final Report
├── PHASE_2_FINAL_STATUS_ANALYSIS.md  📈 PRD Compliance
├── SECURITY_AUDIT_PHASE_2.md      🔒 Security Review
├── README.md                      📖 This file
└── archive/                       📦 Historical (40+ files)

docs/
├── PHASE_2_MANUAL_TESTING.md      🧪 Complete testing guide
├── PHASE_2_SETUP.md               📖 Merchant onboarding
├── QUICK_VALIDATION_CHECKLIST.md  ✅ Quick tests
├── METAFIELDS_ARCHITECTURE.md     🏗️ Technical reference
├── API_TESTING.md                 🔌 API documentation
├── HOW_TO_USE_CSV_IMPORT.md       📄 CSV guide
├── DEPLOYMENT.md                  🚀 Deployment guide
└── archive/                       📦 Historical (8+ files)
```

---

## 🚨 IMPORTANT RULES

### For AI Assistants

**DO:**

- ✅ Read AI_CONTEXT_MASTER.md first
- ✅ Use patterns from master file
- ✅ Validate with typecheck + build
- ✅ Follow multi-tenant isolation
- ✅ Write tests/docs alongside code

**DON'T:**

- ❌ Read archive files unless specifically needed
- ❌ Create new progress reports (update master instead)
- ❌ Skip validation steps
- ❌ Use `any` types
- ❌ Break backward compatibility

---

## 📝 FILE UPDATE POLICY

### When to Update AI_CONTEXT_MASTER.md

- Major feature additions
- Architecture changes
- New critical patterns
- Important constraints

### When to Create New Files

- Security audits (major changes)
- Final completion reports (phase milestones)
- Comprehensive analysis (PRD reviews)

### When to Archive

- Incremental progress reports
- Task-specific validations
- Session summaries
- Superseded documentation

---

**Keep it clean, keep it relevant, keep it useful!** ✨
