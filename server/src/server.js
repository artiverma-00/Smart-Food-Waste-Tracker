const app = require("./app");
const config = require("./config");
const startExpiryReminderCron = require("./cron/expiryReminder.cron");

function bootstrap() {
  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });

  startExpiryReminderCron();
}

bootstrap();