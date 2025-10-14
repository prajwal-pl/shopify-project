/**
 * Inquiry Service
 *
 * Phase 2.0: Customer inquiry management service.
 *
 * Features:
 * - Create inquiries
 * - Get inquiries with filtering
 * - Update inquiry status
 * - Generate iCal attachments
 */

import prisma from "~/db.server";
import type { InquiryType, InquiryStatus } from "~/types/builder";
import {
  sendHintEmail,
  sendInfoRequestEmail,
  sendShareEmail,
  sendScheduleViewingEmail,
} from "./email.server";

export interface CreateInquiryInput {
  shop: string;
  type: InquiryType;
  configurationId?: string;
  productId?: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  recipientEmail?: string; // For hints and email friend
  senderName?: string; // For hints and email friend
  specialDate?: string; // For hints
  question?: string; // For info requests
}

/**
 * Create a new customer inquiry
 *
 * @param data - Inquiry data
 * @returns Created inquiry
 */
export async function createInquiry(data: CreateInquiryInput) {
  const inquiry = await prisma.customerInquiry.create({
    data: {
      shop: data.shop,
      type: data.type,
      configurationId: data.configurationId,
      productId: data.productId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      message: data.message || data.question,
      preferredDate: data.preferredDate
        ? new Date(data.preferredDate)
        : undefined,
      preferredTime: data.preferredTime,
      status: "new",
    },
  });

  // Send appropriate email based on inquiry type
  const merchantEmail = process.env.MERCHANT_EMAIL || "merchant@example.com";

  try {
    if (data.type === "hint" && data.recipientEmail && data.senderName) {
      await sendHintEmail(
        data.recipientEmail,
        data.senderName,
        data.message || "",
        `https://${data.shop}/builder/saved/${data.configurationId}`,
        data.specialDate,
      );
    } else if (data.type === "info") {
      await sendInfoRequestEmail(
        merchantEmail,
        data.customerName || "Anonymous",
        data.customerEmail,
        data.customerPhone || null,
        data.question || data.message || "",
        data.configurationId || "N/A",
      );
    } else if (
      data.type === "email" &&
      data.recipientEmail &&
      data.senderName
    ) {
      // Use share email for email friend
      await sendShareEmail(
        data.recipientEmail,
        data.senderName,
        data.message || "",
        `https://${data.shop}/builder/saved/${data.configurationId}`,
        {
          settingName: "Ring Setting",
          stoneCarat: 1.5,
          stoneShape: "round",
          metalType: "14k_white_gold",
          totalPrice: 5000,
        },
      );
    } else if (
      data.type === "viewing" &&
      data.preferredDate &&
      data.preferredTime
    ) {
      await sendScheduleViewingEmail(
        merchantEmail,
        data.customerName || "Anonymous",
        data.customerEmail,
        data.customerPhone || null,
        data.preferredDate,
        data.preferredTime,
        data.message || null,
        data.configurationId || "N/A",
      );
    }
  } catch (emailError) {
    console.error("Error sending inquiry email:", emailError);
    // Don't fail the inquiry creation if email fails
  }

  return inquiry;
}

/**
 * Get inquiries with filtering
 *
 * @param shop - Shop domain
 * @param filters - Filter options
 * @returns List of inquiries
 */
export async function getInquiries(
  shop: string,
  filters?: {
    type?: InquiryType;
    status?: InquiryStatus;
    limit?: number;
  },
) {
  const where: any = { shop };

  if (filters?.type) {
    where.type = filters.type;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  const inquiries = await prisma.customerInquiry.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: filters?.limit || 50,
  });

  return inquiries;
}

/**
 * Update inquiry status
 *
 * @param id - Inquiry ID
 * @param status - New status
 * @returns Updated inquiry
 */
export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const inquiry = await prisma.customerInquiry.update({
    where: { id },
    data: { status },
  });

  return inquiry;
}

/**
 * Generate iCal attachment for calendar invite
 *
 * @param date - Appointment date
 * @param time - Appointment time
 * @param customerName - Customer name
 * @param customerEmail - Customer email
 * @param configId - Configuration ID
 * @returns iCal string
 */
export function generateICalAttachment(
  date: string,
  time: string,
  customerName: string,
  customerEmail: string,
  configId: string,
): string {
  // Simple iCal format (can be enhanced with ical-generator library)
  const startDate = new Date(date);
  const [hours, minutes] = parseTime(time);
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1); // 1-hour appointment

  const formatDate = (d: Date): string => {
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ring Builder//Viewing Appointment//EN
BEGIN:VEVENT
UID:${configId}-${Date.now()}@ringbuilder.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Ring Viewing - ${customerName}
DESCRIPTION:Ring viewing appointment for Configuration ${configId}
ORGANIZER:mailto:merchant@example.com
ATTENDEE:mailto:${customerEmail}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  return ical;
}

/**
 * Parse time string (e.g., "2:00 PM") to hours and minutes
 */
function parseTime(timeStr: string): [number, number] {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return [14, 0]; // Default: 2:00 PM

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) {
    hours += 12;
  } else if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  return [hours, minutes];
}
