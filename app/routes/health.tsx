/**
 * Health Check Endpoint
 *
 * Returns the health status of the application.
 * Used by monitoring systems and container orchestrators.
 */

import type { LoaderFunctionArgs } from "react-router";
import prisma from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const startTime = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    const responseTime = Date.now() - startTime;

    return Response.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: "connected",
        responseTime: `${responseTime}ms`,
        version: process.env.npm_package_version || "unknown",
        nodeVersion: process.version,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
