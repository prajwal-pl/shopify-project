# Demo Day Checklist
## Print this and check off during preparation

---

## ⏰ 1 Hour Before Demo

### Environment Check
- [ ] Dev server is running (`shopify app dev`)
- [ ] No errors in terminal
- [ ] Database is connected
- [ ] Prisma client generated (`npx prisma generate`)

### Browser Preparation
- [ ] Chrome/Firefox updated to latest
- [ ] Clear browser cache
- [ ] Close unnecessary tabs
- [ ] Disable browser extensions (ad blockers, etc.)
- [ ] Set zoom to 100%
- [ ] Turn off notifications

### Stores Check
- [ ] Store A (Luxury Jewelers) installed and working
- [ ] Store B (Modern Rings) installed and working
- [ ] Both have different themes applied
- [ ] Test both builders load correctly

### URLs Bookmarked
- [ ] Store A builder: `localhost:PORT/builder?shop=luxury-jewelers-demo...`
- [ ] Store B builder: `localhost:PORT/builder?shop=modern-rings-demo...`
- [ ] Store A admin
- [ ] Store B admin
- [ ] Embed code generator: `/app/builder/embed`

---

## ⏰ 30 Minutes Before Demo

### Quick Test Run
- [ ] Open Store A builder → Verify purple theme
- [ ] Open Store B builder → Verify teal theme
- [ ] Open settings page → Change a color → Verify it updates
- [ ] Open embed page → Verify code generator loads

### Screen Sharing Setup
- [ ] Test screen sharing (if virtual)
- [ ] Audio check (if virtual)
- [ ] Screen sharing shows entire browser window
- [ ] Terminal visible if needed

### Backup Plans
- [ ] Screenshots of working demos ready
- [ ] Screen recording ready as backup
- [ ] Alternative browser ready (Safari/Edge)

---

## ⏰ 5 Minutes Before Demo

### Final Checks
- [ ] All demo tabs open
- [ ] Correct tab order for presentation
- [ ] Terminal ready (hidden or visible as needed)
- [ ] Close Slack/email/chat
- [ ] Put phone on silent
- [ ] Water nearby
- [ ] Demo notes visible

### Tab Order
```
Tab 1: Store A Builder (Purple)
Tab 2: Store B Builder (Teal)
Tab 3: Settings Page
Tab 4: Embed Code Generator
Tab 5: External HTML Demo (if created)
Tab 6: Documentation (this checklist)
```

---

## 🎬 During Demo

### Opening (1 min)
- [ ] Introduce yourself
- [ ] State demo objective
- [ ] Set expectations for time

### Visual Comparison (2 min)
- [ ] Show Store A (Purple theme)
- [ ] Show Store B (Teal theme)
- [ ] Highlight the differences
- [ ] Emphasize "same app, different brands"

### Settings Control (2 min)
- [ ] Open settings page
- [ ] Show color pickers
- [ ] Show live preview
- [ ] Make a change
- [ ] Save and reload
- [ ] Show change applied

### Embed Functionality (3 min)
- [ ] Show embed code generator
- [ ] Copy embed code
- [ ] Show it in HTML file (if prepared)
- [ ] Demonstrate it works outside Shopify

### Q&A (remaining time)
- [ ] Answer questions
- [ ] Show additional features if time
- [ ] Thank audience

---

## ✅ Success Indicators

Demo is successful if you showed:

- [ ] ✅ Two stores with visibly different themes
- [ ] ✅ Theme customization working
- [ ] ✅ Changes saving and persisting
- [ ] ✅ Embedding functionality working
- [ ] ✅ Multi-tenancy architecture clear
- [ ] ✅ No errors or crashes during demo

---

## 🚨 Emergency Procedures

### If dev server crashes:
1. Check terminal for errors
2. Restart: `shopify app dev`
3. While waiting, show screenshots
4. Resume when back up

### If theme not showing:
1. Check browser console
2. Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Show database query as backup
4. Explain it's a caching issue

### If can't access store:
1. Switch to other store
2. Continue with available store
3. Show screenshots of unavailable store

### If internet drops:
1. Show pre-recorded video
2. Show screenshots
3. Walk through architecture on whiteboard

---

## 📝 Post-Demo Checklist

### Immediate Follow-Up (within 1 hour)
- [ ] Send thank you email
- [ ] Share demo recording link
- [ ] Send documentation links
- [ ] Answer any pending questions

### Resources to Share
- [ ] Link to testing guide
- [ ] Link to GitHub repo
- [ ] Screenshots from demo
- [ ] Contact information

### Internal Debrief
- [ ] What went well?
- [ ] What could be improved?
- [ ] Technical issues encountered?
- [ ] Questions couldn't answer?
- [ ] Follow-up items?

---

## 🎯 Key Talking Points

### Simple Version (Non-Technical)
✅ "Multiple jewelry stores can use this app"
✅ "Each gets their own colors and branding"
✅ "Works in Shopify and on any website"
✅ "Setup takes 5 minutes"

### Technical Version
✅ "Multi-tenant SaaS architecture"
✅ "PostgreSQL with shop-level data isolation"
✅ "Dynamic CSS theming with variables"
✅ "CORS-enabled iframe embedding"
✅ "Built on Shopify Remix stack"

### When asked about products:
✅ "Currently using demo catalog for presentation"
✅ "Production will use each merchant's Shopify products"
✅ "Database architecture already supports this"
✅ "Next phase of development"

---

## 📞 Contact Information

**If demo fails catastrophically:**
- Backup presenter: _________________
- Tech support: _________________
- Shopify Partners support: partners@shopify.com

**Demo URLs:**
- Store A: luxury-jewelers-demo.myshopify.com
- Store B: modern-rings-demo.myshopify.com
- Dev server: http://localhost:____

---

## 🎉 Confidence Boosters

You've got this! Remember:

✅ You know this app inside and out
✅ You've tested everything beforehand
✅ Demos rarely go perfectly - that's OK
✅ Audience wants you to succeed
✅ Focus on the value, not perfection
✅ Technical hiccups are opportunities to explain
✅ You're showing something genuinely cool!

---

**Good luck! 🚀**

*Print this checklist and have it beside you during the demo.*
