/**
 * GDPR Webhook: Customer Data Request
 *
 * Handles customer data export requests for GDPR compliance.
 * Must respond with customer data within 30 days.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, payload } = await authenticate.webhook(request);

  console.log("Received customers/data_request webhook for", shop);

  try {
    const customerId = (payload as any).customer?.id;
    const customerEmail = (payload as any).customer?.email;

    // Gather all customer data from our database
    const [configurations, inquiries] = await Promise.all([
      prisma.configuration.findMany({
        where: {
          shop,
          OR: [{ customerId }, { customerEmail }],
        },
      }),
      prisma.customerInquiry.findMany({
        where: {
          shop,
          customerEmail,
        },
      }),
    ]);

    // Log the data export request
    console.log("Customer data export request processed:", {
      shop,
      customerId,
      customerEmail,
      configurationsCount: configurations.length,
      inquiriesCount: inquiries.length,
    });

    // In production, you would:
    // 1. Generate a JSON/CSV file with all customer data
    // 2. Upload to S3 or similar
    // 3. Email download link to customer
    // 4. Log the export for audit trail

    // For now, just log and acknowledge
    return new Response("Customer data request acknowledged", { status: 200 });
  } catch (error) {
    console.error("Error processing customer data request:", error);
    return new Response("Error processing request", { status: 500 });
  }
};
