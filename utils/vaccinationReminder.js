import cron from "node-cron";
import db from "../config/firebase.js";
import { sendWhatsAppMessage } from "./sendMessage.js";

export function startVaccinationReminder() {
  console.log("🟢 Vaccination reminder system started...");

  // Runs every minute (for testing)
  cron.schedule("0 9 * * *", async () => {
    try {
      console.log("🔍 Checking vaccination reminders...");

      const snapshot = await db.ref("users").once("value");
      const users = snapshot.val() || {};

      // IST Date in YYYY-MM-DD
      const today = new Date().toLocaleDateString("en-CA");
      console.log("Today:", today);

      for (const [phone, userData] of Object.entries(users)) {
        const date = userData.vaccinationSchedule;

        console.log("Checking user:", phone);
        console.log("Stored date:", date);

        if (!date) continue;

        if (date === today) {
          console.log(`📢 MATCH FOUND - Sending reminder to ${phone}`);

          const formattedPhone = phone.startsWith("whatsapp:")
            ? phone
            : `whatsapp:${phone}`;

          try {
            const result = await sendWhatsAppMessage(
              formattedPhone,
              `Vaccination Reminder\n\nYour vaccine is due today.\nPlease visit nearest health center.`,
              false
            );

            console.log("✅ Message Sent. SID:", result.sid);
          } catch (err) {
            console.error("❌ Twilio Send Error:", err.message);
          }
        }
      }

      console.log("✅ Vaccination check completed.\n");
    } catch (err) {
      console.error("❌ Vaccination reminder error:", err);
    }
  });
}
