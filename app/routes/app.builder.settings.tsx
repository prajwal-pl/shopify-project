/**
 * Ring Builder Settings Page
 *
 * Configure Ring Builder app settings (general, pricing, side stones).
 */

import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect , useLoaderData, useFetcher, useNavigate } from "react-router";
import { authenticate } from "~/shopify.server";
import { useState, useEffect } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  console.log("=================================================");
  console.log("⚙️ RING BUILDER - Settings Page Loader");
  console.log("   Shop:", shop);

  // Fetch settings directly from database
  const prisma = (await import("~/db.server")).default;
  
  let settings = await prisma.appSettings.findUnique({
    where: { shop },
  });

  // Create default settings if they don't exist
  if (!settings) {
    console.log("📝 Creating default settings for shop:", shop);
    settings = await prisma.appSettings.create({
      data: {
        shop,
        builderEnabled: true,
        markupPercent: 0,
        notifyOnConfig: false,
        sideStones: JSON.stringify({
          enabled: false,
          qualities: [],
          pricing: {},
          minQuantity: 0,
          maxQuantity: 50,
        }),
      },
    });
  }

  console.log("✅ Settings loaded for shop:", shop);
  console.log("=================================================");

  return settings;
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();

  console.log("=================================================");
  console.log("⚙️ RING BUILDER - Settings Page Action (Save)");
  console.log("   Shop:", shop);

  try {
    const prisma = (await import("~/db.server")).default;

    // Parse form data
    const builderEnabled = formData.get("builderEnabled") === "true";
    const markupPercent = parseFloat(formData.get("markupPercent") as string) || 0;
    const engravingFee = parseFloat(formData.get("engravingFee") as string) || 0;
    const notifyOnConfig = formData.get("notifyOnConfig") === "true";
    const notificationEmail = formData.get("notificationEmail") as string || null;

    // Parse side stones config
    const sideStones = formData.get("sideStones") as string || JSON.stringify({
      enabled: false,
      qualities: [],
      pricing: {},
      minQuantity: 0,
      maxQuantity: 50,
    });

    // Parse theme settings
    const primaryColor = formData.get("primaryColor") as string || "#6B2C3E";
    const accentColor = formData.get("accentColor") as string || "#D4AF37";
    const backgroundColor = formData.get("backgroundColor") as string || "#FFFFFF";
    const textColor = formData.get("textColor") as string || "#000000";
    const borderRadius = parseInt(formData.get("borderRadius") as string) || 8;
    const fontFamily = formData.get("fontFamily") as string || "system-ui";
    const buttonStyle = formData.get("buttonStyle") as string || "rounded";
    const darkMode = formData.get("darkMode") === "true";
    const customCSS = formData.get("customCSS") as string || null;

    // Upsert settings
    const settings = await prisma.appSettings.upsert({
      where: { shop },
      create: {
        shop,
        builderEnabled,
        markupPercent,
        engravingFee,
        notifyOnConfig,
        notificationEmail,
        sideStones,
        primaryColor,
        accentColor,
        backgroundColor,
        textColor,
        borderRadius,
        fontFamily,
        buttonStyle,
        darkMode,
        customCSS,
      },
      update: {
        builderEnabled,
        markupPercent,
        engravingFee,
        notifyOnConfig,
        notificationEmail,
        sideStones,
        primaryColor,
        accentColor,
        backgroundColor,
        textColor,
        borderRadius,
        fontFamily,
        buttonStyle,
        darkMode,
        customCSS,
      },
    });

    console.log("✅ Settings saved successfully");
    console.log("=================================================");

    return redirect("/app/builder/settings?saved=true");
  } catch (error) {
    console.error("❌ RING BUILDER ERROR saving settings:", error);
    console.error("=================================================");
    return { error: error instanceof Error ? error.message : "Failed to save settings" };
  }
}

export default function SettingsPage() {
  const settings = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "general" | "pricing" | "sideStones" | "theme"
  >("general");

  // Check for saved query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("saved") === "true") {
      // Show success message (you could use Shopify toast here)
      setTimeout(() => {
        navigate("/app/builder/settings", { replace: true });
      }, 2000);
    }
  }, [navigate]);

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Ring Builder Settings</h1>
        <p>Configure how the ring builder works in your store</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={`tab ${activeTab === "pricing" ? "active" : ""}`}
          onClick={() => setActiveTab("pricing")}
        >
          Pricing Rules
        </button>
        <button
          className={`tab ${activeTab === "sideStones" ? "active" : ""}`}
          onClick={() => setActiveTab("sideStones")}
        >
          Side Stones
        </button>
        <button
          className={`tab ${activeTab === "theme" ? "active" : ""}`}
          onClick={() => setActiveTab("theme")}
        >
          Theme & Branding
        </button>
      </div>

      <SettingsForm settings={settings} activeTab={activeTab} />

      <style>{`
        .settings-page {
          max-width: 900px;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px;
          color: #202223;
        }

        .page-header p {
          font-size: 14px;
          color: #6d7175;
          margin: 0;
        }

        .tabs {
          display: flex;
          gap: 2px;
          background: #e1e3e5;
          border-radius: 8px 8px 0 0;
          padding: 4px;
        }

        .tab {
          flex: 1;
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #6d7175;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .tab.active {
          background: white;
          color: #202223;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}

function SettingsForm({
  settings,
  activeTab,
}: {
  settings: any;
  activeTab: "general" | "pricing" | "sideStones" | "theme";
}) {
  const fetcher = useFetcher();
  const isSaving = fetcher.state !== "idle";

  const [builderEnabled, setBuilderEnabled] = useState(settings.builderEnabled);
  const [markupPercent, setMarkupPercent] = useState(settings.markupPercent);
  const [sideStones, setSideStones] = useState(settings.sideStones);
  const [notifyOnConfig, setNotifyOnConfig] = useState(settings.notifyOnConfig);
  const [notificationEmail, setNotificationEmail] = useState(
    settings.notificationEmail || "",
  );

  // Theme settings
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || "#6B2C3E");
  const [accentColor, setAccentColor] = useState(settings.accentColor || "#D4AF37");
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor || "#FFFFFF");
  const [textColor, setTextColor] = useState(settings.textColor || "#000000");
  const [borderRadius, setBorderRadius] = useState(settings.borderRadius || 8);
  const [fontFamily, setFontFamily] = useState(settings.fontFamily || "system-ui");
  const [buttonStyle, setButtonStyle] = useState(settings.buttonStyle || "rounded");
  const [darkMode, setDarkMode] = useState(settings.darkMode || false);
  const [customCSS, setCustomCSS] = useState(settings.customCSS || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("builderEnabled", builderEnabled.toString());
    formData.append("markupPercent", markupPercent.toString());
    formData.append("notifyOnConfig", notifyOnConfig.toString());
    formData.append("notificationEmail", notificationEmail);
    formData.append("sideStones", JSON.stringify(sideStones));

    // Theme settings
    formData.append("primaryColor", primaryColor);
    formData.append("accentColor", accentColor);
    formData.append("backgroundColor", backgroundColor);
    formData.append("textColor", textColor);
    formData.append("borderRadius", borderRadius.toString());
    formData.append("fontFamily", fontFamily);
    formData.append("buttonStyle", buttonStyle);
    formData.append("darkMode", darkMode.toString());
    formData.append("customCSS", customCSS);

    fetcher.submit(formData, { method: "post" });
  };

  const handleAddQuality = () => {
    const quality = prompt("Enter side stone quality name:");
    if (quality && quality.trim()) {
      setSideStones({
        ...sideStones,
        qualities: [...(sideStones.qualities || []), quality.trim()],
        pricing: {
          ...(sideStones.pricing || {}),
          [quality.trim()]: 0,
        },
      });
    }
  };

  const handleRemoveQuality = (quality: string) => {
    const newQualities = sideStones.qualities.filter(
      (q: string) => q !== quality,
    );
    const newPricing = { ...sideStones.pricing };
    delete newPricing[quality];

    setSideStones({
      ...sideStones,
      qualities: newQualities,
      pricing: newPricing,
    });
  };

  const handleQualityPriceChange = (quality: string, price: string) => {
    setSideStones({
      ...sideStones,
      pricing: {
        ...sideStones.pricing,
        [quality]: parseFloat(price) || 0,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="settings-form">
      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="tab-content">
          <div className="form-section">
            <h3>General Settings</h3>

            <div className="form-field">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={builderEnabled}
                  onChange={(e) => setBuilderEnabled(e.target.checked)}
                />
                <span>Enable Ring Builder</span>
              </label>
              <p className="help-text">
                When disabled, the ring builder will not be visible on your
                storefront
              </p>
            </div>

            <div className="form-field">
              <label>Primary Color</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
              <p className="help-text">
                Main color for builder interface (default: #000000)
              </p>
            </div>

            <div className="form-field">
              <label>Accent Color</label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
              />
              <p className="help-text">
                Accent color for highlights (default: #D4AF37 - Gold)
              </p>
            </div>
          </div>

          <div className="form-section">
            <h3>Notifications</h3>

            <div className="form-field">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={notifyOnConfig}
                  onChange={(e) => setNotifyOnConfig(e.target.checked)}
                />
                <span>Email notifications</span>
              </label>
              <p className="help-text">
                Receive email when a customer creates a ring configuration
              </p>
            </div>

            {notifyOnConfig && (
              <div className="form-field">
                <label>Notification Email</label>
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="your-email@example.com"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Rules Tab */}
      {activeTab === "pricing" && (
        <div className="tab-content">
          <div className="form-section">
            <h3>Markup Percentage</h3>

            <div className="form-field">
              <label>Markup Percentage (%)</label>
              <input
                type="number"
                value={markupPercent}
                onChange={(e) =>
                  setMarkupPercent(parseFloat(e.target.value) || 0)
                }
                min="0"
                max="100"
                step="0.1"
              />
              <p className="help-text">
                Applied to total price of setting + stone + side stones.
                Example: 5% markup on $10,000 total = $10,500
              </p>
            </div>

            <div className="pricing-preview">
              <h4>Pricing Preview</h4>
              <div className="preview-row">
                <span>Setting Price:</span>
                <span>$500.00</span>
              </div>
              <div className="preview-row">
                <span>Stone Price:</span>
                <span>$5,000.00</span>
              </div>
              <div className="preview-row">
                <span>Subtotal:</span>
                <span>$5,500.00</span>
              </div>
              <div className="preview-row highlight">
                <span>Markup ({markupPercent}%):</span>
                <span>${((5500 * markupPercent) / 100).toFixed(2)}</span>
              </div>
              <div className="preview-row total">
                <span>Total:</span>
                <span>${(5500 + (5500 * markupPercent) / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Stones Tab */}
      {activeTab === "sideStones" && (
        <div className="tab-content">
          <div className="form-section">
            <h3>Side Stones Configuration</h3>

            <div className="form-field">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={sideStones?.enabled || false}
                  onChange={(e) =>
                    setSideStones({
                      ...sideStones,
                      enabled: e.target.checked,
                    })
                  }
                />
                <span>Enable Side Stones</span>
              </label>
              <p className="help-text">
                Allow customers to add side stones to their ring configuration
              </p>
            </div>

            {sideStones?.enabled && (
              <>
                <div className="form-field">
                  <label>Quality Levels</label>
                  <div className="quality-list">
                    {sideStones.qualities?.map((quality: string) => (
                      <div key={quality} className="quality-item">
                        <span>{quality}</span>
                        <div className="quality-actions">
                          <input
                            type="number"
                            value={sideStones.pricing[quality] || 0}
                            onChange={(e) =>
                              handleQualityPriceChange(quality, e.target.value)
                            }
                            min="0"
                            step="0.01"
                            placeholder="Price per stone"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveQuality(quality)}
                            className="remove-button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddQuality}
                    className="add-quality-button"
                  >
                    + Add Quality Level
                  </button>
                  <p className="help-text">
                    Example: Good ($50/stone), Better ($75/stone), Best
                    ($100/stone)
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Minimum Quantity</label>
                    <input
                      type="number"
                      value={sideStones.minQuantity || 0}
                      onChange={(e) =>
                        setSideStones({
                          ...sideStones,
                          minQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                    />
                  </div>

                  <div className="form-field">
                    <label>Maximum Quantity</label>
                    <input
                      type="number"
                      value={sideStones.maxQuantity || 50}
                      onChange={(e) =>
                        setSideStones({
                          ...sideStones,
                          maxQuantity: parseInt(e.target.value) || 50,
                        })
                      }
                      min="0"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Theme & Branding Tab */}
      {activeTab === "theme" && (
        <div className="tab-content">
          <div className="form-section">
            <h3>Brand Colors</h3>
            <p className="help-text" style={{ marginBottom: "16px" }}>
              Customize the appearance of your Ring Builder to match your brand
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div className="form-field">
                <label>Primary Color</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: "60px", height: "40px" }}
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#6B2C3E"
                    style={{ flex: 1 }}
                  />
                </div>
                <p className="help-text">Main brand color for buttons and highlights</p>
              </div>

              <div className="form-field">
                <label>Accent Color</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: "60px", height: "40px" }}
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#D4AF37"
                    style={{ flex: 1 }}
                  />
                </div>
                <p className="help-text">Secondary color for accents</p>
              </div>

              <div className="form-field">
                <label>Background Color</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    style={{ width: "60px", height: "40px" }}
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#FFFFFF"
                    style={{ flex: 1 }}
                  />
                </div>
                <p className="help-text">Page background color</p>
              </div>

              <div className="form-field">
                <label>Text Color</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{ width: "60px", height: "40px" }}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#000000"
                    style={{ flex: 1 }}
                  />
                </div>
                <p className="help-text">Primary text color</p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Button Style</h3>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <button
                type="button"
                onClick={() => setButtonStyle("rounded")}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  border: buttonStyle === "rounded" ? "2px solid #2c6ecb" : "1px solid #c9cccf",
                  borderRadius: "8px",
                  background: buttonStyle === "rounded" ? "#f0f7ff" : "white",
                  cursor: "pointer",
                  fontWeight: buttonStyle === "rounded" ? "600" : "normal",
                }}
              >
                Rounded
              </button>
              <button
                type="button"
                onClick={() => setButtonStyle("square")}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  border: buttonStyle === "square" ? "2px solid #2c6ecb" : "1px solid #c9cccf",
                  borderRadius: "0px",
                  background: buttonStyle === "square" ? "#f0f7ff" : "white",
                  cursor: "pointer",
                  fontWeight: buttonStyle === "square" ? "600" : "normal",
                }}
              >
                Square
              </button>
              <button
                type="button"
                onClick={() => setButtonStyle("pill")}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  border: buttonStyle === "pill" ? "2px solid #2c6ecb" : "1px solid #c9cccf",
                  borderRadius: "999px",
                  background: buttonStyle === "pill" ? "#f0f7ff" : "white",
                  cursor: "pointer",
                  fontWeight: buttonStyle === "pill" ? "600" : "normal",
                }}
              >
                Pill
              </button>
            </div>

            <div className="form-field">
              <label>Border Radius (px)</label>
              <input
                type="range"
                min="0"
                max="24"
                step="2"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                style={{ width: "100%", maxWidth: "300px" }}
              />
              <span style={{ marginLeft: "12px", fontWeight: "500" }}>{borderRadius}px</span>
              <p className="help-text">Applies to cards and panels</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Typography</h3>
            <div className="form-field">
              <label>Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "10px 12px",
                  border: "1px solid #c9cccf",
                  borderRadius: "6px",
                }}
              >
                <option value="system-ui">System Default</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="'Playfair Display', serif">Playfair Display</option>
                <option value="Montserrat">Montserrat</option>
                <option value="'Open Sans'">Open Sans</option>
              </select>
              <p className="help-text">Choose a font for your Ring Builder</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Dark Mode</h3>
            <div className="form-field">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span>Enable Dark Mode</span>
              </label>
              <p className="help-text">Automatically adjust colors for dark backgrounds</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Live Preview</h3>
            <div
              style={{
                padding: "30px",
                borderRadius: `${borderRadius}px`,
                background: backgroundColor,
                color: textColor,
                fontFamily: fontFamily,
                border: "1px solid #e1e3e5",
              }}
            >
              <h4 style={{ marginBottom: "12px", fontSize: "20px", fontWeight: "600" }}>
                Sample Heading
              </h4>
              <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                This is how your Ring Builder will look with these theme settings. The colors,
                fonts, and button styles will be applied to your storefront builder.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  style={{
                    padding: "12px 24px",
                    background: primaryColor,
                    color: backgroundColor,
                    border: "none",
                    borderRadius:
                      buttonStyle === "rounded"
                        ? `${borderRadius}px`
                        : buttonStyle === "pill"
                        ? "999px"
                        : "0px",
                    fontFamily: fontFamily,
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  style={{
                    padding: "12px 24px",
                    background: accentColor,
                    color: textColor,
                    border: "none",
                    borderRadius:
                      buttonStyle === "rounded"
                        ? `${borderRadius}px`
                        : buttonStyle === "pill"
                        ? "999px"
                        : "0px",
                    fontFamily: fontFamily,
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Advanced Customization</h3>
            <div className="form-field">
              <label>Custom CSS (Optional)</label>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                rows={8}
                placeholder=".builder-app {
  /* Add custom CSS here */
}"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #c9cccf",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}
              />
              <p className="help-text">
                Add custom CSS to override default styles. Use with caution - invalid CSS may
                break the builder appearance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="button secondary"
        >
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="button primary">
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {fetcher.data?.success && (
        <div className="success-message">✅ Settings saved successfully!</div>
      )}

      {fetcher.data?.error && (
        <div className="error-message">❌ Error: {fetcher.data.error}</div>
      )}

      <style>{`
        .settings-page {
          max-width: 900px;
        }

        .tab-content {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 0 0 8px 8px;
          padding: 24px;
        }

        .settings-form {
          margin-top: 0;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .form-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px;
          color: #202223;
        }

        .form-field {
          margin-bottom: 20px;
        }

        .form-field label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #202223;
        }

        .form-field input[type="text"],
        .form-field input[type="email"],
        .form-field input[type="number"],
        .form-field input[type="color"],
        .form-field select {
          width: 100%;
          max-width: 400px;
          padding: 10px 12px;
          border: 1px solid #c9cccf;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-field input[type="color"] {
          width: 100px;
          height: 40px;
          padding: 4px;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .toggle-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .toggle-label span {
          font-size: 14px;
          font-weight: 500;
          color: #202223;
        }

        .help-text {
          font-size: 13px;
          color: #6d7175;
          margin: 6px 0 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .pricing-preview {
          margin-top: 24px;
          padding: 20px;
          background: #f6f6f7;
          border-radius: 8px;
        }

        .pricing-preview h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px;
          color: #202223;
        }

        .preview-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }

        .preview-row.highlight {
          color: #2c6ecb;
          font-weight: 500;
        }

        .preview-row.total {
          border-top: 2px solid #c9cccf;
          padding-top: 12px;
          margin-top: 8px;
          font-size: 18px;
          font-weight: 600;
        }

        .quality-list {
          margin-bottom: 12px;
        }

        .quality-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f6f6f7;
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .quality-item span {
          font-weight: 500;
        }

        .quality-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .quality-actions input {
          width: 150px;
          padding: 8px 12px;
          border: 1px solid #c9cccf;
          border-radius: 6px;
        }

        .remove-button {
          padding: 6px 12px;
          background: #e02424;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .remove-button:hover {
          background: #c41e1e;
        }

        .add-quality-button {
          padding: 10px 16px;
          background: white;
          border: 1px dashed #c9cccf;
          border-radius: 6px;
          color: #2c6ecb;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
        }

        .add-quality-button:hover {
          border-color: #2c6ecb;
          background: #f6f6f7;
        }

        .form-actions {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e1e3e5;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .button.primary {
          background: #2c6ecb;
          color: white;
        }

        .button.primary:hover:not(:disabled) {
          background: #1f5199;
        }

        .button.secondary {
          background: white;
          border: 1px solid #c9cccf;
          color: #202223;
        }

        .button.secondary:hover {
          background: #f6f6f7;
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .success-message {
          margin-top: 16px;
          padding: 16px;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 6px;
          color: #155724;
        }

        .error-message {
          margin-top: 16px;
          padding: 16px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
        }
      `}</style>
    </form>
  );
}
