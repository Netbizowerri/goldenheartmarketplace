import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import { buildSiteContent } from "./shared/site-content";

dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const siteContent = buildSiteContent(process.env);
const CRM_WEBHOOK_URL = (process.env.PRIVYR_WEBHOOK_URL || "").trim();

function hasValidWebhook(url: string) {
  return Boolean(url) && url.startsWith("http") && !url.includes("replace-with-your-real-webhook") && !url.includes("your-webhook") && !url.includes("...");
}

function writeLog(level: "INFO" | "ERROR", message: string, details?: unknown) {
  const line = `[${level}] ${message}`;
  const stream = level === "ERROR" ? process.stderr : process.stdout;
  stream.write(`${line}\n`);
  if (details) {
    const serialized = details instanceof Error ? details.message : JSON.stringify(details);
    if (serialized) {
      stream.write(`${serialized}\n`);
    }
  }
}

const app = express();

app.use(express.json());

app.get("/api/site-content", (_req, res) => {
  res.json(siteContent);
});

app.post("/api/submit-lead", async (req, res) => {
  const { fullName, businessName, email, phone, businessType, country } = req.body;

  if (!fullName || !businessName || !email || !phone || !businessType || !country) {
    return res.status(400).json({
      success: false,
      error: "Please fill in all required fields.",
    });
  }

  const privyrUrl = CRM_WEBHOOK_URL;
  const webhookConfigured = hasValidWebhook(privyrUrl);

  if (!webhookConfigured) {
    writeLog("ERROR", "CRM webhook URL is missing or invalid.");
    return res.status(500).json({
      success: false,
      error: "The CRM webhook is not configured on the server yet. Add your real Privyr webhook URL and try again.",
    });
  }

  try {
    const displayName = fullName.trim().split(/\s+/)[0] || fullName;
    const privyrPayload = {
      name: fullName,
      display_name: displayName,
      email: email,
      phone: phone,
      other_fields: {
        "Business Name": businessName,
        "Business Type": businessType,
        Country: country,
        Source: "GoldenHeart Landing Page",
        Notes: `Lead from GoldenHeart Marketplace onboarding.`,
      },
    };

    await axios.post(privyrUrl, privyrPayload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    writeLog("INFO", `New lead received for ${businessName}.`);
    return res.json({ success: true, message: "Lead submitted successfully" });
  } catch (error) {
    writeLog("ERROR", "Privyr webhook delivery failed.", error);
    return res.status(500).json({
      success: false,
      error: "We could not send your application to the CRM webhook. Please check the webhook URL and try again.",
    });
  }
});

let appInstance: express.Express | null = null;

async function createExpressApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
   } else {
     const distPath = path.join(__dirname, "dist");
     app.use(express.static(distPath));
     app.get("*", (_req, res) => {
       res.sendFile(path.join(distPath, "index.html"), (err: any) => {
         if (err) {
           writeLog("ERROR", "Failed to serve index.html from dist", err);
           res.status(500).json({ error: "Server configuration error" });
         }
       });
     });
   }

  return app;
}

export default async function handler(req: any, res: any) {
  if (!appInstance) {
    appInstance = await createExpressApp();
  }
  appInstance(req, res);
}

if (process.env.NODE_ENV === "development") {
  createExpressApp().then(app => {
    app.listen(PORT, "0.0.0.0", () => {
      writeLog("INFO", `Server running at http://localhost:${PORT}`);
    });
  }).catch(err => {
    writeLog("ERROR", "Failed to start dev server", err);
    throw err;
  });
}
