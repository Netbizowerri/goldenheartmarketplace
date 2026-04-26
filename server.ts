import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { cert, initializeApp, getApps, type AppOptions, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import axios from "axios";
import { buildSiteContent } from "./shared/site-content";
import { leadSchema } from "./shared/schemas";

dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const siteContent = buildSiteContent(process.env);
const CRM_WEBHOOK_URL = (process.env.PRIVYR_WEBHOOK_URL || "").trim();

function hasValidWebhook(url: string) {
  return Boolean(url) && url.startsWith("http") && !url.includes("replace-with-your-real-webhook") && !url.includes("your-webhook") && !url.includes("...");
}

function getFirebaseAdminOptions(): AppOptions {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();

  if (serviceAccountPath) {
    const resolvedPath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.resolve(process.cwd(), serviceAccountPath);
    const fileContents = fs.readFileSync(resolvedPath, "utf8");
    const parsed = JSON.parse(fileContents) as ServiceAccount;
    return {
      credential: cert(parsed),
      projectId: parsed.projectId || projectId,
    };
  }

  if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson) as ServiceAccount;
    return {
      credential: cert(parsed),
      projectId: parsed.projectId || projectId,
    };
  }

  return { projectId };
}

function buildPrivyrPayload(lead: {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  country: string;
}) {
  const displayName = lead.fullName.trim().split(/\s+/)[0] || lead.fullName;

  return {
    name: lead.fullName,
    display_name: displayName,
    email: lead.email,
    phone: lead.phone,
    other_fields: {
      "Business Name": lead.businessName,
      "Business Type": lead.businessType,
      Country: lead.country,
      Source: "GoldenHeart Landing Page",
      Notes: `Lead from GoldenHeart Marketplace onboarding.`,
    },
  };
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

try {
  if (!getApps().length) {
    initializeApp(getFirebaseAdminOptions());
  }
} catch (error) {
  writeLog("ERROR", "Firebase Admin initialization failed.", error);
}

const db = getFirestore();
const app = express();

app.use(express.json());

app.get("/api/site-content", (_req, res) => {
  res.json(siteContent);
});

app.post("/api/submit-lead", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0]?.message || "Please review the form and try again.",
    });
  }

  try {
    const { fullName, businessName, email, phone, businessType, country } = parsed.data;
    const privyrUrl = CRM_WEBHOOK_URL;
    const webhookConfigured = hasValidWebhook(privyrUrl);
    let webhookDelivered = false;
    let webhookError = "";

    if (!webhookConfigured) {
      writeLog("ERROR", "CRM webhook URL is missing or invalid.");
      return res.status(500).json({
        success: false,
        error: "The CRM webhook is not configured on the server yet. Add your real Privyr webhook URL and try again.",
      });
    }

    try {
      await axios.post(privyrUrl, buildPrivyrPayload({
        fullName,
        businessName,
        email,
        phone,
        businessType,
        country,
      }), {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      });
      webhookDelivered = true;
    } catch (privyrError) {
      writeLog("ERROR", "Privyr webhook delivery failed.", privyrError);
      webhookError = "We could not send your application to the CRM webhook. Please check the webhook URL and try again.";
    }

    try {
      const duplicateSnapshot = await db.collection("merchant_leads").where("email", "==", email).limit(1).get();
      if (!duplicateSnapshot.empty) {
        if (webhookDelivered) {
          return res.json({ success: true, message: "Lead submitted successfully" });
        }

        return res.status(409).json({
          success: false,
          error: "This email address has already been used for an application.",
        });
      }

      const leadRef = db.collection("merchant_leads").doc();
      const leadData = {
        fullName,
        businessName,
        email,
        phone,
        businessType,
        country,
        status: "new",
        source: "landing_page",
        submittedAt: Timestamp.now(),
      };
      await leadRef.set(leadData);
    } catch (databaseError) {
      writeLog("ERROR", "Lead storage failed.", databaseError);

      if (!webhookDelivered && webhookError) {
        return res.status(500).json({
          success: false,
          error: webhookError,
        });
      }
    }

    if (!webhookDelivered) {
      return res.status(500).json({
        success: false,
        error: webhookError || "We could not send your application to the CRM webhook right now. Please try again.",
      });
    }

    writeLog("INFO", `New lead received for ${businessName}.`);
    return res.json({ success: true, message: "Lead submitted successfully" });
  } catch (error) {
    writeLog("ERROR", "Lead submission failed.", error);
    return res.status(500).json({ success: false, error: "We could not submit your application right now. Please try again." });
  }
});

app.get("/api/admin/leads", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please sign in to continue." });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = await getAuth().verifyIdToken(token);
  } catch (error) {
    writeLog("ERROR", "Admin token verification failed.", error);
    return res.status(401).json({ error: "Your admin session could not be verified. Sign in again after restarting the server." });
  }

  if (ADMIN_EMAIL && decodedToken.email?.toLowerCase() !== ADMIN_EMAIL) {
    writeLog("ERROR", "Admin access denied due to email mismatch.", {
      expectedAdminEmail: ADMIN_EMAIL,
      tokenEmail: decodedToken.email || null,
      uid: decodedToken.uid,
    });
    return res.status(403).json({ error: `Access denied for ${decodedToken.email || "this account"}.` });
  }

  try {
    const snapshot = await db.collection("merchant_leads").orderBy("submittedAt", "desc").get();
    const leads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.json(leads);
  } catch (error) {
    writeLog("ERROR", "Admin lead fetch failed.", error);
    return res.status(500).json({ error: "Signed in, but the server could not load merchant leads." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    writeLog("INFO", `Server running at http://localhost:${PORT}`);
  });
}

void startServer();
