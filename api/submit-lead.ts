import type { VercelRequest, VercelResponse } from "@vercel/node";

const CRM_WEBHOOK_URL = (process.env.PRIVYR_WEBHOOK_URL || "").trim();

function hasValidWebhook(url: string) {
  return (
    Boolean(url) &&
    url.startsWith("http") &&
    !url.includes("replace-with-your-real-webhook") &&
    !url.includes("your-webhook") &&
    !url.includes("...")
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    return res.json({ success: true, message: "Lead submitted successfully" });
  } catch (error) {
    console.error("[ERROR] Privyr webhook delivery failed.", error);
    return res.status(500).json({
      success: false,
      error: "We could not send your application right now. Please try again later.",
    });
  }
}
