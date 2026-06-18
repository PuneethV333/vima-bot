/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useCallback, useEffect } from "react";
import type { VimaState, Message } from "../types/vima.types";
import type { chatResponse } from "../types/chat.type";
import { useChat } from "./useChat";

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useVoiceAgent = () => {
    const [vimaState, setVimaState] = useState<VimaState>("idle");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

    const chatMutation = useChat();

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current = null;
            }
            stopRecording();
        };
    }, []);

    const playAudioResponse = useCallback((base64Audio: string) => {
        try {
            const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
            audioPlayerRef.current = audio;

            audio.addEventListener("ended", () => {
                setVimaState("idle");
                audioPlayerRef.current = null;
            });

            audio.addEventListener("error", () => {
                console.error("Audio playback error");
                setVimaState("idle");
                audioPlayerRef.current = null;
            });

            audio.play();
            setVimaState("speaking");
        } catch (err) {
            console.error("Failed to play audio:", err);
            setVimaState("idle");
        }
    }, []);

    const handleChatResponse = useCallback((data: chatResponse) => {
        // Add user message (transcript)
        if (data.transcript) {
            setMessages((prev) => [
                ...prev,
                {
                    id: generateId(),
                    role: "user",
                    content: data.transcript,
                },
            ]);
        }

        // Add VIMA response message
        if (data.response) {
            setMessages((prev) => [
                ...prev,
                {
                    id: generateId(),
                    role: "vima",
                    content: data.response,
                },
            ]);
        }

       

        // Play audio response
        if (data.audioBase64) {
            playAudioResponse(data.audioBase64);
        } else {
            setVimaState("idle");
        }
    }, [playAudioResponse]);

    const createAudioFile = useCallback((blob: Blob): File => {
        const timestamp = Date.now();
        return new File([blob], `recording-${timestamp}.webm`, {
            type: "audio/webm",
        });
    }, []);

    const sendAudioFile = useCallback(async (file: File) => {
        setVimaState("thinking");
        setError(null);

        try {
            const data = await chatMutation.mutateAsync(file);
            handleChatResponse(data);
        } catch (err: any) {
            console.error("Chat API error:", err);
            setError(err?.response?.data?.message || "Something went wrong. Please try again.");
            setVimaState("error");
        }
    }, [chatMutation, handleChatResponse]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported("audio/webm")
                    ? "audio/webm"
                    : "audio/mp4",
            });

            audioChunksRef.current = [];

            mediaRecorder.addEventListener("dataavailable", (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const audioFile = createAudioFile(audioBlob);
                sendAudioFile(audioFile);

                // Stop all tracks to release microphone
                stream.getTracks().forEach((track) => track.stop());
            });

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);
            setVimaState("listening");
            setError(null);
        } catch (err: any) {
            console.error("Microphone access error:", err);
            setError("Microphone access denied. Please allow microphone permissions.");
            setVimaState("error");
        }
    }, [createAudioFile, sendAudioFile]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    }, []);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    const dismissError = useCallback(() => {
        setError(null);
        if (vimaState === "error") {
            setVimaState("idle");
        }
    }, [vimaState]);

    return {
        vimaState,
        messages,
        isRecording,
        error,
        toggleRecording,
        stopRecording,
        startRecording,
        dismissError,
        isPending: chatMutation.isPending,
    };
};
