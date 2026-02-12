const nodemailer = require("nodemailer");
const config = require("../config");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (config.smtpService && config.smtpUser && config.smtpPass) {
    transporter = nodemailer.createTransport({
      service: config.smtpService,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
    return transporter;
  }

  if (config.smtpHost && config.smtpUser && config.smtpPass) {
    transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
    return transporter;
  }

  return null;
}

async function sendExpiryReminderEmail({ to, name, items }) {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("Email transport is not configured. Skipping reminder email.");
    return false;
  }

  const htmlList = items
    .map((item) => `<li><b>${item.name}</b> (${item.category}) expires on ${new Date(item.expiryDate).toDateString()}</li>`)
    .join("");

  await mailer.sendMail({
    from: config.emailFrom,
    to,
    subject: "Food expiry reminder - Smart Food Waste Tracker",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>Hello ${name},</h2>
        <p>The following food items are near expiry:</p>
        <ul>${htmlList}</ul>
        <p>Please consume them soon to reduce waste.</p>
      </div>
    `,
  });

  return true;
}

module.exports = {
  sendExpiryReminderEmail,
};