# How to Create App Block Extension

**For:** Phase 3.0 Theme Integration  
**Date:** October 14, 2025  
**Status:** To be created via Shopify CLI

---

## 🎯 WHAT IS AN APP BLOCK?

App blocks allow merchants to add your Ring Builder to any page using drag-and-drop in the theme editor - no code required!

**Required for:** Shopify 2.0 themes (Online Store 2.0)

---

## 📋 CREATION STEPS

### Step 1: Generate Extension via Shopify CLI

```bash
# Navigate to your app directory
cd /path/to/ring-builder

# Generate theme app extension
shopify app generate extension

# When prompted:
# - Extension type: "Theme app extension"
# - Extension name: "Ring Builder"
```

**This will create:** `extensions/ring-builder-extension/` folder

---

### Step 2: Configure the Extension

The CLI will create a basic structure. Update it to:

**File:** `extensions/ring-builder-extension/blocks/app-block.liquid`

```liquid
{% comment %}
  Ring Builder App Block

  Allows merchants to add Ring Builder to any page via drag-and-drop.
{% endcomment %}

<div class="ring-builder-block" style="padding: 40px 20px; text-align: center;">
  {% if block.settings.heading %}
    <h2 style="font-size: 32px; margin-bottom: 10px; color: {{ block.settings.primary_color }};">
      {{ block.settings.heading }}
    </h2>
  {% endif %}

  {% if block.settings.subheading %}
    <p style="font-size: 18px; color: #666; margin-bottom: 30px;">
      {{ block.settings.subheading }}
    </p>
  {% endif %}

  <a
    href="/apps/ring-builder?shop={{ shop.permanent_domain }}"
    style="
      display: inline-block;
      background-color: {{ block.settings.button_color }};
      color: white;
      padding: 15px 40px;
      font-size: 18px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    "
  >
    {{ block.settings.button_text }}
  </a>
</div>

{% schema %}
{
  "name": "Ring Builder",
  "target": "section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Design Your Dream Ring"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subheading",
      "default": "Create a custom ring in 3 easy steps"
    },
    {
      "type": "color",
      "id": "primary_color",
      "label": "Primary Color",
      "default": "#6B2C3E"
    },
    {
      "type": "color",
      "id": "button_color",
      "label": "Button Color",
      "default": "#6B2C3E"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Start Designing"
    }
  ],
  "presets": [
    {
      "name": "Ring Builder"
    }
  ]
}
{% endschema %}
```

---

### Step 3: Deploy Extension

```bash
# Deploy the extension
shopify app deploy

# Test on development store
shopify app dev
```

---

## 📝 ALTERNATIVE: Use Existing Ring Builder Theme Extension

**You already have:** `extensions/ring-builder-theme/`

This extension can be used for now. The new app block can be added later when needed.

---

## ⏰ WHEN TO CREATE

**Options:**

**Option A: Create Now**

- Run `shopify app generate extension`
- Configure as shown above
- Test on development store

**Option B: Create Later (Recommended)**

- App works without app block initially
- Create after App Store approval
- Add in Phase 3.2 (Epic 2)

**Recommendation:** Option B - Focus on core app launch first, add app block in Sprint 3 or post-launch.

---

## ✅ FOR NOW

**App is functional without app block!**

Merchants can still:

- Install the app
- Use the admin dashboard
- Add products
- Customers can access via direct URL: `/apps/ring-builder?shop=store.myshopify.com`

**App block adds:** Convenient drag-and-drop installation in theme editor (nice-to-have, not critical).

---

**Status:** Optional for initial launch  
**Priority:** Medium (add in Sprint 3 or post-launch)  
**Effort:** 1-2 hours once ready

**Document Version:** 1.0  
**Created:** October 14, 2025
