import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "1mb" }));

const catalog = {
  "Simple Discord Bot": { price: "€1", robux: "100 Robux" },
  "Medium Discord Bot": { price: "€3", robux: "300 Robux" },
  "Advanced Discord Bot": { price: "€7", robux: "700 Robux" },
  "Simple App": { price: "€2", robux: "200 Robux" },
  "Medium App": { price: "€5", robux: "500 Robux" },
  "Advanced App": { price: "€10+", robux: "Custom" },
  "Simple Website": { price: "€2", robux: "200 Robux" },
  "Standard Website": { price: "€5", robux: "500 Robux" },
  "Premium Website": { price: "€10+", robux: "Custom" },
  "Basic Discord Server": { price: "€1", robux: "100 Robux" },
  "Premium Discord Server": { price: "€3", robux: "300 Robux" },
  "Ultimate Discord Server": { price: "€7+", robux: "Custom" },
  "Simple Roblox Script": { price: "€1", robux: "100 Robux" },
  "Medium Roblox System": { price: "€3", robux: "300 Robux" },
  "Advanced Roblox System": { price: "€7+", robux: "Custom" }
};

function getQuote(service) {
  return catalog[service] || { price: "Custom", robux: "Custom quote" };
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function customerEmail({ name, email, service, budget, message, orderId }) {
  const quote = getQuote(service);
  const discord = process.env.DISCORD_INVITE || "";
  const payment = process.env.PAYMENT_LINK || "";
  const provider = process.env.PAYMENT_PROVIDER || "PayPal";

  return {
    subject: `🚀 VEXFOUNDRY • We received your order #${orderId}`,
    html: `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#07030f;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
  <div style="display:none;max-height:0;overflow:hidden;">Your VEXFOUNDRY project request has been received.</div>
  <div style="padding:32px 12px;background:radial-gradient(circle at top,#3a1267 0%,#13071f 45%,#07030f 100%);">
    <div style="max-width:680px;margin:auto;background:rgba(16,8,28,.96);border:1px solid #6d35a7;border-radius:24px;overflow:hidden;box-shadow:0 0 60px rgba(150,70,255,.28);">
      <div style="padding:36px 34px;background:linear-gradient(135deg,#7d2cff,#b24cff);">
        <div style="font-size:13px;letter-spacing:3px;font-weight:800;color:#f3eaff;">VEXFOUNDRY ORDER SYSTEM</div>
        <h1 style="margin:16px 0 8px;font-size:34px;line-height:1.05;">🚀 ORDER RECEIVED!</h1>
        <p style="margin:0;color:#f5eefe;font-size:16px;">Your idea has officially entered the VEXFOUNDRY system.</p>
      </div>

      <div style="padding:34px;">
        <p style="font-size:17px;line-height:1.7;">Hey <strong>${escapeHtml(name)}</strong> 👋</p>
        <p style="color:#d9cce8;line-height:1.7;">Congratulations! 🎉 We successfully received your project request. Please keep this email — your order ID is <strong style="color:#c995ff;">#${orderId}</strong>.</p>

        <div style="margin:28px 0;padding:22px;border-radius:18px;background:#0a0612;border:1px solid #38234d;">
          <div style="font-size:12px;letter-spacing:2px;color:#bfa8d6;font-weight:bold;">YOUR REQUEST</div>
          <p style="margin:16px 0 0;"><strong>📦 Service:</strong> ${escapeHtml(service)}</p>
          <p style="margin:12px 0 0;"><strong>💶 Starting price:</strong> <span style="color:#c995ff;font-weight:bold;">${escapeHtml(quote.price)}</span></p>
          <p style="margin:12px 0 0;"><strong>🎮 Alternative:</strong> ${escapeHtml(quote.robux)}</p>
          <p style="margin:12px 0 0;"><strong>💰 Your budget:</strong> ${escapeHtml(budget || "Not specified")}</p>
          <p style="margin:12px 0 0;"><strong>📝 Description:</strong><br><span style="color:#d9cce8;">${escapeHtml(message)}</span></p>
        </div>

        <div style="margin:28px 0;padding:22px;border-left:4px solid #c995ff;border-radius:12px;background:#160d24;">
          <h2 style="margin:0 0 10px;font-size:20px;">⚠️ IMPORTANT — DO NOT PAY YET</h2>
          <p style="margin:0;color:#d9cce8;line-height:1.7;">Your order is received, but it is <strong>not paid or finally confirmed yet</strong>. First we need to discuss the exact features, final price, development time and payment method.</p>
        </div>

        <h2 style="font-size:20px;">What happens next? ✨</h2>
        <ol style="padding-left:22px;color:#d9cce8;line-height:1.9;">
          <li>We review your idea.</li>
          <li>We discuss the details and final price.</li>
          <li>We agree on everything together.</li>
          <li>Only then should you make the payment.</li>
        </ol>

        ${payment ? `<div style="text-align:center;margin:30px 0 14px;"><a href="${payment}" style="display:inline-block;padding:15px 24px;border-radius:14px;background:linear-gradient(135deg,#8d37ff,#c14dff);color:#fff;text-decoration:none;font-weight:bold;box-shadow:0 0 25px rgba(174,79,255,.4);">💳 OPEN ${escapeHtml(provider).toUpperCase()} PAYMENT PAGE</a><p style="font-size:12px;color:#9f8aad;margin-top:12px;">This link is provided for convenience. Please wait for the final agreed price before paying.</p></div>` : ""}

        ${discord ? `<div style="text-align:center;margin:24px 0;"><a href="${discord}" style="color:#c995ff;font-weight:bold;text-decoration:none;">💬 Join the VEXFOUNDRY Discord</a></div>` : ""}

        <div style="border-top:1px solid #38234d;margin-top:28px;padding-top:20px;color:#8f7ca1;font-size:12px;text-align:center;">
          Sent automatically by the VEXFOUNDRY Order Bot • Please do not reply directly to this automated email unless instructed.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  };
}

function ownerEmail({ name, email, service, budget, message, orderId }) {
  const quote = getQuote(service);
  return {
    subject: `🔥 NEW VEXFOUNDRY ORDER #${orderId} • ${service}`,
    html: `<div style="font-family:Arial,sans-serif;background:#0b0712;color:#fff;padding:30px">
      <div style="max-width:700px;margin:auto;background:#151020;padding:30px;border-radius:18px;border:1px solid #6d35a7">
      <h1 style="color:#c995ff">🔥 NEW ORDER RECEIVED</h1>
      <p><strong>Order ID:</strong> #${orderId}</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Service:</strong> ${escapeHtml(service)}</p>
      <p><strong>Starting price:</strong> ${escapeHtml(quote.price)} / ${escapeHtml(quote.robux)}</p>
      <p><strong>Budget:</strong> ${escapeHtml(budget || "Not specified")}</p>
      <p><strong>Description:</strong><br>${escapeHtml(message)}</p>
      </div>
    </div>`
  };
}

app.get("/api/health", async (req, res) => {
  try {
    await transporter.verify();
    res.json({ ok: true, smtp: "ready" });
  } catch (error) {
    res.status(500).json({ ok: false, smtp: "error", error: error.message });
  }
});

app.post("/api/order", async (req, res) => {
  const { name, email, service, budget, message } = req.body || {};

  if (!name || !email || !service || !message) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields."
    });
  }

  const orderId = crypto.randomBytes(4).toString("hex").toUpperCase();

  const customer = customerEmail({
    name,
    email,
    service,
    budget,
    message,
    orderId
  });

  const owner = ownerEmail({
    name,
    email,
    service,
    budget,
    message,
    orderId
  });

  const fromEmail = process.env.SMTP_USER;
  const ownerEmailAddress =
    process.env.OWNER_EMAIL || process.env.SMTP_USER;

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("NEW ORDER RECEIVED");
  console.log("Order ID:", orderId);
  console.log("Customer:", name);
  console.log("Customer email:", email);
  console.log("Service:", service);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let customerResult = null;
  let ownerResult = null;
  let customerError = null;
  let ownerError = null;

  // 1. EMAIL A VÁSÁRLÓNAK
  try {
    customerResult = await transporter.sendMail({
  from: `"VexFoundry" <${fromEmail}>`,
  to: email,
  replyTo: ownerEmailAddress,
  subject: customer.subject,
  text: `Hello ${name},

We received your VexFoundry project request.

Order ID: ${orderId}
Service: ${service}
Selected budget: ${budget || "Custom price"}

We will review your request and contact you soon.

Please do not make a payment yet. The final price and payment details must be discussed first.

Discord: https://discord.gg/zXFcYwJ5wb

VexFoundry`,
  html: customer.html,
});

    console.log("CUSTOMER EMAIL: SUCCESS");
    console.log("Sent to:", email);
    console.log("Message ID:", customerResult.messageId);
  } catch (error) {
    customerError = error;

    console.error("CUSTOMER EMAIL: FAILED");
    console.error(error);
  }

  // 2. EMAIL NEKED
  try {
    ownerResult = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || "VEXFOUNDRY"} Order Bot <${fromEmail}>`,
      to: ownerEmailAddress,
      replyTo: email,
      ...owner
    });

    console.log("OWNER EMAIL: SUCCESS");
    console.log("Sent to:", ownerEmailAddress);
    console.log("Message ID:", ownerResult.messageId);
  } catch (error) {
    ownerError = error;

    console.error("OWNER EMAIL: FAILED");
    console.error(error);
  }

  // Ha legalább az egyik email elment
  if (customerResult || ownerResult) {
    return res.status(200).json({
      ok: true,
      orderId,
      customerEmailSent: Boolean(customerResult),
      ownerEmailSent: Boolean(ownerResult),
      customerError: customerError ? customerError.message : null,
      ownerError: ownerError ? ownerError.message : null
    });
  }

  // Ha egyik email sem ment el
  return res.status(500).json({
    ok: false,
    error: "Both emails could not be sent.",
    customerError: customerError ? customerError.message : null,
    ownerError: ownerError ? ownerError.message : null
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log("VEXFOUNDRY Order Bot running on port " + port);
});