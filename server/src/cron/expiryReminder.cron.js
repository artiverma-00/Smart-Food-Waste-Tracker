const cron = require("node-cron");
const Food = require("../models/food.model");
const { sendExpiryReminderEmail } = require("../services/email.service");

function groupItemsByUser(foods) {
  const map = new Map();

  for (const food of foods) {
    const user = food.userId;
    if (!user || !user.email) continue;

    const key = user._id.toString();

    if (!map.has(key)) {
      map.set(key, {
        email: user.email,
        name: user.name,
        items: [],
      });
    }

    map.get(key).items.push(food);
  }

  return Array.from(map.values());
}

async function runExpiryReminder() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);
  twoDaysLater.setHours(23, 59, 59, 999);

  const foods = await Food.find({
    status: "active",
    expiryDate: { $gte: today, $lte: twoDaysLater },
  }).populate("userId", "name email");

  const grouped = groupItemsByUser(foods);

  for (const entry of grouped) {
    await sendExpiryReminderEmail({
      to: entry.email,
      name: entry.name,
      items: entry.items,
    });
  }

  if (grouped.length) {
    console.log(`Expiry reminders sent to ${grouped.length} users`);
  }
}

function startExpiryReminderCron() {
  // Every day at 9:00 AM
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