#!/bin/bash
# Monitoring Setup Script
# Sets up Sentry for error tracking and UptimeRobot for uptime monitoring

set -e

echo "📊 Monitoring Setup for Ring Builder"
echo "===================================="
echo ""

# ============================================================================
# SENTRY SETUP (Error Tracking)
# ============================================================================

echo "🔍 Setting up Sentry (Error Tracking)..."
echo ""

# Check if Sentry is already installed
if grep -q "@sentry/node" package.json; then
  echo "✅ Sentry already installed"
else
  echo "📦 Installing Sentry..."
  npm install @sentry/node @sentry/react --save
  echo "✅ Sentry installed"
fi
echo ""

# Prompt for Sentry DSN
echo "📝 Sentry Configuration:"
echo "1. Sign up at https://sentry.io (free tier available)"
echo "2. Create a new project (Node.js)"
echo "3. Copy your DSN (Data Source Name)"
echo ""

read -p "Enter your Sentry DSN (or press Enter to skip): " SENTRY_DSN

if [ ! -z "$SENTRY_DSN" ]; then
  # Set environment variable
  if [ ! -z "$HEROKU_APP" ]; then
    heroku config:set SENTRY_DSN="$SENTRY_DSN" --app $HEROKU_APP
    echo "✅ Sentry DSN set in Heroku"
  else
    echo "Add to your .env file:"
    echo "SENTRY_DSN=$SENTRY_DSN"
  fi
  echo ""
  
  # Create Sentry initialization file
  cat > app/utils/sentry.server.ts << 'EOF'
/**
 * Sentry Error Tracking
 * 
 * Initializes Sentry for server-side error tracking.
 */

import * as Sentry from "@sentry/node";

export function initSentry() {
  if (process.env.SENTRY_DSN && process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // 10% of transactions
      
      // Performance monitoring
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Prisma({ client: prisma }),
      ],
    });
    
    console.log("✅ Sentry initialized");
  }
}

// Export error capture function
export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === "production") {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("Error:", error, context);
  }
}
EOF
  
  echo "✅ Created app/utils/sentry.server.ts"
  echo ""
fi

# ============================================================================
# UPTIME MONITORING SETUP
# ============================================================================

echo "⏰ Setting up Uptime Monitoring..."
echo ""

echo "📝 UptimeRobot Configuration (Recommended):"
echo "1. Sign up at https://uptimerobot.com (free tier: 50 monitors)"
echo "2. Click 'Add New Monitor'"
echo "3. Monitor Type: HTTP(s)"
echo "4. Friendly Name: Ring Builder Production"
echo "5. URL: https://your-app-url.com"
echo "6. Monitoring Interval: 5 minutes"
echo "7. Alert Contacts: Add your email"
echo ""

read -p "Press Enter when you've set up UptimeRobot monitoring..."

echo "✅ Uptime monitoring configured"
echo ""

# ============================================================================
# LOGGING SETUP
# ============================================================================

echo "📝 Logging Configuration..."
echo ""

# Create logging utility
cat > app/utils/logger.server.ts << 'EOF'
/**
 * Centralized Logging Utility
 * 
 * Provides structured logging for the application.
 */

export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(`[INFO] ${message}`, meta || "");
  },
  
  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(`[WARN] ${message}`, meta || "");
  },
  
  error: (message: string, error?: Error, meta?: Record<string, any>) => {
    console.error(`[ERROR] ${message}`, { error, ...meta });
    
    // Send to Sentry in production
    if (process.env.NODE_ENV === "production" && error) {
      const Sentry = require("@sentry/node");
      Sentry.captureException(error, { extra: meta });
    }
  },
  
  debug: (message: string, meta?: Record<string, any>) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] ${message}`, meta || "");
    }
  },
};
EOF

echo "✅ Created app/utils/logger.server.ts"
echo ""

# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

echo "🏥 Creating health check endpoint..."
echo ""

cat > app/routes/api.health.tsx << 'EOF'
/**
 * Health Check Endpoint
 * 
 * GET /api/health
 * 
 * Returns app health status for monitoring.
 */

import type { LoaderFunctionArgs } from "react-router";
import prisma from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const responseTime = Date.now() - startTime;
    
    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
      responseTime: `${responseTime}ms`,
    });
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
EOF

echo "✅ Created app/routes/api.health.tsx"
echo ""

# ============================================================================
# SUMMARY
# ============================================================================

echo "🎉 Monitoring Setup Complete!"
echo ""
echo "What was configured:"
if [ ! -z "$SENTRY_DSN" ]; then
  echo "✅ Sentry error tracking"
fi
echo "✅ UptimeRobot uptime monitoring (manual setup)"
echo "✅ Centralized logging utility"
echo "✅ Health check endpoint (/api/health)"
echo ""

echo "Next steps:"
echo "1. Deploy app to production"
echo "2. Test health endpoint: curl https://your-app.com/api/health"
echo "3. Trigger a test error to verify Sentry"
echo "4. Check UptimeRobot is monitoring"
echo "5. Monitor logs: heroku logs --tail (if using Heroku)"
echo ""

echo "Monitoring URLs:"
echo "- Sentry: https://sentry.io"
echo "- UptimeRobot: https://uptimerobot.com"
echo "- Health Check: https://your-app-url.com/api/health"
echo ""

