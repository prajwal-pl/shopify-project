/**
 * Onboarding Flow
 *
 * Multi-step onboarding wizard for new merchants:
 * 1. Welcome
 * 2. Choose Plan
 * 3. Setup Metafields
 * 4. Add First Products (optional)
 * 5. Complete!
 */

import { useEffect, useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useSubmit } from "react-router";
import { authenticate } from "~/shopify.server";
import {
  getMerchantSettings,
  updateMerchantSettings,
  completeOnboarding,
} from "~/services/merchant.server";
import {
  getSubscriptionStatus,
  SUBSCRIPTION_PLANS,
  type PlanName,
} from "~/services/billing.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const [settings, subscription] = await Promise.all([
    getMerchantSettings(shop),
    getSubscriptionStatus(shop),
  ]);

  return {
    shop,
    settings,
    subscription,
    plans: SUBSCRIPTION_PLANS,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "updateStep") {
    const step = parseInt(formData.get("step") as string);
    await updateMerchantSettings(shop, { onboardingStep: step });
    return Response.json({ success: true });
  }

  if (action === "complete") {
    await completeOnboarding(shop);
    return Response.json({ success: true, redirect: "/app/builder/products" });
  }

  return Response.json(
    { success: false, error: "Invalid action" },
    { status: 400 },
  );
};

export default function Onboarding() {
  const { settings, plans } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [currentStep, setCurrentStep] = useState(
    (settings as any)?.onboardingStep || 1,
  );

  // Redirect if already completed
  useEffect(() => {
    if ((settings as any)?.onboardingCompleted) {
      navigate("/app/builder/products");
    }
  }, [settings, navigate]);

  const handleNextStep = async () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    const formData = new FormData();
    formData.append("action", "updateStep");
    formData.append("step", nextStep.toString());
    submit(formData, { method: "post" });
  };

  const handleComplete = async () => {
    const formData = new FormData();
    formData.append("action", "complete");
    submit(formData, { method: "post" });
  };

  const handleSelectPlan = async (plan: PlanName) => {
    try {
      const response = await fetch("/api/admin/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          returnUrl: `${window.location.origin}/app/onboarding?step=3`,
        }),
      });

      const data = await response.json();

      if (data.success && data.confirmationUrl) {
        // Redirect to Shopify billing confirmation
        window.top!.location.href = data.confirmationUrl;
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Progress Indicator */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              style={{
                width: "22%",
                height: "4px",
                backgroundColor: step <= currentStep ? "#6B2C3E" : "#E0E0E0",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
          Step {currentStep} of 4
        </p>
      </div>

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
            <li>✅ No coding required - visual setup</li>
            <li>✅ Add your first ring in under 30 seconds</li>
            <li>✅ Start selling custom rings today</li>
            <li>✅ Free 14-day trial (no credit card)</li>
          </ul>
          <button
            onClick={handleNextStep}
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
            Get Started →
          </button>
        </div>
      )}

      {/* Step 2: Choose Plan */}
      {currentStep === 2 && (
        <div>
          <h1
            style={{
              fontSize: "28px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Choose Your Plan
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Start with a 14-day free trial. Cancel anytime.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {Object.entries(plans).map(([key, planData]) => {
              const plan = planData as (typeof SUBSCRIPTION_PLANS)[PlanName];
              return (
                <div
                  key={key}
                  style={{
                    border:
                      key === "professional"
                        ? "3px solid #6B2C3E"
                        : "1px solid #E0E0E0",
                    borderRadius: "8px",
                    padding: "30px 20px",
                    position: "relative",
                    backgroundColor: "white",
                  }}
                >
                  {key === "professional" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#6B2C3E",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                    {plan.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    ${plan.price}
                    <span style={{ fontSize: "16px", color: "#666" }}>/mo</span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "20px",
                      minHeight: "40px",
                    }}
                  >
                    {plan.description}
                  </p>
                  <ul
                    style={{
                      fontSize: "14px",
                      marginBottom: "20px",
                      listStyle: "none",
                      padding: 0,
                    }}
                  >
                    <li>
                      ✓{" "}
                      {plan.features.maxProducts === -1
                        ? "Unlimited"
                        : plan.features.maxProducts}{" "}
                      products
                    </li>
                    <li>✓ {plan.trialDays}-day free trial</li>
                    {plan.features.inventoryFeeds > 0 && (
                      <li>
                        ✓ {plan.features.inventoryFeeds} inventory feed
                        {plan.features.inventoryFeeds > 1 ? "s" : ""}
                      </li>
                    )}
                    {plan.features.analytics && <li>✓ Analytics dashboard</li>}
                    {plan.features.customBranding && <li>✓ Custom branding</li>}
                    {plan.features.prioritySupport && (
                      <li>✓ Priority support</li>
                    )}
                    {plan.features.apiAccess && <li>✓ API access</li>}
                  </ul>
                  <button
                    onClick={() => handleSelectPlan(key as PlanName)}
                    style={{
                      width: "100%",
                      backgroundColor:
                        key === "professional" ? "#6B2C3E" : "#F5F5F5",
                      color: key === "professional" ? "white" : "#333",
                      padding: "12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Start {plan.trialDays}-Day Trial
                  </button>
                </div>
              );
            })}
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            No credit card required • Cancel anytime
          </p>
        </div>
      )}

      {/* Step 3: Setting Up */}
      {currentStep === 3 && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
            Setting Up Your Store... ⚙️
          </h1>
          <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
            We're configuring your ring builder. This will only take a moment.
          </p>
          <div style={{ marginBottom: "30px" }}>
            <div
              className="loading-spinner"
              style={{ margin: "0 auto", width: "50px", height: "50px" }}
            >
              {/* Spinner animation */}
              <div
                style={{
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #6B2C3E",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>
          </div>
          <ul
            style={{
              textAlign: "left",
              maxWidth: "400px",
              margin: "0 auto",
              fontSize: "16px",
              lineHeight: "1.8",
            }}
          >
            <li>✅ Creating metafield definitions</li>
            <li>✅ Setting up default configuration</li>
            <li>✅ Preparing your dashboard</li>
          </ul>
          <button
            onClick={handleNextStep}
            style={{
              marginTop: "40px",
              backgroundColor: "#6B2C3E",
              color: "white",
              padding: "15px 40px",
              fontSize: "18px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 4: Complete */}
      {currentStep === 4 && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
            You're All Set! 🎉
          </h1>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "40px" }}>
            Your Ring Builder is ready to use. Let's add your first product!
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
              Quick Tips:
            </h3>
            <ul
              style={{ textAlign: "left", fontSize: "16px", lineHeight: "1.8" }}
            >
              <li>📱 Add products using our visual forms (takes 30 seconds)</li>
              <li>💎 Start with a few diamonds and settings</li>
              <li>🎨 Customize your builder colors to match your brand</li>
              <li>📧 Customer inquiries will appear in your dashboard</li>
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
