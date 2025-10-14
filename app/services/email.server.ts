/**
 * Email Service
 *
 * Phase 2.0: Email sending for save/share and customer engagement features.
 *
 * Note: This is a simplified version that logs emails to console.
 * For production, integrate with SendGrid, AWS SES, or Postmark.
 *
 * To enable real email sending:
 * 1. npm install @sendgrid/mail
 * 2. Set SENDGRID_API_KEY environment variable
 * 3. Uncomment SendGrid integration below
 */

// Uncomment for SendGrid integration:
// import sgMail from "@sendgrid/mail";
// if (process.env.SENDGRID_API_KEY) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// }

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

/**
 * Send an email
 *
 * @param options - Email options
 * @returns Success status
 */
export async function sendEmail(
  options: EmailOptions,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const fromAddress =
    options.from || process.env.EMAIL_FROM_ADDRESS || "noreply@ringbuilder.app";
  const fromName = process.env.EMAIL_FROM_NAME || "Ring Builder";

  console.log("=================================================");
  console.log("📧 EMAIL SERVICE");
  console.log("=================================================");
  console.log("To:", options.to);
  console.log("From:", `${fromName} <${fromAddress}>`);
  console.log("Subject:", options.subject);
  console.log("Attachments:", options.attachments?.length || 0);
  console.log("=================================================");

  // TODO: Integrate with real email service
  // For now, just log to console and return success

  // SendGrid integration (uncomment when ready):
  /*
  try {
    if (process.env.SENDGRID_API_KEY) {
      const msg = {
        to: options.to,
        from: {
          email: fromAddress,
          name: fromName,
        },
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      };

      const result = await sgMail.send(msg);
      return { success: true, messageId: result[0].headers['x-message-id'] };
    }
  } catch (error: any) {
    console.error("SendGrid error:", error);
    return { success: false, error: error.message };
  }
  */

  // Development mode: Log and return success
  console.log("✅ Email logged (development mode)");
  console.log("To enable real sending:");
  console.log("1. npm install @sendgrid/mail");
  console.log("2. Set SENDGRID_API_KEY in environment");
  console.log("3. Uncomment SendGrid code in email.server.ts");

  return {
    success: true,
    messageId: `dev-${Date.now()}`,
  };
}

/**
 * Send share configuration email
 */
export async function sendShareEmail(
  recipientEmail: string,
  senderName: string,
  message: string,
  configurationUrl: string,
  configDetails: {
    settingName: string;
    stoneCarat: number;
    stoneShape: string;
    metalType: string;
    totalPrice: number;
  },
): Promise<{ success: boolean; error?: string }> {
  const subject = `${senderName} wants to share a ring with you!`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Someone wants to share a beautiful ring with you!</h2>
      <p>Hi there,</p>
      <p><strong>${senderName}</strong> found a beautiful ring and wanted to share it with you!</p>

      <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Ring Details</h3>
        <p><strong>Setting:</strong> ${configDetails.settingName}</p>
        <p><strong>Metal:</strong> ${configDetails.metalType.replace(/_/g, " ").toUpperCase()}</p>
        <p><strong>Diamond:</strong> ${configDetails.stoneCarat}ct ${configDetails.stoneShape}</p>
        <p><strong>Price:</strong> $${configDetails.totalPrice.toLocaleString()}</p>
      </div>

      ${message ? `<p><em>"${message}"</em></p>` : ""}

      <p>
        <a href="${configurationUrl}" style="display: inline-block; background: #6D2932; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Full Details
        </a>
      </p>

      <p style="color: #999; font-size: 0.9em; margin-top: 40px;">
        This ring was designed using Ring Builder.
      </p>
    </div>
  `;

  return await sendEmail({
    to: recipientEmail,
    subject,
    html,
  });
}

/**
 * Send "drop a hint" email (no pricing)
 */
export async function sendHintEmail(
  recipientEmail: string,
  senderName: string,
  message: string,
  configurationUrl: string,
  specialDate?: string,
): Promise<{ success: boolean; error?: string }> {
  const subject = "Someone has dropped you a hint! 💍";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6D2932;">💕 Someone has dropped you a hint!</h2>
      <p>Hi there,</p>
      <p>Someone special has dropped you a hint about a ring they love!</p>

      <div style="background: #fff5f7; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #6D2932;">
        <p style="font-size: 1.2em; color: #6D2932; font-style: italic;">
          "I love this ring and would be thrilled to receive it as a gift!"
        </p>
      </div>

      ${message ? `<p><strong>Special Note:</strong> ${message}</p>` : ""}
      ${specialDate ? `<p><strong>Special Date:</strong> ${specialDate}</p>` : ""}

      <p>
        <a href="${configurationUrl}" style="display: inline-block; background: #6D2932; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View This Ring
        </a>
      </p>

      <p><em>From: ${senderName === "Anonymous" ? "Someone Special ❤️" : senderName}</em></p>

      <p style="color: #999; font-size: 0.85em; margin-top: 40px;">
        Note: Price information is hidden in hint emails.
      </p>
    </div>
  `;

  return await sendEmail({
    to: recipientEmail,
    subject,
    html,
  });
}

/**
 * Send request for more info email (to merchant)
 */
export async function sendInfoRequestEmail(
  merchantEmail: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string | null,
  question: string,
  configurationId: string,
): Promise<{ success: boolean; error?: string }> {
  const subject = `🔔 Customer Inquiry about Configuration ${configurationId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Customer Inquiry</h2>
      <p>You have a new inquiry from a potential customer!</p>

      <div style="background: #f7f7f7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        ${customerPhone ? `<p><strong>Phone:</strong> ${customerPhone}</p>` : ""}
      </div>

      <div style="background: #fff9e6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3>Configuration Details</h3>
        <p><strong>Config ID:</strong> ${configurationId}</p>
      </div>

      <div style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3>Customer's Question</h3>
        <p style="font-style: italic;">"${question}"</p>
      </div>

      <p>
        <a href="mailto:${customerEmail}" style="display: inline-block; background: #6D2932; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Reply to Customer
        </a>
      </p>

      <p style="color: #999; font-size: 0.9em; margin-top: 40px;">
        Inquiry submitted: ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  return await sendEmail({
    to: merchantEmail,
    subject,
    html,
  });
}

/**
 * Send schedule viewing email (to merchant with iCal)
 */
export async function sendScheduleViewingEmail(
  merchantEmail: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string | null,
  preferredDate: string,
  preferredTime: string,
  message: string | null,
  configurationId: string,
): Promise<{ success: boolean; error?: string }> {
  const subject = `📅 Viewing Request from ${customerName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${customerName} would like to schedule an in-store viewing!</h2>

      <div style="background: #f7f7f7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        ${customerPhone ? `<p><strong>Phone:</strong> ${customerPhone}</p>` : ""}
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime}</p>
      </div>

      <div style="background: #fff9e6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3>Configuration</h3>
        <p><strong>Config ID:</strong> ${configurationId}</p>
      </div>

      ${
        message
          ? `
        <div style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3>Note from Customer</h3>
          <p style="font-style: italic;">"${message}"</p>
        </div>
      `
          : ""
      }

      <p>
        <a href="mailto:${customerEmail}" style="display: inline-block; background: #6D2932; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Confirm Appointment
        </a>
      </p>
    </div>
  `;

  // TODO: Add iCal attachment when ical-generator is installed

  return await sendEmail({
    to: merchantEmail,
    subject,
    html,
  });
}
