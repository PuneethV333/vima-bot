import type { Step } from "@/types/auth.type";

export const STEP_META = {
    setup: { index: 1, label: "Profile" },
    downloading: { index: 2, label: "Models" },
    connect_google: { index: 3, label: "Google" },
    sync_contact: { index: 4, label: "Contacts" },
    connect_spotify: { index: 5, label: "Spotify" },
    connect_whatsapp: { index: 6, label: "WhatsApp" },
    verifyApiKeys: { index: 7, label: "Verify" },
};

export const STEP_INDEX_TO_KEY: Record<number, Step> = {
    1: "setup",
    2: "downloading",
    3: "connect_google",
    4: "sync_contact",
    5: "connect_spotify",
    6: "connect_whatsapp",
};