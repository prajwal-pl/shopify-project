/**
 * GDPR Webhook: Customer Redact
 *
 * Handles customer data deletion requests for GDPR compliance.
 * Must delete customer data within 30 days.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, payload } = await authenticate.webhook(request);

  console.log("Received customers/redact webhook for", shop);

  try {
    const customerId = (payload as any).customer?.id;
    const customerEmail = (payload as any).customer?.email;

    // Delete all customer data
    const [configurationsDeleted, inquiriesDeleted] = await Promise.all([
      prisma.configuration.deleteMany({
        where: {
          shop,
          OR: [{ customerId }, { customerEmail }],
        },
      }),
      prisma.customerInquiry.deleteMany({
        where: {
          shop,
          customerEmail,
        },
      }),
    ]);

    console.log("Customer data deleted:", {
      shop,
      customerId,
      customerEmail,
      configurationsDeleted: configurationsDeleted.count,
      inquiriesDeleted: inquiriesDeleted.count,
    });

    return new Response("Customer data deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting customer data:", error);
    return new Response("Error deleting data", { status: 500 });
  }
};
