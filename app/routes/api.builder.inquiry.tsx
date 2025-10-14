/**
 * Builder API: Customer Inquiry
 *
 * Phase 2.0: Submit customer inquiries (hint, info, email, viewing).
 *
 * Features:
 * - Validates inquiry data
 * - Saves to database
 * - Sends appropriate email
 * - Returns success status
 */

import type { ActionFunctionArgs } from "react-router";
import {
  createInquiry,
  type CreateInquiryInput,
} from "~/services/inquiry.server";
import type { InquiryType } from "~/types/builder";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // Parse common fields
  const shop = formData.get("shop") as string;
  const type = formData.get("type") as InquiryType;
  const configurationId = formData.get("configurationId") as string | null;
  const productId = formData.get("productId") as string | null;

  if (!shop || !type) {
    return Response.json(
      { success: false, error: "Missing shop or type parameter" },
      { status: 400 },
    );
  }

  // Validate inquiry type
  if (!["hint", "info", "email", "viewing"].includes(type)) {
    return Response.json(
      { success: false, error: "Invalid inquiry type" },
      { status: 400 },
    );
  }

  try {
    // Build inquiry data based on type
    const inquiryData: CreateInquiryInput = {
      shop,
      type,
      configurationId: configurationId || undefined,
      productId: productId || undefined,
      customerEmail: "", // Will be set below based on type
    };

    // Type-specific field parsing
    if (type === "hint") {
      inquiryData.recipientEmail = formData.get("recipientEmail") as string;
      inquiryData.senderName = formData.get("senderName") as string;
      inquiryData.message = (formData.get("message") as string) || undefined;
      inquiryData.specialDate =
        (formData.get("specialDate") as string) || undefined;
      inquiryData.customerEmail =
        inquiryData.senderName || "anonymous@hint.local";

      if (!inquiryData.recipientEmail) {
        return Response.json(
          { success: false, error: "Recipient email is required for hints" },
          { status: 400 },
        );
      }
    } else if (type === "info") {
      inquiryData.customerName = formData.get("customerName") as string;
      inquiryData.customerEmail = formData.get("customerEmail") as string;
      inquiryData.customerPhone =
        (formData.get("customerPhone") as string) || undefined;
      inquiryData.question = formData.get("question") as string;

      if (!inquiryData.customerEmail || !inquiryData.customerName) {
        return Response.json(
          { success: false, error: "Name and email are required" },
          { status: 400 },
        );
      }
    } else if (type === "email") {
      inquiryData.recipientEmail = formData.get("recipientEmail") as string;
      inquiryData.senderName = formData.get("senderName") as string;
      inquiryData.message = (formData.get("message") as string) || undefined;
      inquiryData.customerEmail =
        (formData.get("senderEmail") as string) ||
        inquiryData.senderName ||
        "anonymous@email.local";

      if (!inquiryData.recipientEmail || !inquiryData.senderName) {
        return Response.json(
          {
            success: false,
            error: "Friend's email and your name are required",
          },
          { status: 400 },
        );
      }
    } else if (type === "viewing") {
      inquiryData.customerName = formData.get("customerName") as string;
      inquiryData.customerEmail = formData.get("customerEmail") as string;
      inquiryData.customerPhone =
        (formData.get("customerPhone") as string) || undefined;
      inquiryData.preferredDate = formData.get("preferredDate") as string;
      inquiryData.preferredTime = formData.get("preferredTime") as string;
      inquiryData.message = (formData.get("message") as string) || undefined;

      if (
        !inquiryData.customerEmail ||
        !inquiryData.customerName ||
        !inquiryData.preferredDate ||
        !inquiryData.preferredTime
      ) {
        return Response.json(
          {
            success: false,
            error:
              "Name, email, date, and time are required for viewing appointments",
          },
          { status: 400 },
        );
      }
    }

    // Create inquiry (also sends email)
    const inquiry = await createInquiry(inquiryData);

    // Success message based on type
    const successMessages = {
      hint: "Your hint has been sent!",
      info: "Your question has been sent to our team. We'll respond shortly!",
      email: "Ring details sent to your friend!",
      viewing: "Viewing request sent! We'll confirm your appointment soon.",
    };

    return Response.json({
      success: true,
      inquiryId: inquiry.id,
      message: successMessages[type],
    });
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to submit inquiry",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
