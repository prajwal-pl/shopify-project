# Master Testing Guide - Ring Builder MVP

**Purpose**: Complete testing strategy and execution guide  
**Last Updated**: October 12, 2025  
**Status**: Ready for Use

---

## Overview

This guide orchestrates all testing activities for the Ring Builder MVP. It references three detailed testing documents:

1. **`API_TESTING.md`** - Curl-based API endpoint testing
2. **`TESTING_CHECKLIST.md`** - Manual feature testing checklist
3. **`BUILD_VALIDATION.md`** - Build, deployment, and production validation

---

## Testing Philosophy

**Core Principles**:

- ✅ Test after EVERY sub-task completion
- ✅ Never skip validation steps
- ✅ Test on multiple browsers and devices
- ✅ Always verify multi-tenant isolation
- ✅ Backend validation is mandatory (don't trust client)
- ✅ Document all bugs immediately

**Test Pyramid**:

```
         /\
        /  \  E2E Tests (Manual & Automated)
       /----\
      /      \  Integration Tests (API Tests)
     /--------\
    /          \  Unit Tests (Services, Utils)
   /____________\
```

---

## Testing Workflow by Phase

### Phase 1: Foundation (Task 1.0)

**When**: After completing database and services

**What to Test**:

```bash
# 1. Verify Prisma schema
npx prisma format
npx prisma generate

# 2. Run migrations
npx prisma migrate dev

# 3. Open Prisma Studio
npx prisma studio
# Verify all 5 models exist

# 4. Run unit tests
npm test tests/utils/
npm test tests/services/

# Expected: All tests pass
```

**Checklist**:

- [ ] All 5 Prisma models created
- [ ] All utility functions tested
- [ ] All services have unit tests with >80% coverage
- [ ] `npm run typecheck` passes
- [ ] Can import and use all services

---

### Phase 2: Admin Product Management (Task 2.0)

**When**: After completing admin interface

**What to Test**:

1. **API Tests** - Use `API_TESTING.md` sections 1-5
2. **Manual Tests** - Use `TESTING_CHECKLIST.md` "Product Management" section

**Quick Validation**:

```bash
# Start dev server
npm run dev

# Test admin product list API
curl http://localhost:3000/api/admin/products

# In browser: Navigate to /app/builder/products
# Follow TESTING_CHECKLIST.md for manual tests
```

**Checklist**:

- [ ] Product list loads
- [ ] Can mark as Setting
- [ ] Can mark as Stone
- [ ] Can edit metadata
- [ ] Can import CSV
- [ ] Can export CSV
- [ ] All validations work

---

### Phase 3: Admin Settings (Task 3.0)

**When**: After completing settings interface

**What to Test**:

1. **API Tests** - Use `API_TESTING.md` sections 6-7
2. **Manual Tests** - Use `TESTING_CHECKLIST.md` "Settings Configuration" section

**Quick Validation**:

```bash
# Test settings API
curl http://localhost:3000/api/admin/settings

# Update settings
curl -X PUT http://localhost:3000/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"markupPercent": 10}'

# In browser: Test all three tabs
```

**Checklist**:

- [ ] Can enable/disable builder
- [ ] Can set markup percentage
- [ ] Can configure side stones
- [ ] All validations work
- [ ] Settings persist

---

### Phase 4: Storefront Steps 1 & 2 (Task 4.0)

**When**: After completing setting and stone selectors

**What to Test**:

1. **API Tests** - Use `API_TESTING.md` sections 8-9
2. **Manual Tests** - Use `TESTING_CHECKLIST.md` "Step 1" and "Step 2" sections

**Quick Validation**:

```bash
# Test settings API
curl "http://localhost:3000/api/builder/settings?style=solitaire"

# Test stones API with filters
curl "http://localhost:3000/api/builder/stones?shape=round&caratMin=1&caratMax=2"

# In browser: Open storefront builder
# Complete Step 1 and Step 2
```

**Checklist**:

- [ ] Settings load and display
- [ ] Filters work correctly
- [ ] Can select setting
- [ ] Stones load and display
- [ ] Advanced filters work
- [ ] Can select stone
- [ ] Price updates in real-time
- [ ] Works on mobile

---

### Phase 5: Storefront Steps 3 & 4 (Task 5.0)

**When**: After completing customization and review

**What to Test**:
Use `TESTING_CHECKLIST.md` "Step 3" and "Step 4" sections

**Quick Validation**:

```bash
# In browser: Complete full flow
# Step 1 → Step 2 → Step 3 → Step 4

# Verify each step
# Verify state persists
# Verify price calculations
```

**Checklist**:

- [ ] Can select ring size
- [ ] Can select side stones (if enabled)
- [ ] Review shows all details
- [ ] Preview displays correctly
- [ ] Price breakdown accurate
- [ ] Edit buttons work

---

### Phase 6: Cart Integration (Task 6.0)

**When**: After completing cart functionality

**What to Test**:

1. **API Tests** - Use `API_TESTING.md` section 10
2. **Manual Tests** - Use `TESTING_CHECKLIST.md` "Add to Cart" section

**Quick Validation**:

```bash
# Test cart API
curl -X POST http://localhost:3000/api/builder/cart \
  -H "Content-Type: application/json" \
  -d '{...full configuration...}'

# Complete full flow in browser
# Verify cart contains item
# Verify line item properties
# Verify database record
```

**Checklist**:

- [ ] Can add to cart
- [ ] Configuration saved to database
- [ ] Line item properties correct
- [ ] Price validated on backend
- [ ] Inventory checked
- [ ] Errors handled gracefully
- [ ] Redirects to cart page

---

### Phase 7: Webhooks (Task 7.0)

**When**: After completing webhook handlers

**What to Test**:
Use `API_TESTING.md` sections 11-12

**Quick Validation**:

```bash
# Trigger product update webhook
shopify webhook trigger --topic products/update

# Check logs
tail -f logs/app.log

# Verify database updated
npx prisma studio

# Trigger product delete
shopify webhook trigger --topic products/delete

# Verify metadata removed
```

**Checklist**:

- [ ] products/update webhook works
- [ ] products/delete webhook works
- [ ] HMAC verification works
- [ ] Idempotency works
- [ ] Errors logged correctly

---

### Phase 8: Final Testing (Task 8.0)

**When**: Before launch

**What to Test**:

1. **Complete** `TESTING_CHECKLIST.md` from start to finish
2. **Run** all commands in `BUILD_VALIDATION.md`
3. **Execute** all tests in `API_TESTING.md`

**Validation Script**:

```bash
# Run master validation script
./scripts/validate-build.sh

# Expected: All checks pass

# Run full feature test
# Follow TESTING_CHECKLIST.md completely

# Run performance tests
# Follow BUILD_VALIDATION.md section 15-17

# Run security audit
# Follow BUILD_VALIDATION.md section 18-19
```

**Final Checklist**:

- [ ] All unit tests pass (`npm test`)
- [ ] All API tests pass (curl commands)
- [ ] All feature tests pass (manual checklist)
- [ ] All browsers tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile tested (iOS Safari, Android Chrome)
- [ ] Performance targets met (< 3s load, < 500ms API)
- [ ] Security audit complete (multi-tenant, HMAC, validation)
- [ ] Build succeeds (`npm run build`)
- [ ] Production server runs (`npm run start`)
- [ ] 3+ beta merchants tested
- [ ] 50+ configurations created
- [ ] Documentation complete

---

## Testing Schedule (12-Week Timeline)

### Week 1-2: Foundation Testing

- [ ] Unit tests for utils (validators, formatters)
- [ ] Unit tests for services (pricing, product, config, cart)
- [ ] Database migration tests

### Week 3-4: Admin Testing

- [ ] API tests for admin endpoints
- [ ] Manual tests for product management
- [ ] CSV import/export tests

### Week 5: Settings Testing

- [ ] API tests for settings endpoints
- [ ] Manual tests for settings form
- [ ] Validation tests

### Week 6-7: Builder Core Testing

- [ ] API tests for builder endpoints
- [ ] Manual tests for Step 1 and 2
- [ ] Filter and sort tests
- [ ] Mobile responsive tests (preliminary)

### Week 8-9: Builder Completion Testing

- [ ] Manual tests for Step 3 and 4
- [ ] Price calculation tests
- [ ] State persistence tests
- [ ] Mobile responsive tests (complete)

### Week 10: Integration Testing

- [ ] Cart integration tests
- [ ] Webhook tests
- [ ] End-to-end flow tests
- [ ] Database tests

### Week 11: Performance & Security Testing

- [ ] Load testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Multi-tenant isolation tests

### Week 12: Final Testing & Launch

- [ ] Beta merchant testing
- [ ] Cross-browser testing (all)
- [ ] Mobile device testing (real devices)
- [ ] Regression testing
- [ ] Final acceptance testing
- [ ] Build validation
- [ ] Production deployment test

---

## Bug Tracking Template

When you find a bug, document it:

```markdown
### Bug #001: [Short Description]

**Severity**: Critical / High / Medium / Low
**Found In**: Step 2 / Admin / API / etc.
**Found By**: Tester name
**Date**: 2025-10-XX

**Steps to Reproduce**:

1. Navigate to Step 2
2. Select filter "Round"
3. Click "Select" on first stone
4. Error appears

**Expected Behavior**:
Stone should be selected and price should update

**Actual Behavior**:
Error message shows, price doesn't update

**Screenshots**:
[Attach screenshot]

**Console Errors**:
```

TypeError: Cannot read property 'price' of undefined
at StoneSelector.tsx:45

```

**Environment**:
- Browser: Chrome 119
- OS: macOS 14
- Screen size: 1920x1080

**Priority**: High (blocks main flow)

**Status**: Open / In Progress / Fixed / Closed

**Fix Notes**:
Added null check before accessing stone.price
Fixed in commit abc123
```

---

## Acceptance Testing (Final Gate)

**Before declaring "MVP Complete"**, verify ALL items:

### Functional Requirements (from PRD)

- [ ] **FR-1**: Multi-step flow (4 steps) ✓
- [ ] **FR-2**: Setting selection with filters ✓
- [ ] **FR-3**: Stone selection with 4Cs filters ✓
- [ ] **FR-4**: Customization (ring size + side stones) ✓
- [ ] **FR-5**: Review & cart ✓
- [ ] **FR-6**: Pricing engine ✓
- [ ] **FR-7**: Admin product management ✓
- [ ] **FR-8**: Admin settings ✓
- [ ] **FR-9**: Order creation ✓
- [ ] **FR-10**: Webhooks ✓
- [ ] **FR-11**: Mobile responsive ✓
- [ ] **FR-12**: Data & security ✓

### Non-Goals Verification

- [ ] **NG-1**: Save & Share NOT implemented ✓
- [ ] **NG-2**: Analytics dashboard NOT implemented ✓
- [ ] **NG-3**: Email notifications NOT implemented ✓
- [ ] **NG-4**: Engraving NOT implemented ✓
- [ ] **NG-5**: Gift options NOT implemented ✓
- [ ] **NG-6**: Customer account NOT implemented ✓
- [ ] **NG-7**: Advanced images NOT implemented ✓
- [ ] **NG-8**: Education content NOT implemented ✓
- [ ] **NG-9**: Comparison features NOT implemented ✓
- [ ] **NG-10**: Advanced search NOT implemented ✓
- [ ] **NG-11**: Multi-language/currency NOT implemented ✓
- [ ] **NG-12**: Third-party integrations NOT implemented ✓
- [ ] **NG-13**: Advanced admin features NOT implemented ✓

### Success Metrics

- [ ] Configuration completion rate trackable ✓
- [ ] Customer satisfaction measurable ✓
- [ ] Time to complete measurable ✓
- [ ] 50+ configurations created ✓
- [ ] 3+ beta merchants tested ✓

---

## Testing Tools & Resources

### Required Tools

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Install curl (usually pre-installed)
which curl

# Install Shopify CLI (for webhooks)
npm install -g @shopify/cli
```

### Helpful Tools

- **Prisma Studio**: `npx prisma studio` - View database
- **Browser DevTools**: Network tab, Console, Performance
- **Postman**: For API testing (alternative to curl)
- **Lighthouse**: For performance audits
- **Real Device Testing**: BrowserStack, Sauce Labs (or physical devices)

---

## Daily Testing Routine (During Development)

### Every Morning

```bash
# Pull latest code
git pull

# Install dependencies (if updated)
npm install

# Run migrations (if new)
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

### After Each Sub-Task

1. Test the specific feature (see task's test instructions)
2. Verify no regressions (quick smoke test)
3. Check console for errors
4. Commit if tests pass

### Before Daily End

```bash
# Run all tests
npm test

# Check TypeScript
npm run typecheck

# Check linter
npm run lint

# Expected: All pass
```

---

## Critical Test Cases (Must Pass)

### 1. Multi-Tenant Isolation (Security)

**Test**: Shop A cannot access Shop B's data

```bash
# See TESTING_CHECKLIST.md "Multi-Tenant Isolation Test"
# This is CRITICAL - must pass before launch
```

**Result**: ✅ PASS / ❌ FAIL

---

### 2. Price Calculation Accuracy (Business Critical)

**Test**: All price calculations are 100% accurate

```bash
# See TESTING_CHECKLIST.md "Price Calculation Testing"
# Test with various configurations
# Verify against manual calculations
```

**Result**: ✅ PASS / ❌ FAIL

---

### 3. Complete Flow (User Experience)

**Test**: Customer can complete entire flow without errors

```bash
# See TESTING_CHECKLIST.md "Complete Builder Workflow Test"
# Step 1 → Step 2 → Step 3 → Step 4 → Cart
```

**Result**: ✅ PASS / ❌ FAIL

---

### 4. Webhook Sync (Data Integrity)

**Test**: Product updates in Shopify sync to app

```bash
# See API_TESTING.md "Webhook Testing"
# Update product → Verify app database updates
```

**Result**: ✅ PASS / ❌ FAIL

---

### 5. Mobile Functionality (Accessibility)

**Test**: All features work on mobile devices

```bash
# See TESTING_CHECKLIST.md "Mobile Responsiveness Testing"
# Test on iOS Safari and Android Chrome
```

**Result**: ✅ PASS / ❌ FAIL

---

## Test Execution Order

### When Starting Testing

**Day 1**: Foundation Tests

1. Run `npx prisma studio` - verify schema
2. Run `npm test` - verify unit tests
3. Test each service individually

**Day 2-3**: Admin API Tests

1. Follow `API_TESTING.md` sections 1-7
2. Test all admin endpoints with curl
3. Document any API issues

**Day 4-5**: Admin UI Tests

1. Follow `TESTING_CHECKLIST.md` admin sections
2. Test all admin features manually
3. Test on Chrome, Firefox, Safari

**Day 6-7**: Builder API Tests

1. Follow `API_TESTING.md` sections 8-9
2. Test filtering extensively
3. Test with large datasets

**Day 8-10**: Builder UI Tests

1. Follow `TESTING_CHECKLIST.md` storefront sections
2. Test all 4 steps
3. Test on desktop and mobile

**Day 11-12**: Integration Tests

1. Follow `API_TESTING.md` section 10 (cart)
2. Test webhooks (sections 11-12)
3. Test complete E2E flows

**Day 13-14**: Performance & Security

1. Follow `BUILD_VALIDATION.md` sections 15-17 (performance)
2. Follow `BUILD_VALIDATION.md` sections 18-19 (security)
3. Run Lighthouse audits

**Day 15-17**: Beta Testing

1. Set up 3 beta merchant stores
2. Have merchants complete full setup
3. Have customers create 10+ configurations each
4. Collect feedback
5. Fix high-priority bugs

**Day 18-19**: Final Validation

1. Run `BUILD_VALIDATION.md` from start to finish
2. Complete `TESTING_CHECKLIST.md` 100%
3. Verify all acceptance criteria
4. Get sign-off

**Day 20**: Production Deployment

1. Follow `BUILD_VALIDATION.md` deployment section
2. Deploy to production
3. Run post-deployment validation
4. Monitor for issues

---

## Bug Severity Levels

**P0 - Critical (Fix Immediately)**:

- App crashes on load
- Data security breach (shop isolation broken)
- Cannot add to cart (main flow blocked)
- Incorrect price calculations
- Payment processing fails

**P1 - High (Fix Before Launch)**:

- Major feature broken
- Error on common user path
- Mobile completely broken
- API endpoint failures
- Data loss issues

**P2 - Medium (Fix If Time Allows)**:

- Minor feature broken
- Edge case failures
- UI glitches (non-blocking)
- Slow performance (not timeout)

**P3 - Low (Post-Launch)**:

- Nice-to-have improvements
- Minor UI polish
- Optional feature enhancements

---

## Test Data Setup

### Create Test Products in Shopify

```bash
# Create 5 setting products
# - Styles: Solitaire, Halo, Three-Stone, Vintage, Modern
# - Each with 4 variants (metal types)
# - Price range: $800 - $3000

# Create 20 stone products
# - Shapes: Round (10), Princess (5), Cushion (5)
# - Carat range: 0.5 - 3.0
# - Various 4Cs
# - Price range: $2000 - $20000
# - Mix of GIA and AGS certificates
```

### Sample CSV for Bulk Import

See `tests/sample-stones.csv` in project

---

## Test Reporting

### Daily Test Report Template

```markdown
## Test Report - [Date]

**Tester**: [Name]
**Phase**: [Task X.0]
**Duration**: [Hours]

### Tests Executed

- [ ] API tests (sections X-Y)
- [ ] Manual tests (feature Z)
- [ ] Mobile tests

### Results

- **Passed**: 45/50 tests
- **Failed**: 5/50 tests
- **Blocked**: 0 tests

### Bugs Found

- Bug #001: [Description] - Severity: High
- Bug #002: [Description] - Severity: Medium

### Notes

- Performance excellent on desktop
- Mobile needs optimization
- API response times good

### Next Steps

- Fix Bug #001 (high priority)
- Continue with next task
```

---

## Automated Testing (If Time Permits)

### Unit Tests with Jest

```bash
# Run all unit tests
npm test

# Run specific test file
npm test tests/services/pricing.test.ts

# Run with coverage
npm test -- --coverage

# Expected coverage: >80%
```

### Integration Tests

```bash
# Create integration test suite
# Test API routes with supertest

npm install --save-dev supertest @types/supertest

# Run integration tests
npm test tests/integration/
```

### E2E Tests (Advanced)

```bash
# Install Playwright or Cypress
npm install --save-dev @playwright/test

# Create E2E test for complete flow
# Test: Open builder → configure ring → add to cart

npx playwright test

# Expected: Full flow completes successfully
```

---

## Pre-Launch Final Validation

### The Final 48 Hours

**48 Hours Before Launch**:

1. Code freeze (no new features)
2. Run complete test suite
3. Fix only critical bugs (P0/P1)

**24 Hours Before Launch**:

1. Final build validation
2. Deploy to staging (if available)
3. Complete smoke test on staging
4. Get stakeholder approval

**Launch Day**:

1. Deploy to production
2. Run post-deployment validation
3. Monitor for 4 hours continuously
4. Be ready to rollback if needed

---

## Success Criteria

**MVP is ready to launch when**:

✅ All 85 sub-tasks completed  
✅ All FR-1 through FR-12 implemented  
✅ All tests passed (API, Feature, Performance, Security)  
✅ All 3 testing documents fully executed  
✅ 0 P0 bugs, 0 P1 bugs  
✅ 3+ beta merchants successfully tested  
✅ 50+ configurations created  
✅ Build validation script passes  
✅ Documentation complete  
✅ Stakeholder sign-off obtained

---

## Quick Reference

| Document               | When to Use                       | Time Required               |
| ---------------------- | --------------------------------- | --------------------------- |
| `API_TESTING.md`       | After completing any API endpoint | 15-30 min per endpoint      |
| `TESTING_CHECKLIST.md` | After completing any UI feature   | 1-2 hours per major feature |
| `BUILD_VALIDATION.md`  | Before any deployment             | 2-3 hours                   |
| This guide             | Throughout development            | Reference as needed         |

---

## Emergency Testing (If Behind Schedule)

**Minimum tests that MUST pass**:

1. ✅ Admin can mark products and add metadata
2. ✅ Customer can select setting and stone
3. ✅ Customer can add to cart
4. ✅ Configuration appears in Shopify cart correctly
5. ✅ Price calculation is accurate
6. ✅ Multi-tenant isolation works
7. ✅ No critical security issues
8. ✅ Build succeeds

**Everything else** is secondary to these 8 critical tests.

---

## Contact & Support

**If Tests Fail**:

1. Document the failure (see Bug Tracking Template)
2. Check existing documentation for solutions
3. Review code against PRD requirements
4. Consult RING_BUILDER_RESEARCH.md for technical details
5. Debug with browser DevTools
6. Check server logs

**Common Issues**:

- See `README.md` "Gotchas / Troubleshooting" section
- See `RING_BUILDER_RESEARCH.md` "Technical Challenges & Solutions"

---

**Testing Status Tracker**

```
Phase 1 (Foundation): [ ] Not Started [ ] In Progress [ ] Complete
Phase 2 (Admin PM):   [ ] Not Started [ ] In Progress [ ] Complete
Phase 3 (Settings):   [ ] Not Started [ ] In Progress [ ] Complete
Phase 4 (Builder 1-2): [ ] Not Started [ ] In Progress [ ] Complete
Phase 5 (Builder 3-4): [ ] Not Started [ ] In Progress [ ] Complete
Phase 6 (Cart):       [ ] Not Started [ ] In Progress [ ] Complete
Phase 7 (Webhooks):   [ ] Not Started [ ] In Progress [ ] Complete
Phase 8 (Final):      [ ] Not Started [ ] In Progress [ ] Complete
```

**Overall Testing Progress**: \_\_\_\_%

**Launch Readiness**: [ ] Not Ready [ ] Ready with Conditions [ ] Ready to Launch

---

**End of Master Testing Guide**

**Remember**: Testing is not optional. Every feature must be validated!
