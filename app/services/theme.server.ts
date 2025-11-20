/**
 * Theme Service
 *
 * Manages theme customization for Ring Builder
 * - Load merchant theme settings
 * - Apply theme to UI via CSS variables
 * - Generate theme CSS for embedding
 */

import prisma from "~/db.server";

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  fontFamily: string;
  buttonStyle: "rounded" | "square" | "pill";
  darkMode: boolean;
  customCSS?: string;
}

/**
 * Get theme configuration for a shop
 */
export async function getThemeForShop(shop: string): Promise<ThemeConfig> {
  const settings = await prisma.appSettings.findUnique({
    where: { shop },
    select: {
      primaryColor: true,
      accentColor: true,
      backgroundColor: true,
      textColor: true,
      borderRadius: true,
      fontFamily: true,
      buttonStyle: true,
      darkMode: true,
      customCSS: true,
    },
  });

  if (!settings) {
    return getDefaultTheme();
  }

  return {
    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
    backgroundColor: settings.backgroundColor,
    textColor: settings.textColor,
    borderRadius: settings.borderRadius,
    fontFamily: settings.fontFamily,
    buttonStyle: settings.buttonStyle as "rounded" | "square" | "pill",
    darkMode: settings.darkMode,
    customCSS: settings.customCSS || undefined,
  };
}

/**
 * Get default theme configuration
 */
export function getDefaultTheme(): ThemeConfig {
  return {
    primaryColor: "#6B2C3E",
    accentColor: "#D4AF37",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    borderRadius: 8,
    fontFamily: "system-ui",
    buttonStyle: "rounded",
    darkMode: false,
  };
}

/**
 * Generate CSS variables from theme config
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  const borderRadiusValue = {
    rounded: `${theme.borderRadius}px`,
    square: "0px",
    pill: "999px",
  }[theme.buttonStyle];

  return `
    :root {
      --primary-color: ${theme.primaryColor};
      --accent-color: ${theme.accentColor};
      --background-color: ${theme.backgroundColor};
      --text-color: ${theme.textColor};
      --border-radius: ${theme.borderRadius}px;
      --button-border-radius: ${borderRadiusValue};
      --font-family: ${theme.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    ${theme.darkMode ? `
    .dark-mode,
    [data-theme="dark"] {
      --background-color: #1a1a1a;
      --text-color: #ffffff;
      --primary-color: ${adjustColorBrightness(theme.primaryColor, 20)};
      --accent-color: ${theme.accentColor};
    }
    ` : ""}

    ${theme.customCSS || ""}
  `.trim();
}

/**
 * Apply theme to HTML document (for SSR)
 */
export function generateThemeStyleTag(theme: ThemeConfig): string {
  const css = generateThemeCSS(theme);
  return `<style id="ring-builder-theme">${css}</style>`;
}

/**
 * Helper: Adjust color brightness
 */
function adjustColorBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust brightness
  const adjustedR = Math.min(255, Math.max(0, r + (r * percent) / 100));
  const adjustedG = Math.min(255, Math.max(0, g + (g * percent) / 100));
  const adjustedB = Math.min(255, Math.max(0, b + (b * percent) / 100));

  // Convert back to hex
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
}

/**
 * Update theme settings for a shop
 */
export async function updateTheme(
  shop: string,
  theme: Partial<ThemeConfig>
): Promise<void> {
  await prisma.appSettings.upsert({
    where: { shop },
    create: {
      shop,
      builderEnabled: true,
      markupPercent: 0,
      ...theme,
    },
    update: theme,
  });
}

/**
 * Get theme for tenant (by merchant ID)
 * Used for public embeds
 */
export async function getThemeForTenant(tenantId: string): Promise<ThemeConfig> {
  const merchant = await prisma.merchant.findUnique({
    where: { id: tenantId },
    select: { shop: true },
  });

  if (!merchant) {
    return getDefaultTheme();
  }

  return getThemeForShop(merchant.shop);
}
