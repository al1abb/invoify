const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const envPath = path.resolve(process.cwd(), ".env.local");

const loadDotEnv = (filePath) => {
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const splitAt = trimmed.indexOf("=");
    if (splitAt === -1) continue;
    const key = trimmed.slice(0, splitAt).trim();
    let value = trimmed.slice(splitAt + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

const toBool = (value) => {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
};

const createTransporter = () => {
  const smtpUrl = process.env.SMTP_URL;
  if (smtpUrl) {
    return nodemailer.createTransport(smtpUrl);
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = toBool(process.env.SMTP_SECURE);

  if (host && Number.isInteger(port) && port > 0 && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  return null;
};

const run = async () => {
  loadDotEnv(envPath);

  const transporter = createTransporter();
  if (!transporter) {
    console.error(
      "SMTP config missing. Set SMTP_URL or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS in .env.local."
    );
    process.exit(2);
  }

  try {
    await transporter.verify();
    console.log("SMTP verify success.");
  } catch (error) {
    console.error(
      `SMTP verify failed: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }

  const shouldSend = process.argv.includes("--send");
  if (!shouldSend) return;

  const to = process.env.SMTP_TEST_TO;
  const from =
    process.env.SMTP_FROM ||
    (process.env.SMTP_FROM_NAME && process.env.SMTP_FROM_EMAIL
      ? `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`
      : process.env.SMTP_FROM_EMAIL) ||
    process.env.SMTP_USER;
  if (!to || !from) {
    console.error(
      "SMTP send test skipped: set SMTP_TEST_TO and SMTP_FROM (or SMTP_FROM_NAME/SMTP_FROM_EMAIL, or SMTP_USER)."
    );
    process.exit(3);
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Invoify SMTP test",
      text: "SMTP test email from Invoify.",
    });
    console.log(`SMTP send success. Message id: ${info.messageId}`);
  } catch (error) {
    console.error(
      `SMTP send failed: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(4);
  }
};

run();
