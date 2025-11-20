/**
 * Onboarding Flow
 *
 * Enhanced 6-step onboarding wizard for new merchants:
 * 1. Welcome
 * 2. Create Ring Builder Page
 * 3. Add to Navigation Menu
 * 4. Customize Theme
 * 5. Test the Builder
 * 6. Complete!
 */

import { useEffect, useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useSubmit } from "react-router";
import { authenticate } from "~/shopify.server";
import {
  getOnboardingState,
  completeStep,
  createBuilderPageForOnboarding,
  addBuilderPageToMenu,
  markThemeConfigured,
  markBuilderTested,
  getCurrentStepInfo,
  getOnboardingProgress,
} from "~/services/onboarding.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const onboardingState = await getOnboardingState(shop);
  const currentStepInfo = getCurrentStepInfo(onboardingState);
  const progress = getOnboardingProgress(onboardingState);

  return {
    shop,
    onboardingState,
    currentStepInfo,
    progress,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "completeWelcome") {
    await completeStep(shop, "welcome");
    return Response.json({ success: true });
  }

  if (action === "createPage") {
    const title = formData.get("title") as string;
    const handle = formData.get("handle") as string;

    const result = await createBuilderPageForOnboarding(admin, shop, {
      title: title || "Design Your Ring",
      handle: handle || "design-your-ring",
    });

    return Response.json(result);
  }

  if (action === "addToMenu") {
    const menuHandle = formData.get("menuHandle") as string;
    const result = await addBuilderPageToMenu(admin, shop, {
      menuHandle: menuHandle || "main-menu",
    });

    return Response.json(result);
  }

  if (action === "skipMenu") {
    await completeStep(shop, "menuAdded");
    return Response.json({ success: true });
  }

  if (action === "themeConfigured") {
    await markThemeConfigured(shop);
    return Response.json({ success: true });
  }

  if (action === "tested") {
    await markBuilderTested(shop);
    return Response.json({ success: true });
  }

  return Response.json(
    { success: false, error: "Invalid action" },
    { status: 400 },
  );
};

export default function Onboarding() {
  const { shop, onboardingState, currentStepInfo, progress } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [pageTitle, setPageTitle] = useState("Design Your Ring");
  const [pageHandle, setPageHandle] = useState("design-your-ring");
  const [menuHandle, setMenuHandle] = useState("main-menu");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = onboardingState.currentStep;

  useEffect(() => {
    if (onboardingState.completed) {
      navigate("/app");
    }
  }, [onboardingState, navigate]);

  const handleWelcome = async () => {
    const formData = new FormData();
    formData.append("action", "completeWelcome");
    submit(formData, { method: "post", navigate: false });
  };

  const handleCreatePage = async () => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("action", "createPage");
    formData.append("title", pageTitle);
    formData.append("handle", pageHandle);

    const response = await fetch("/app/onboarding", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      window.location.reload();
    } else {
      setError(data.error || "Failed to create page");
    }

    setIsLoading(false);
  };

  const handleAddToMenu = async () => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("action", "addToMenu");
    formData.append("menuHandle", menuHandle);

    const response = await fetch("/app/onboarding", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      window.location.reload();
    } else {
      setError(data.error || "Failed to add to menu");
    }

    setIsLoading(false);
  };

  const handleSkipMenu = async () => {
    const formData = new FormData();
    formData.append("action", "skipMenu");
    submit(formData, { method: "post", navigate: false });
  };

  const handleGoToTheme = () => {
    navigate("/app/builder/settings?tab=theme");
  };

  const handleMarkThemeConfigured = async () => {
    const formData = new FormData();
    formData.append("action", "themeConfigured");
    submit(formData, { method: "post", navigate: false });
  };

  const handleTestBuilder = () => {
    const builderUrl = onboardingState.builderPageUrl || `/builder?shop=${shop}`;
    window.open(builderUrl, "_blank");
  };

  const handleMarkTested = async () => {
    const formData = new FormData();
    formData.append("action", "tested");
    submit(formData, { method: "post", navigate: false });
  };

  const handleComplete = () => {
    navigate("/app");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Progress Indicator */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              style={{
                width: "15%",
                height: "4px",
                backgroundColor: step <= currentStep ? "#6B2C3E" : "#E0E0E0",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
          Step {currentStep} of 6 - {progress}% Complete
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#ffe6e6", borderRadius: "8px", color: "#d32f2f" }}>
          {error}
        </div>
      )}

      {/* Step 1: Welcome */}
      {currentStep === 1 && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
            Welcome to Ring Builder! 💎
          </h1>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "40px" }}>
            Let's get your custom ring builder set up in just a few minutes.
          </p>
          <ul
            style={{
              textAlign: "left",
              maxWidth: "500px",
              margin: "0 auto 40px",
              fontSize: "16px",
              lineHeight: "1.8",
            }}
          >
            <li>✅ Create a Ring Builder page in your store</li>
            <li>✅ Add it to your navigation menu</li>
            <li>✅ Customize colors to match your brand</li>
            <li>✅ Start selling custom rings today</li>
          </ul>
          <button
            onClick={handleWelcome}
            disabled={onboardingState.steps.welcome}
            style={{
              backgroundColor: "#6B2C3E",
              color: "white",
              padding: "15px 40px",
              fontSize: "18px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: onboardingState.steps.welcome ? 0.5 : 1,
            }}
          >
            {onboardingState.steps.welcome ? "✓ Completed" : "Get Started →"}
          </button>
        </div>
      )}

      {/* Step 2: Create Page */}
      {currentStep === 2 && (
        <div>
          <h1
            style={{
              fontSize: "28px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Create Ring Builder Page
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            We'll create a page in your Online Store where customers can design their rings.
          </p>

          <div
            style={{
              backgroundColor: "#F9F9F9",
              padding: "30px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                Page Title
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px",
                }}
                placeholder="Design Your Ring"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                Page URL Handle
              </label>
              <input
                type="text"
                value={pageHandle}
                onChange={(e) => setPageHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px",
                }}
                placeholder="design-your-ring"
              />
              <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                URL: yourstore.com/pages/{pageHandle}
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleCreatePage}
              disabled={isLoading || onboardingState.steps.pageCreated}
              style={{
                backgroundColor: "#6B2C3E",
                color: "white",
                padding: "15px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                opacity: isLoading || onboardingState.steps.pageCreated ? 0.5 : 1,
              }}
            >
              {isLoading ? "Creating..." : onboardingState.steps.pageCreated ? "✓ Page Created" : "Create Page"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Add to Menu */}
      {currentStep === 3 && (
        <div>
          <h1
            style={{
              fontSize: "28px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Add to Navigation Menu
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Add your Ring Builder page to your store's navigation menu.
          </p>

          <div
            style={{
              backgroundColor: "#F9F9F9",
              padding: "30px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                Menu Handle
              </label>
              <input
                type="text"
                value={menuHandle}
                onChange={(e) => setMenuHandle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px",
                }}
                placeholder="main-menu"
              />
              <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                Common values: "main-menu", "footer"
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={handleAddToMenu}
              disabled={isLoading || onboardingState.steps.menuAdded}
              style={{
                backgroundColor: "#6B2C3E",
                color: "white",
                padding: "15px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                opacity: isLoading || onboardingState.steps.menuAdded ? 0.5 : 1,
              }}
            >
              {isLoading ? "Adding..." : onboardingState.steps.menuAdded ? "✓ Added to Menu" : "Add to Menu"}
            </button>

            <button
              onClick={handleSkipMenu}
              disabled={onboardingState.steps.menuAdded}
              style={{
                backgroundColor: "#f5f5f5",
                color: "#333",
                padding: "15px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Skip for Now
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Customize Theme */}
      {currentStep === 4 && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
            Customize Your Theme
          </h1>
          <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
            Make the Ring Builder match your brand with custom colors and styling.
          </p>
          <div
            style={{
              backgroundColor: "#F9F9F9",
              padding: "30px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>
              Theme Settings:
            </h3>
            <ul
              style={{ textAlign: "left", fontSize: "16px", lineHeight: "1.8" }}
            >
              <li>🎨 Primary & accent colors</li>
              <li>✨ Button styles & borders</li>
              <li>🌙 Dark mode support</li>
              <li>💻 Custom CSS (advanced)</li>
            </ul>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={handleGoToTheme}
              style={{
                backgroundColor: "#6B2C3E",
                color: "white",
                padding: "15px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Go to Theme Settings
            </button>

            <button
              onClick={handleMarkThemeConfigured}
              disabled={onboardingState.steps.themeConfigured}
              style={{
                backgroundColor: "#f5f5f5",
                color: "#333",
                padding: "15px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                opacity: onboardingState.steps.themeConfigured ? 0.5 : 1,
              }}
            >
              {onboardingState.steps.themeConfigured ? "✓ Configured" : "Skip for Now"}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Test Builder */}
      {currentStep === 5 && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
            Test Your Ring Builder
          </h1>
          <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
            Try out your Ring Builder to see how it works for customers.
          </p>
          <div
            style={{
              backgroundColor: "#F9F9F9",
              padding: "30px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>
              What to Test:
            </h3>
            <ul
              style={{ textAlign: "left", fontSize: "16px", lineHeight: "1.8" }}
            >
              <li>💍 Browse ring settings</li>
              <li>💎 Select diamonds</li>
              <li>🎨 Check if theme colors look good</li>
              <li>📱 Test on mobile device</li>
            </ul>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={handleTestBuilder}
              style={{
                backgroundColor: "#6B2C3E",
                color: "white",
                padding: "15px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Open Ring Builder
            </button>

            <button
              onClick={handleMarkTested}
              disabled={onboardingState.steps.tested}
              style={{
                backgroundColor: "#f5f5f5",
                color: "#333",
                padding: "15px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                opacity: onboardingState.steps.tested ? 0.5 : 1,
              }}
            >
              {onboardingState.steps.tested ? "✓ Tested" : "Mark as Tested"}
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Complete */}
      {currentStep === 6 && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
            You're All Set! 🎉
          </h1>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "40px" }}>
            Your Ring Builder is live and ready for customers!
          </p>
          <div
            style={{
              backgroundColor: "#F9F9F9",
              padding: "30px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>
              Next Steps:
            </h3>
            <ul
              style={{ textAlign: "left", fontSize: "16px", lineHeight: "1.8" }}
            >
              <li>📦 Add your ring settings as Shopify products</li>
              <li>💎 Add diamonds and gemstones</li>
              <li>🔧 Configure settings and side stones</li>
              <li>📊 Monitor configurations in your dashboard</li>
              <li>🌐 Get embed code for external sites</li>
            </ul>
          </div>
          <button
            onClick={handleComplete}
            style={{
              backgroundColor: "#6B2C3E",
              color: "white",
              padding: "15px 40px",
              fontSize: "18px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Go to Dashboard →
          </button>
        </div>
      )}
    </div>
  );
}
