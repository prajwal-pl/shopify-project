/**
 * Onboarding Service
 *
 * Manages merchant onboarding flow for Ring Builder app
 * Tracks progress through 6-step setup process
 */

import prisma from "~/db.server";
import { authenticate } from "~/shopify.server";
import {
  createBuilderPage,
  addPageToMenu,
  checkBuilderPageExists,
} from "./shopify-pages.server";

type AdminApiContext = Awaited<ReturnType<typeof authenticate.admin>>["admin"];

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  steps: {
    welcome: boolean;
    pageCreated: boolean;
    menuAdded: boolean;
    themeConfigured: boolean;
    tested: boolean;
  };
  builderPageId?: string;
  builderPageHandle?: string;
  builderPageUrl?: string;
  menuHandle?: string;
  lastUpdated: string;
}

/**
 * Get onboarding state for a merchant
 */
export async function getOnboardingState(shop: string): Promise<OnboardingState> {
  const merchant = await prisma.merchant.findUnique({
    where: { shop },
    select: { settings: true },
  });

  if (!merchant?.settings) {
    return getDefaultOnboardingState();
  }

  try {
    const settings = JSON.parse(merchant.settings);
    return settings.onboarding || getDefaultOnboardingState();
  } catch (e) {
    return getDefaultOnboardingState();
  }
}

/**
 * Default onboarding state
 */
function getDefaultOnboardingState(): OnboardingState {
  return {
    completed: false,
    currentStep: 1,
    steps: {
      welcome: false,
      pageCreated: false,
      menuAdded: false,
      themeConfigured: false,
      tested: false,
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Update onboarding state
 */
export async function updateOnboardingState(
  shop: string,
  updates: Partial<OnboardingState>
): Promise<void> {
  const merchant = await prisma.merchant.findUnique({
    where: { shop },
    select: { settings: true },
  });

  let settings = {};

  if (merchant?.settings) {
    try {
      settings = JSON.parse(merchant.settings);
    } catch (e) {
      settings = {};
    }
  }

  const currentOnboarding = (settings as any).onboarding || getDefaultOnboardingState();

  const updatedOnboarding = {
    ...currentOnboarding,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  const updatedSettings = {
    ...settings,
    onboarding: updatedOnboarding,
  };

  await prisma.merchant.update({
    where: { shop },
    data: {
      settings: JSON.stringify(updatedSettings),
    },
  });
}

/**
 * Complete a specific onboarding step
 */
export async function completeStep(
  shop: string,
  step: keyof OnboardingState["steps"]
): Promise<void> {
  const state = await getOnboardingState(shop);

  const updatedSteps = {
    ...state.steps,
    [step]: true,
  };

  const allStepsComplete = Object.values(updatedSteps).every((s) => s === true);

  await updateOnboardingState(shop, {
    steps: updatedSteps,
    completed: allStepsComplete,
    currentStep: allStepsComplete ? 6 : state.currentStep + 1,
  });
}

/**
 * Create Ring Builder page during onboarding
 */
export async function createBuilderPageForOnboarding(
  admin: AdminApiContext,
  shop: string,
  options?: {
    title?: string;
    handle?: string;
  }
): Promise<{
  success: boolean;
  pageId?: string;
  pageHandle?: string;
  pageUrl?: string;
  error?: string;
}> {
  const exists = await checkBuilderPageExists(admin, options?.handle);

  if (exists) {
    return {
      success: false,
      error: "Page already exists with this handle",
    };
  }

  const result = await createBuilderPage(admin, {
    title: options?.title || "Design Your Ring",
    handle: options?.handle || "design-your-ring",
    shop,
  });

  if (result.success) {
    await updateOnboardingState(shop, {
      builderPageId: result.pageId,
      builderPageHandle: result.pageHandle,
      builderPageUrl: result.pageUrl,
    });

    await completeStep(shop, "pageCreated");
  }

  return result;
}

/**
 * Add Ring Builder page to menu during onboarding
 */
export async function addBuilderPageToMenu(
  admin: AdminApiContext,
  shop: string,
  options?: {
    menuHandle?: string;
    pageHandle?: string;
    pageTitle?: string;
  }
): Promise<{
  success: boolean;
  menuItemId?: string;
  error?: string;
}> {
  const state = await getOnboardingState(shop);

  const pageHandle = options?.pageHandle || state.builderPageHandle || "design-your-ring";
  const pageTitle = options?.pageTitle || "Design Your Ring";
  const menuHandle = options?.menuHandle || "main-menu";

  const result = await addPageToMenu(admin, {
    menuHandle,
    pageHandle,
    pageTitle,
  });

  if (result.success) {
    await updateOnboardingState(shop, {
      menuHandle,
    });

    await completeStep(shop, "menuAdded");
  }

  return result;
}

/**
 * Mark theme as configured during onboarding
 */
export async function markThemeConfigured(shop: string): Promise<void> {
  await completeStep(shop, "themeConfigured");
}

/**
 * Mark builder as tested during onboarding
 */
export async function markBuilderTested(shop: string): Promise<void> {
  await completeStep(shop, "tested");
}

/**
 * Reset onboarding (for testing)
 */
export async function resetOnboarding(shop: string): Promise<void> {
  const merchant = await prisma.merchant.findUnique({
    where: { shop },
    select: { settings: true },
  });

  let settings = {};

  if (merchant?.settings) {
    try {
      settings = JSON.parse(merchant.settings);
    } catch (e) {
      settings = {};
    }
  }

  const updatedSettings = {
    ...settings,
    onboarding: getDefaultOnboardingState(),
  };

  await prisma.merchant.update({
    where: { shop },
    data: {
      settings: JSON.stringify(updatedSettings),
    },
  });
}

/**
 * Get onboarding progress percentage
 */
export function getOnboardingProgress(state: OnboardingState): number {
  const steps = Object.values(state.steps);
  const completedSteps = steps.filter((s) => s === true).length;
  return Math.round((completedSteps / steps.length) * 100);
}

/**
 * Get current step info
 */
export function getCurrentStepInfo(state: OnboardingState): {
  step: number;
  title: string;
  description: string;
  action: string;
} {
  const stepInfo = [
    {
      step: 1,
      title: "Welcome",
      description: "Get started with Ring Builder",
      action: "Get Started",
    },
    {
      step: 2,
      title: "Create Page",
      description: "Create a Ring Builder page in your store",
      action: "Create Page",
    },
    {
      step: 3,
      title: "Add to Menu",
      description: "Add Ring Builder to your navigation menu",
      action: "Add to Menu",
    },
    {
      step: 4,
      title: "Customize Theme",
      description: "Customize colors and branding",
      action: "Customize Theme",
    },
    {
      step: 5,
      title: "Test Builder",
      description: "Try out your Ring Builder",
      action: "Test Builder",
    },
    {
      step: 6,
      title: "Complete",
      description: "You're all set!",
      action: "View Dashboard",
    },
  ];

  return stepInfo[state.currentStep - 1] || stepInfo[0];
}
