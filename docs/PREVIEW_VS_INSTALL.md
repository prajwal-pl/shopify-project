# Preview URL vs Installation URL - Critical Differences

## The Problem You Experienced

When you pressed `p` (Preview), you accessed the **Development Preview Mode**, not the **OAuth Installation Flow**.

---

## Two Different Modes in `shopify app dev`

### Mode 1: Preview (p) - Development UI Testing

**What it does:**
- Opens app UI directly
- **Bypasses OAuth completely**
- No installation happens
- No merchant record created
- For testing UI/UX changes quickly

**When to use:**
- Testing UI changes
- Debugging frontend code
- Quick visual checks
- **NOT for testing installation flow**

**What happens:**
```
Press 'p' → Browser opens app URL → App loads →
NO OAuth → NO merchant → NO data → Empty screens
```

**URL format:**
```
https://admin.shopify.com/store/STORE/apps/gem-finder-1/app
```

---

### Mode 2: Installation - Real OAuth Flow

**What it does:**
- Shows OAuth permission screen
- User clicks "Install app"
- Creates merchant in database
- Starts onboarding
- **This is how real clients will install**

**When to use:**
- Testing installation flow
- Testing onboarding
- Testing multi-merchant setup
- **Simulating real client experience**

**What happens:**
```
Visit install URL → OAuth screen → Click "Install" →
auth/callback → Create merchant → Redirect to onboarding →
Complete onboarding → App works with data
```

**URL formats:**
```
Method 1: https://admin.shopify.com/?organization_id=187914129&redirect=/oauth/redirect_from_developer_dashboard?client_id=919488cf655c3aa5d74db87c9faaec6a

Method 2: https://admin.shopify.com/store/STORE/apps/gem-finder-1 (then click install)

Method 3: https://admin.shopify.com/oauth/redirect_from_cli?client_id=919488cf655c3aa5d74db87c9faaec6a&store=STORE
```

---

## Visual Comparison

### Preview Mode (p) - What You Saw

```
┌─────────────────────────────────────┐
│ Browser                             │
│ ┌─────────────────────────────────┐ │
│ │ Ring Builder - Admin Dashboard  │ │
│ │                                 │ │
│ │ Welcome to Ring Builder!        │ │
│ │                                 │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Quick Actions               │ │ │
│ │ │                             │ │ │
│ │ │ 1. Manage Products          │ │ │
│ │ │ 2. Configure Builder        │ │ │
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │ Product Management:             │ │
│ │ Under Reconstruction           │ │  ← Empty!
│ │                                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Database: No merchant record
Onboarding: Not started
Theme: Default (no customization)
```

### Installation Mode - What SHOULD Happen

**Step 1: OAuth Screen**
```
┌─────────────────────────────────────┐
│ Shopify OAuth                       │
│ ┌─────────────────────────────────┐ │
│ │ 📦 Install app                  │ │
│ │                                 │ │
│ │ gem finder                      │ │
│ │ Prajwal PL                      │ │
│ │                                 │ │
│ │ This app needs access to:       │ │
│ │                                 │ │
│ │ ✓ View personal data            │ │
│ │   - Customers (name, email)     │ │
│ │                                 │ │
│ │ ✓ View and edit store data      │ │
│ │   - Edit customers              │ │
│ │   - Edit products               │ │
│ │   - Edit orders                 │ │
│ │                                 │ │
│ │ [Cancel]  [Install app] ← Click this
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Step 2: Onboarding (After Install)**
```
┌─────────────────────────────────────┐
│ Ring Builder - Onboarding           │
│ ┌─────────────────────────────────┐ │
│ │ 💍 Welcome to Ring Builder!     │ │
│ │                                 │ │
│ │ Let's get you set up in 5       │ │
│ │ minutes!                        │ │
│ │                                 │ │
│ │ We'll help you:                 │ │
│ │ • Create your builder page      │ │
│ │ • Customize your theme          │ │
│ │ • Add to your navigation        │ │
│ │                                 │ │
│ │        [Get Started] ← Click    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Database: ✅ Merchant created
Onboarding: ✅ Started
Theme: Ready for customization
```

---

## Why You Saw Empty Screens

### Root Cause
You used **Preview Mode (p)** which:
1. Skipped OAuth
2. Didn't create merchant record
3. App tried to load data for non-existent merchant
4. Result: "Product Management - Under Reconstruction"

### Database State
```bash
# What you have now:
Merchants: 0
AppSettings: 0
No onboarding data
```

### What App Expected
```bash
# What app needs:
Merchants: 1+ (with shop domain)
AppSettings: 1+ (linked to merchant)
Onboarding: Started or completed
```

---

## The Fix: Proper Installation

### Option 1: Use Installation URL from Terminal

**Look at your terminal where `shopify app dev` is running.**

You should see something like:
```
╭─ info ────────────────────────────────────────╮
│  Next steps                                   │
│    1. Install your app in your development    │
│       store [1]                               │
╰───────────────────────────────────────────────╯
[1] https://admin.shopify.com/?organization_id=...
```

**Copy and visit URL [1]** - that's the installation URL.

---

### Option 2: Use Generated URLs

Run this to see all installation URLs:
```bash
node scripts/test-installation-url.mjs
```

Copy any of the URLs shown and visit in browser.

---

### Option 3: Reinstall Command

```bash
# Stop dev server
Ctrl+C

# Start fresh and follow prompts
shopify app dev --reset

# When it asks "Install app?", say YES
# Do NOT press 'p' for preview
```

---

## Step-by-Step: Proper Installation Flow

### 1. Visit Installation URL

Use any URL from `node scripts/test-installation-url.mjs`

### 2. OAuth Screen Appears

You should see:
- App name: "gem finder"
- List of permissions
- Two buttons: "Cancel" and "Install app"

### 3. Click "Install app"

Browser redirects through:
```
Shopify OAuth → Your app's auth callback →
Database: Creates merchant →
Redirects to: /app/onboarding
```

### 4. Complete Onboarding

**Step 1: Welcome**
- Introduction
- Click "Get Started"

**Step 2: Create Page**
- App creates Shopify page automatically
- Click "Continue"

**Step 3: Add to Menu**
- App adds to navigation
- Click "Continue"

**Step 4: Customize Theme** ⭐
- Set colors (purple/gold or your choice)
- Set fonts
- Add custom CSS
- **Click "Save Theme"** ← Important!

**Step 5: Test Builder**
- Preview with your theme
- Click "Continue"

**Step 6: Complete!**
- Click "Go to Dashboard"

### 5. Verify Installation

```bash
# Check database has merchant
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.merchant.findMany()
.then(m => console.log('Merchants:', m.length, m.map(x => x.shop)))
.finally(() => prisma.\$disconnect());
"

# Expected output:
# Merchants: 1 [ 'demo-store-123456789552125478794.myshopify.com' ]
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Using Preview URL
```
Press 'p' → Opens app → No OAuth → No data → WRONG
```

### ✅ Correct: Use Installation URL
```
Visit install URL → OAuth → Install → Onboarding → RIGHT
```

---

### ❌ Mistake 2: Expecting Preview to Work
```
"Why is the app empty?"
→ Because preview mode has no merchant data!
```

### ✅ Correct: Complete Installation First
```
Install via OAuth → Onboarding → Then app has data
```

---

### ❌ Mistake 3: Skipping Onboarding
```
Install → Cancel onboarding → App shows but incomplete
```

### ✅ Correct: Complete All 6 Steps
```
Install → Complete onboarding → Theme saved → App fully functional
```

---

## Current State vs Expected State

### Your Current State (After Preview)
```
✅ Dev server running
✅ App code deployed locally
❌ No merchant in database
❌ No OAuth completed
❌ No onboarding started
❌ No theme configured
❌ App shows empty screens
```

### Expected State (After Proper Install)
```
✅ Dev server running
✅ App code deployed locally
✅ Merchant in database
✅ OAuth completed
✅ Onboarding completed (6/6 steps)
✅ Theme configured (purple/gold or custom)
✅ App shows functional ring builder
```

---

## Next Steps for You

### Step 1: Get Installation URL
```bash
node scripts/test-installation-url.mjs
```

### Step 2: Open URL in Browser
Copy any of the 3 URLs shown

### Step 3: Complete OAuth
Click "Install app" when you see permission screen

### Step 4: Complete Onboarding
Follow all 6 steps, especially theme customization

### Step 5: Verify
```bash
# Check merchant exists
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.merchant.findMany()
.then(m => console.log(m))
.finally(() => prisma.\$disconnect());
"
```

---

## Summary

**What you did:** Pressed `p` (Preview mode)
**What happened:** App opened without OAuth
**Why empty:** No merchant data in database
**What to do:** Use installation URL instead
**Expected result:** OAuth → Onboarding → Functional app with theme

---

## Quick Reference

| Action | Mode | OAuth? | Creates Merchant? | Use For |
|--------|------|--------|-------------------|---------|
| Press `p` | Preview | ❌ No | ❌ No | UI testing only |
| Install URL | OAuth | ✅ Yes | ✅ Yes | Real installation |
| `--reset` | Fresh | ✅ Yes | ✅ Yes | Clean install |

**For multi-merchant testing:** Use Installation mode, not Preview mode!

---

**Ready? Run: `node scripts/test-installation-url.mjs` and use one of those URLs!**
