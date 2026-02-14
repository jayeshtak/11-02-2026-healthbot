import express from "express";
import { sendWhatsAppMessage } from "../utils/sendMessage.js";

const router = express.Router();

router.post("/manual-reminder", async (req, res) => {
  try {
    const { phone, vaccine } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone required" });
    }

    const formattedPhone = phone.startsWith("whatsapp:")
      ? phone
      : `whatsapp:${phone}`;

    const result = await sendWhatsAppMessage(
      formattedPhone,
      `Vaccination Reminder\n\n${vaccine || "Your vaccine"} is due.`,
      false
    );

    res.json({ success: true, sid: result.sid });
  } catch (err) {
    console.error("Manual reminder error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
