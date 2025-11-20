/**
 * Theme Provider Component
 *
 * Applies theme customization to Ring Builder UI
 * - Sets CSS variables for colors, fonts, spacing
 * - Applies dark mode class if enabled
 * - Injects custom CSS if provided
 */

import { useEffect } from "react";
import type { ThemeConfig } from "~/services/theme.server";

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply CSS variables to document root
    const root = document.documentElement;

    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--accent-color", theme.accentColor);
    root.style.setProperty("--background-color", theme.backgroundColor);
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--border-radius", `${theme.borderRadius}px`);
    root.style.setProperty("--font-family", theme.fontFamily);

    // Set button border radius based on style
    const borderRadiusValue = {
      rounded: `${theme.borderRadius}px`,
      square: "0px",
      pill: "999px",
    }[theme.buttonStyle];

    root.style.setProperty("--button-border-radius", borderRadiusValue);

    // Apply dark mode class
    if (theme.darkMode) {
      root.classList.add("dark-mode");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark-mode");
      root.removeAttribute("data-theme");
    }

    // Inject custom CSS if provided
    if (theme.customCSS) {
      const styleId = "custom-theme-css";
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;

      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      styleElement.textContent = theme.customCSS;

      return () => {
        styleElement?.remove();
      };
    }
  }, [theme]);

  return <>{children}</>;
}

/**
 * Hook to get current theme from context (if needed)
 * For now, theme is passed down as props
 */
export function useTheme() {
  // Get CSS variables from document root
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    primaryColor: computedStyle.getPropertyValue("--primary-color").trim(),
    accentColor: computedStyle.getPropertyValue("--accent-color").trim(),
    backgroundColor: computedStyle.getPropertyValue("--background-color").trim(),
    textColor: computedStyle.getPropertyValue("--text-color").trim(),
    borderRadius: computedStyle.getPropertyValue("--border-radius").trim(),
    fontFamily: computedStyle.getPropertyValue("--font-family").trim(),
  };
}
