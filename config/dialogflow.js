// File: config/dialogflow.js
// ============================
// Dialogflow configuration & helpers (ENV-based for cloud)
// ============================

import dialogflow from "@google-cloud/dialogflow";

// ============================
// Environment Variables
// ============================

const projectId = process.env.DIALOGFLOW_PROJECT_ID;

if (!projectId) {
  console.error("❌ DIALOGFLOW_PROJECT_ID missing!");
  process.exit(1);
}

if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error("❌ Dialogflow credentials missing in ENV!");
  process.exit(1);
}

// ============================
// Dialogflow Client (ENV-based)
// ============================

export const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  projectId,
});

// ============================
// Hinglish Detector
// ============================

export function isHinglish(text) {
  const hinglishWords = [
    "kya",
    "nahi",
    "hai",
    "tum",
    "mera",
    "tere",
    "mujhe",
    "acha",
    "theek",
    "kyun",
    "kab",
    "kaise",
    "ky",
    "nhi",
    "bukhar",
    "dawa",
    "khana",
    "dard",
    "doctor",
    "bimar",
  ];

  const lower = text.toLowerCase();
  let count = 0;

  for (const word of hinglishWords) {
    if (lower.includes(word)) count++;
  }

  return count >= 2;
}

// ============================
// Language Mapping
// ============================

export function mapLanguageCodeToName(code, isHinglishFlag = false) {
  if (isHinglishFlag) return "Hinglish";

  const mapping = {
    hi: "Hindi",
    bn: "Bengali",
    ta: "Tamil",
    te: "Telugu",
    gu: "Gujarati",
    mr: "Marathi",
  };

  return mapping[code] || "English";
}

// ============================
// Detect Intent + Language
// ============================

export async function detectIntentAndLanguage(text, sessionId = "default") {
  try {
    const hinglishDetected = isHinglish(text);

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: "en-US", // Hinglish handled as English
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    const fullLanguage = mapLanguageCodeToName(
      result.languageCode,
      hinglishDetected
    );

    return {
      intent: result.intent?.displayName || "Unknown",
      fulfillmentText: result.fulfillmentText || "",
      language: fullLanguage,
    };
  } catch (error) {
    console.error("Dialogflow error:", error.message);
    return {
      intent: "Error",
      fulfillmentText: "",
      language: "English",
    };
  }
}
