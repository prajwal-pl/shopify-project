# Task Validation - Quick Guide

**After completing any task → Validate before proceeding**

---

## Universal Validation (All Tasks)

```bash
npm run typecheck && npm run lint && npm run build
```

✅ All must pass before next task

---

## Validation by Task Type

### Database (Tasks 1.6-1.10)

```bash
npx prisma migrate dev
npx prisma studio  # Check table exists
npm run typecheck  # Verify types
```

### Service (Tasks 1.14-1.17)

```bash
npm test tests/services/[name].test.ts
```

### API Route (Tasks 2.x, 3.x, 4.x, 6.x)

```bash
npm run dev
curl [METHOD] http://localhost:3000/[path]
npx prisma studio  # If modifies DB
```

### Component (Tasks 2.x, 4.x, 5.x)

```bash
npm run dev
# Open in browser → Check console → Test feature
```

### Webhook (Tasks 7.x)

```bash
shopify webhook trigger --topic [topic]
npx prisma studio  # Verify data updated
```

---

## Curl Commands Reference

```bash
export BASE_URL="http://localhost:3000"
export TOKEN="your_token"

# Admin - List products (2.2)
curl "$BASE_URL/api/admin/products" -H "Authorization: Bearer $TOKEN"

# Admin - Mark product (2.3)
curl -X POST "$BASE_URL/api/admin/products/[ID]/mark" \
  -H "Authorization: Bearer $TOKEN" -d '{"type":"setting"}'

# Admin - Settings (3.1)
curl "$BASE_URL/api/admin/settings" -H "Authorization: Bearer $TOKEN"

# Builder - Settings (4.1)
curl "$BASE_URL/api/builder/settings"

# Builder - Stones (4.2)
curl "$BASE_URL/api/builder/stones?shape=round&caratMin=1&caratMax=2"

# Builder - Cart (6.1)
curl -X POST "$BASE_URL/api/builder/cart" -d '{
  "settingId":"gid://shopify/Product/123",
  "stoneId":"gid://shopify/Product/456",
  "metalType":"14k_white_gold",
  "ringSize":"7"
}'

# Webhooks (7.2, 7.3)
shopify webhook trigger --topic products/update
```

---

## AI Validation Prompt

```
Task [X.Y] complete - [Name]

Validate:
[Paste curl command OR manual steps]

Expected: [What should happen]

Files: [list changed files]

Confirm: ✅ Works ✅ No errors ✅ No regressions
```

---

## Phase Quick Checks

```bash
# Phase 1: npm test && npm run typecheck
# Phase 2: curl "$BASE_URL/api/admin/products" -H "Authorization: Bearer $TOKEN"
# Phase 3: curl "$BASE_URL/api/admin/settings" -H "Authorization: Bearer $TOKEN"
# Phase 4: curl "$BASE_URL/api/builder/settings"
# Phase 6: curl -X POST "$BASE_URL/api/builder/cart" -d '{...}'
# Phase 7: shopify webhook trigger --topic products/update
# Phase 8: npm run build && npm run typecheck && npm run lint
```

---

## Every Task Checklist

```
✅ npm run typecheck (no errors)
✅ npm run lint (no errors)
✅ Feature works (curl/browser test)
✅ No console errors
✅ No regressions
```

**All ✅ → Move to next task**

---

**Full details**: See `docs/API_TESTING.md` and `docs/TESTING_CHECKLIST.md`
