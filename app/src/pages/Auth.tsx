import { ConnectGoogleStep } from "@/components/auth/ConnectGoogleStep";
import { ConnectSpotifyStep } from "@/components/auth/ConnectSpotifyStep";
import { ConnectWhatsAppStep } from "@/components/auth/ConnectWhatsAppStep";
import { DownloadStep } from "@/components/auth/DownloadStep";
import { SetupStep } from "@/components/auth/SetupStep";
import { SyncContactsStep } from "@/components/auth/SyncContactsStep";
import { VerifyStep } from "@/components/auth/VerifyStep";
import { STEP_INDEX_TO_KEY, STEP_META } from "@/constants/auth.constants";
import type { Step } from "@/types/auth.type";
import { useState } from "react";

export const Auth = () => {
  const [step, setStep] = useState<Step>("setup");

  

  const current = STEP_META[step];

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-md">
        <div className="mb-5 px-1">
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Step {current.index} of 7 · {current.label}
          </p>
          <h1 className="text-lg sm:text-xl font-medium">
            {step === "setup" && "Set up your assistant"}
            {step === "downloading" && "Downloading models"}
            {step === "connect_google" && "Connect Google"}
            {step === "sync_contact" && "Sync contacts"}
            {step === "connect_spotify" && "Connect Spotify"}
            {step === "connect_whatsapp" && "Connect WhatsApp"}
            {step === "verifyApiKeys" && "Verify your setup"} {/* ← add this */}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {step === "setup" &&
              "Runs locally. Your data stays on your machine."}
            {step === "downloading" &&
              "This may take a few minutes. Keep this window open."}
            {step === "connect_google" &&
              "Required to send emails and access Google services."}
            {step === "sync_contact" &&
              "Importing your Google contacts into VIMA."}
            {step === "connect_spotify" &&
              "Required to control music playback and search tracks.Only if you have premium"}
            {step === "connect_whatsapp" &&
              "Send and receive WhatsApp messages hands-free."}
            {step === "verifyApiKeys" && "Verify you api keys"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-8">
          {step === "setup" && (
            <SetupStep onSuccess={() => setStep("downloading")} />
          )}
          {step === "downloading" && (
            <DownloadStep onDone={() => setStep("connect_google")} />
          )}
          {step === "connect_google" && (
            <ConnectGoogleStep onDone={() => setStep("sync_contact")} />
          )}
          {step === "sync_contact" && (
            <SyncContactsStep onDone={() => setStep("connect_spotify")} />
          )}
          {step === "connect_spotify" && (
            <ConnectSpotifyStep
              onDone={() => setStep("connect_whatsapp")}
              onSkip={() => setStep("connect_whatsapp")}
            />
          )}
          {step === "connect_whatsapp" && (
            <ConnectWhatsAppStep
              onDone={() => {
                setStep("verifyApiKeys");
              }}
            />
          )}
          {step === "verifyApiKeys" && (
            <VerifyStep
              onBack={() => setStep("connect_whatsapp")}
              goToStep={(idx) => {
                const target = STEP_INDEX_TO_KEY[idx];
                if (target) setStep(target);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
