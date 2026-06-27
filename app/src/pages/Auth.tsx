import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDataSchema, type FormData } from "@/types/auth.type";
import { useAuth } from "@/hooks/useAuth";

const OLLAMA_MODELS = ["llama3.2", "mistral", "gemma3", "phi4", "deepseek-r1"];

const WHISPER_MODELS = [
  { value: "tiny",   label: "tiny",   size: "150mb", note: "fastest" },
  { value: "base",   label: "base",   size: "300mb", note: "balanced" },
  { value: "small",  label: "small",  size: "500mb", note: "recommended" },
  { value: "medium", label: "medium", size: "1.5gb", note: "accurate" },
  { value: "large",  label: "large",  size: "3gb",   note: "best quality" },
];

export const Auth = () => {
  const [env, setEnv] = useState<"local" | "cloud" | "hybrid">("local");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: { env: "local", model: "llama3.2", whisperModel: "small" },
  });

  const { mutate, isPending } = useAuth();

  const pickEnv = (val: "local" | "cloud" | "hybrid") => {
    setEnv(val);
    setValue("env", val);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-md">

        {/* header — outside card on mobile, feels less cramped */}
        <div className="mb-5 px-1">
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Initial setup
          </p>
          <h1 className="text-lg sm:text-xl font-medium">Set up your assistant</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Runs locally. Your data stays on your machine.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-8">
          <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4 sm:space-y-5">

            {/* name */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                Your name
              </label>
              <input
                {...register("name")}
                placeholder="Puneeth"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* env */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                Processing environment
              </label>
              {/* stack on very small screens, row on sm+ */}
              <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2">
                {(["local", "cloud", "hybrid"] as const).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => pickEnv(val)}
                    className={`flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-0 p-2.5 sm:p-2.5 rounded-lg border text-left transition-all ${
                      env === val
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <p className="text-xs font-medium capitalize">{val}</p>
                    <p className="text-[10px] opacity-70 sm:mt-0.5">
                      {val === "local" && "Ollama · offline"}
                      {val === "cloud" && "Gemini · API key"}
                      {val === "hybrid" && "Local + fallback"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* ollama model */}
            {(env === "local" || env === "hybrid") && (
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                  Ollama model
                </label>
                <select
                  {...register("model")}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {OLLAMA_MODELS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}

            {/* whisper model */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                  Whisper model
                </label>
                <span className="text-[10px] text-muted-foreground">for voice input</span>
              </div>

              
              <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
                {WHISPER_MODELS.map((m) => (
                  <label
                    key={m.value}
                    className="flex items-center gap-3 px-3 py-2.5 bg-background hover:bg-muted/40 cursor-pointer has-[:checked]:bg-primary/5 has-[:checked]:border-l-2 has-[:checked]:border-l-primary transition-all"
                  >
                    <input
                      type="radio"
                      value={m.value}
                      {...register("whisperModel")}
                      className="accent-primary shrink-0"
                    />
                    <div className="flex flex-1 items-center justify-between min-w-0 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs text-foreground shrink-0">{m.label}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{m.note}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{m.size}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* gemini api key */}
            {(env === "cloud" || env === "hybrid") && (
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                  Gemini API key
                </label>
                <input
                  {...register("apiKey")}
                  placeholder="AIza..."
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 transition-opacity active:scale-[0.98]"
            >
              {isPending ? "Setting up..." : "Continue"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};