const cron = require("node-cron");
const { supabaseAdmin } = require("../config/supabase");
const { sendExpiryReminderEmail } = require("../services/email.service");

async function runExpiryReminder() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);

  const { data, error } = await supabaseAdmin
    .from("foods")
    .select("id, user_id, name, category, expiry_date")
    .eq("status", "active")
    .gte("expiry_date", today.toISOString().slice(0, 10))
    .lte("expiry_date", twoDaysLater.toISOString().slice(0, 10));

  if (error) {
    throw new Error(error.message);
  }

  // Optional email flow can be implemented with user-email mapping table.
  if ((data || []).length > 0) {
    console.log(`Near-expiry items detected: ${(data || []).length}`);
  }

  // Keep email service imported to support future integration.
  void sendExpiryReminderEmail;
}

function startExpiryReminderCron() {
  cron.schedule("0 9 * * *", async () => {
    try {
      await runExpiryReminder();
    } catch (error) {
      console.error("Expiry reminder cron failed:", error.message);
    }
  });

  console.log("Expiry reminder cron started");
}

module.exports = startExpiryReminderCron;