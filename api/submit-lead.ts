import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const CRM_WEBHOOK_URL = (process.env.PRIVYR_WEBHOOK_URL || "").trim();
const RESEND_API_KEY = (process.env.RESEND_API_KEY || "").trim();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim();
const FROM_EMAIL = (process.env.FROM_EMAIL || "").trim();
const COMPANY_NAME = (process.env.SITE_NAME || "GoldenHeart Marketplace").trim();

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function hasValidWebhook(url: string) {
  return (
    Boolean(url) &&
    url.startsWith("http") &&
    !url.includes("replace-with-your-real-webhook") &&
    !url.includes("your-webhook") &&
    !url.includes("...")
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendUserConfirmationEmail(data: {
  fullName: string;
  email: string;
  businessName: string;
  businessType: string;
  country: string;
}) {
  if (!RESEND_API_KEY || !FROM_EMAIL || !isValidEmail(data.email)) {
    console.warn("[WARN] Skipping user confirmation email: missing config or invalid email");
    return;
  }

  try {
    const firstName = data.fullName.trim().split(/\s+/)[0] || data.fullName;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `🎉 Welcome to ${COMPANY_NAME}! Your Application Has Been Received`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${COMPANY_NAME}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #D4A017; padding: 32px 40px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
                          Welcome to ${COMPANY_NAME}
                        </h1>
                      </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 24px; font-size: 18px; line-height: 1.6; color: #1f2937;">
                          Hi <strong>${firstName}</strong>,
                        </p>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                          Thank you for applying to join the ${COMPANY_NAME} vendor network! We're thrilled to have you on board.
                        </p>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                          We've received your application with the following details:
                        </p>
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #374151;">
                              <strong>Business Name:</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #1f2937; text-align: right;">
                              ${data.businessName}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #374151;">
                              <strong>Business Type:</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #1f2937; text-align: right;">
                              ${data.businessType}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #374151;">
                              <strong>Country:</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #1f2937; text-align: right;">
                              ${data.country}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; font-size: 15px; color: #374151;">
                              <strong>Email:</strong>
                            </td>
                            <td style="padding: 12px 0; font-size: 15px; color: #1f2937; text-align: right;">
                              ${data.email}
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                          Our team will review your application and get in touch with you shortly to guide you through the next steps.
                        </p>
                        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                          If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:${ADMIN_EMAIL}" style="color: #D4A017; text-decoration: none; font-weight: 600;">${ADMIN_EMAIL}</a>.
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                          ${COMPANY_NAME} Team
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                          © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log(`[INFO] User confirmation email sent to ${data.email}`);
  } catch (error) {
    console.error("[ERROR] Failed to send user confirmation email:", error);
  }
}

async function sendAdminNotificationEmail(data: {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  country: string;
}) {
  if (!RESEND_API_KEY || !ADMIN_EMAIL || !FROM_EMAIL || !isValidEmail(ADMIN_EMAIL)) {
    console.warn("[WARN] Skipping admin notification email: missing config or invalid admin email");
    return;
  }

  try {
    const firstName = data.fullName.trim().split(/\s+/)[0] || data.fullName;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🆕 New Vendor Application – ${data.businessName} (${data.businessType})`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Vendor Application – ${COMPANY_NAME}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #D4A017; padding: 32px 40px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
                          🆕 New Vendor Application
                        </h1>
                      </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                          A new vendor has applied to join the <strong>${COMPANY_NAME}</strong> marketplace. Here are the details:
                        </p>
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #374151;">
                              <strong>Full Name:</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #1f2937; text-align: right;">
                              ${data.fullName}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #374151;">
                              <strong>Business Name:</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #1f2937; text-align: right;">
                              ${data.businessName}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #374151;">
                              <strong>Business Type:</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #1f2937; text-align: right;">
                              ${data.businessType}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #374151;">
                              <strong>Email:</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #1f2937; text-align: right;">
                              <a href="mailto:${data.email}" style="color: #D4A017; text-decoration: none; font-weight: 600;">${data.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #374151;">
                              <strong>Phone:</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #1f2937; text-align: right;">
                              <a href="tel:${data.phone}" style="color: #D4A017; text-decoration: none; font-weight: 600;">${data.phone}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; font-size: 15px; color: #374151;">
                              <strong>Country:</strong>
                            </td>
                            <td style="padding: 12px 0; font-size: 15px; color: #1f2937; text-align: right;">
                              ${data.country}
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                          You can manage this lead in <a href="https://www.privyr.com" style="color: #D4A017; text-decoration: none; font-weight: 600;">Privyr CRM</a>.
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                          This notification was sent from ${COMPANY_NAME}
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                          © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log(`[INFO] Admin notification email sent to ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error("[ERROR] Failed to send admin notification email:", error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for local development (proxy) and production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { fullName, businessName, email, phone, businessType, country } = req.body;

  if (!fullName || !businessName || !email || !phone || !businessType || !country) {
    return res.status(400).json({
      success: false,
      error: "Please fill in all required fields.",
    });
  }

  if (!hasValidWebhook(CRM_WEBHOOK_URL)) {
    console.error("[ERROR] CRM webhook URL is missing or invalid.");
    return res.status(500).json({
      success: false,
      error: "The CRM webhook is not configured on the server yet.",
    });
  }

  try {
    const displayName = fullName.trim().split(/\s+/)[0] || fullName;
    const privyrPayload = {
      name: fullName,
      display_name: displayName,
      email,
      phone,
      other_fields: {
        "Business Name": businessName,
        "Business Type": businessType,
        Country: country,
        Source: "GoldenHeart Landing Page",
        Notes: "Lead from GoldenHeart Marketplace onboarding.",
      },
    };

    const response = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(privyrPayload),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    console.log(`[INFO] New lead received for ${businessName}.`);

    // Send confirmation email to user (fire-and-forget, don't block response)
    sendUserConfirmationEmail({ fullName, businessName, email, businessType, country }).catch((err) =>
      console.error("[ERROR] User email failed:", err)
    );

    // Send notification email to admin (fire-and-forget, don't block response)
    sendAdminNotificationEmail({ fullName, businessName, email, phone, businessType, country }).catch((err) =>
      console.error("[ERROR] Admin email failed:", err)
    );

    return res.json({ success: true, message: "Lead submitted successfully" });
  } catch (error) {
    console.error("[ERROR] Privyr webhook delivery failed.", error);
    return res.status(500).json({
      success: false,
      error: "We could not send your application right now. Please try again later.",
    });
  }
}
