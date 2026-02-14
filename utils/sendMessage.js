import { textToSpeechAndUpload } from "./tts.js";
import { sanitizeForTTS } from "./preprocess.js";
import { twilioClient } from "../config/twilioClient.js";
import fs from "fs";

export async function sendWhatsAppMessage(
  to,
  text,
  wantsVoice = false,
  userLang = "en"
) {
  console.log("📨 Sending WhatsApp message...");
  console.log("FROM:", process.env.TWILIO_WHATSAPP_NUMBER);
  console.log("TO:", to);

  if (wantsVoice) {
    let tempAudioFile = null;

    try {
      let ttsLang = "en";
      if (userLang.startsWith("hi")) ttsLang = "hi";
      else if (userLang.startsWith("or")) ttsLang = "or";

      const sanitizedText = sanitizeForTTS(text);

      tempAudioFile = await textToSpeechAndUpload(sanitizedText, ttsLang, {
        format: "ogg",
        codec: "opus",
        contentType: "audio/ogg",
      });

      if (!tempAudioFile) throw new Error("Audio upload returned empty URL");

      const sent = await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to,
        mediaUrl: [tempAudioFile],
      });

      console.log("🎧 Voice Message SID:", sent.sid);
      return { type: "audio", audioUrl: tempAudioFile, sid: sent.sid };
    } catch (err) {
      console.error("🔊 Voice failed, fallback to text:", err.message);

      const sent = await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to,
        body: text,
      });

      return { type: "text", sid: sent.sid };
    } finally {
      if (tempAudioFile && fs.existsSync(tempAudioFile)) {
        fs.unlinkSync(tempAudioFile);
      }
    }
  } else {
    try {
      const sent = await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to,
        body: text,
      });

      console.log("📩 Text Message SID:", sent.sid);
      return { type: "text", sid: sent.sid };
    } catch (err) {
      console.error("❌ Twilio Text Error:", err.message);
      throw err;
    }
  }
}
