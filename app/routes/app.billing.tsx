/**
 * Admin Billing Page
 *
 * Allows merchants to:
 * - View current subscription plan
 * - See usage statistics
 * - Upgrade/downgrade plans
 * - View billing history
 * - Cancel subscription
 */

import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "~/shopify.server";
import {
  getSubscriptionStatus,
  getUsageStats,
  SUBSCRIPTION_PLANS,
} from "~/services/billing.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const [subscription, usage] = await Promise.all([
    getSubscriptionStatus(shop),
    getUsageStats(shop),
  ]);

  return {
    shop,
    subscription,
    usage,
    plans: SUBSCRIPTION_PLANS,
  };
};

export default function Billing() {
  const { subscription, usage, plans } = useLoaderData<typeof loader>();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const currentPlan = subscription.plan
    ? plans[subscription.plan as keyof typeof plans]
    : null;

  const handleUpgrade = async (newPlan: string) => {
    try {
      const response = await fetch("/api/admin/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: newPlan,
          returnUrl: `${window.location.origin}/app/billing`,
        }),
      });

      const data = await response.json();

      if (data.success && data.confirmationUrl) {
        window.top!.location.href = data.confirmationUrl;
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
      alert("Failed to upgrade plan. Please try again.");
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? Your Ring Builder will stop working at the end of the billing period.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/billing/cancel", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        alert(
          "Subscription cancelled. You can continue using the app until the end of your billing period.",
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Failed to cancel subscription. Please contact support.");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Billing & Subscription
        </h1>
        <p style={{ fontSize: "16px", color: "#666" }}>
          Manage your Ring Builder subscription and view usage statistics
        </p>
      </div>

      {/* Current Plan Card */}
      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #6B2C3E",
          borderRadius: "8px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "10px",
              }}
            >
              <h2 style={{ fontSize: "24px", margin: 0 }}>
                {currentPlan?.name || "No Active Plan"}
              </h2>
              {subscription.trialDaysRemaining &&
                subscription.trialDaysRemaining > 0 && (
                  <span
                    style={{
                      backgroundColor: "#FFF3CD",
                      color: "#856404",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {subscription.trialDaysRemaining} days left in trial
                  </span>
                )}
              <span
                style={{
                  backgroundColor: subscription.hasActiveSubscription
                    ? "#D4EDDA"
                    : "#F8D7DA",
                  color: subscription.hasActiveSubscription
                    ? "#155724"
                    : "#721C24",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {subscription.status || "Inactive"}
              </span>
            </div>
            <p
              style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}
            >
              ${currentPlan?.price || 0}
              <span
                style={{
                  fontSize: "18px",
                  color: "#666",
                  fontWeight: "normal",
                }}
              >
                /month
              </span>
            </p>
            {currentPlan && (
              <p
                style={{
                  fontSize: "16px",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                {currentPlan.description}
              </p>
            )}
          </div>
        </div>

        {/* Usage Statistics */}
        <div
          style={{
            borderTop: "1px solid #E0E0E0",
            paddingTop: "20px",
            marginTop: "20px",
          }}
        >
          <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>
            Usage Statistics
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            <div>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
              >
                Products
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {usage.products.current}
                {usage.products.limit !== "Unlimited" && (
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#666",
                      fontWeight: "normal",
                    }}
                  >
                    {" "}
                    / {usage.products.limit}
                  </span>
                )}
              </div>
              {usage.products.limit !== "Unlimited" && (
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#E0E0E0",
                    borderRadius: "4px",
                    marginTop: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(usage.percentUsed, 100)}%`,
                      height: "100%",
                      backgroundColor:
                        usage.percentUsed > 90 ? "#DC3545" : "#6B2C3E",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
              >
                Configurations
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {usage.configurations}
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
              >
                Customer Inquiries
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {usage.inquiries}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {subscription.hasActiveSubscription && (
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowCancelModal(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#F8F9FA",
                color: "#DC3545",
                border: "1px solid #DC3545",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
          {subscription.hasActiveSubscription
            ? "Upgrade or Change Plan"
            : "Choose a Plan"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {Object.entries(plans).map(([key, plan]) => {
            const isCurrentPlan = subscription.plan === key;
            const canUpgrade =
              subscription.plan && plan.price > (currentPlan?.price || 0);

            return (
              <div
                key={key}
                style={{
                  border: isCurrentPlan
                    ? "3px solid #6B2C3E"
                    : "1px solid #E0E0E0",
                  borderRadius: "8px",
                  padding: "25px 20px",
                  backgroundColor: "white",
                  position: "relative",
                }}
              >
                {isCurrentPlan && (
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
                    CURRENT PLAN
                  </div>
                )}
                <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                  {plan.name}
                </h3>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  ${plan.price}
                  <span style={{ fontSize: "14px", color: "#666" }}>/mo</span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "15px",
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
                    lineHeight: "1.8",
                  }}
                >
                  <li>
                    ✓{" "}
                    {plan.features.maxProducts === -1
                      ? "Unlimited"
                      : plan.features.maxProducts}{" "}
                    products
                  </li>
                  {plan.features.inventoryFeeds > 0 && (
                    <li>
                      ✓ {plan.features.inventoryFeeds} inventory feed
                      {plan.features.inventoryFeeds > 1 ? "s" : ""}
                    </li>
                  )}
                  {plan.features.analytics && <li>✓ Analytics dashboard</li>}
                  {plan.features.customBranding && <li>✓ Custom branding</li>}
                  {plan.features.prioritySupport && <li>✓ Priority support</li>}
                  {plan.features.apiAccess && <li>✓ API access</li>}
                </ul>
                {!isCurrentPlan && (
                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={!canUpgrade && subscription.hasActiveSubscription}
                    style={{
                      width: "100%",
                      backgroundColor: canUpgrade ? "#6B2C3E" : "#F5F5F5",
                      color: canUpgrade ? "white" : "#666",
                      padding: "12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: canUpgrade ? "pointer" : "not-allowed",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {canUpgrade
                      ? `Upgrade to ${plan.name}`
                      : !subscription.hasActiveSubscription
                        ? "Select Plan"
                        : "Downgrade (Contact Support)"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCancelModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "30px",
              maxWidth: "500px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
              Cancel Subscription?
            </h3>
            <p
              style={{
                fontSize: "16px",
                color: "#666",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}
            >
              Your Ring Builder will continue to work until{" "}
              {subscription.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : "the end of your billing period"}
              . After that, customers won't be able to use the ring builder on
              your store.
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#F5F5F5",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  handleCancel();
                  setShowCancelModal(false);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#DC3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div
        style={{
          backgroundColor: "#F8F9FA",
          borderRadius: "8px",
          padding: "25px",
          marginTop: "30px",
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>Need Help?</h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
          Have questions about billing or want to discuss a custom plan?
        </p>
        <a
          href="mailto:support@your-domain.com"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#6B2C3E",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
