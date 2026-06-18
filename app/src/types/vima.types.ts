export type VimaState = "idle" | "listening" | "thinking" | "speaking" | "error";

export interface Message {
    id: string;
    role: "user" | "vima";
    content: string;
}
