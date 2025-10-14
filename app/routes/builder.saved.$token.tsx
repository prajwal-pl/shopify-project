/**
 * Builder Route: Load Saved Configuration
 *
 * Phase 2.0: Load and display a saved ring configuration from share token.
 *
 * Features:
 * - Loads configuration by token
 * - Pre-fills builder with saved data
 * - Shows loading state
 * - Handles invalid/expired tokens
 * - Redirects to builder with selections
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect } from "react";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const token = params.token;
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || url.hostname;

  if (!token) {
    return {
      error: "Missing share token",
      token: null,
      configuration: null,
    };
  }

  try {
    // Fetch saved configuration from API
    const response = await fetch(
      `/api/builder/saved/${token}?shop=${encodeURIComponent(shop)}`,
    );

    const data = await response.json();

    if (!data.success) {
      return {
        error: data.error || "Failed to load configuration",
        token,
        configuration: null,
      };
    }

    return {
      error: null,
      token,
      configuration: data.configuration,
      setting: data.setting,
      stone: data.stone,
    };
  } catch (error: any) {
    console.error("Error loading saved configuration:", error);
    return {
      error: "Failed to load configuration",
      token,
      configuration: null,
    };
  }
}

export default function SavedConfigurationRoute() {
  const { error, token, configuration, setting, stone } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    if (configuration && setting && stone) {
      // Redirect to builder with pre-filled data
      // Store configuration in sessionStorage
      sessionStorage.setItem(
        "ringbuilder_loaded_config",
        JSON.stringify({
          configuration,
          setting,
          stone,
        }),
      );

      // Redirect to builder
      setTimeout(() => {
        navigate("/builder");
      }, 2000);
    }
  }, [configuration, setting, stone, navigate]);

  if (error) {
    return (
      <div className="saved-config-error">
        <div className="error-container">
          <h1>😕 Oops!</h1>
          <p className="error-message">{error}</p>
          <p className="error-hint">
            The configuration link may be invalid or expired.
          </p>
          <a href="/builder" className="back-button">
            Start New Design
          </a>
        </div>

        <style>{`
          .saved-config-error {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f7f7f7;
            padding: 2rem;
          }

          .error-container {
            background: white;
            padding: 3rem;
            border-radius: 12px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .error-container h1 {
            font-size: 3rem;
            margin: 0 0 1rem 0;
          }

          .error-message {
            font-size: 1.2rem;
            color: #dc3545;
            margin: 1rem 0;
          }

          .error-hint {
            color: #666;
            margin: 1rem 0 2rem 0;
          }

          .back-button {
            display: inline-block;
            padding: 1rem 2rem;
            background: #6D2932;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
          }

          .back-button:hover {
            background: #5a1f28;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="saved-config-loading">
      <div className="loading-container">
        <div className="spinner" />
        <h2>Loading your saved ring...</h2>
        <p>Please wait while we prepare your configuration</p>
        {configuration && (
          <p className="config-id">
            Configuration ID: {configuration.configurationId}
          </p>
        )}
      </div>

      <style>{`
        .saved-config-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f7f7;
        }

        .loading-container {
          text-align: center;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #f0f0f0;
          border-top-color: #6D2932;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 2rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-container h2 {
          color: #333;
          margin: 0 0 1rem 0;
        }

        .loading-container p {
          color: #666;
          margin: 0.5rem 0;
        }

        .config-id {
          font-size: 0.9em;
          color: #999;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
