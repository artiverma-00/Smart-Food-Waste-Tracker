const app = require("./app");
const config = require("./config");
const connectDB = require("./config/db");
const startExpiryReminderCron = require("./cron/expiryReminder.cron");

async function bootstrap() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });

  startExpiryReminderCron();
}

bootstrap();