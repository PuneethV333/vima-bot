/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback, useEffect } from "react";
import type { VimaState, Message } from "../types/vima.types";
import { config } from "@/config/data.config";

const generateId = () => Math.random().toString(36).substring(2, 9);

type ServerMessage =
    | { type: "partial_transcript"; text: string }
    | { type: "final_transcript"; text: string }
    | { type: "loop_status"; step: string }
    | { type: "audio_start" }
    | { type: "done" }
    | { type: "error"; message: string };

const WS_URL = config.webSocketUrl

export const useVoiceAgent = () => {
    const [vimaState, setVimaState] = useState<VimaState>("idle");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loopStatus, setLoopStatus] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);


    const mediaSourceRef = useRef<MediaSource | null>(null);
    const sourceBufferRef = useRef<SourceBuffer | null>(null);
    const audioElRef = useRef<HTMLAudioElement | null>(null);
    const pendingAudioChunksRef = useRef<ArrayBuffer[]>([]);


    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
            console.log("WS connected");
        };

        ws.onmessage = (event) => {
            if (typeof event.data === "string") {
                const msg: ServerMessage = JSON.parse(event.data);
                handleServerMessage(msg);
            } else {
                appendAudioChunk(event.data as ArrayBuffer);
            }
        };

        ws.onerror = () => {
            setError("Connection error. Please check your network.");
            setVimaState("error");
        };

        ws.onclose = () => {
            console.log("WS closed");
        };

        wsRef.current = ws;

        return () => {
            ws.close();
            stopRecording();
            cleanupAudioPlayer();
        };
    }, []);

    // --- Streaming audio playback setup ---
    const initAudioPlayer = useCallback(() => {
        const mediaSource = new MediaSource();
        const audio = new Audio();
        audio.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener("sourceopen", () => {
            const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
            sourceBufferRef.current = sourceBuffer;

            sourceBuffer.addEventListener("updateend", () => {
                if (pendingAudioChunksRef.current.length > 0 && !sourceBuffer.updating) {
                    const next = pendingAudioChunksRef.current.shift()!;
                    sourceBuffer.appendBuffer(next);
                }
            });
        });

        audio.addEventListener("ended", () => {
            setVimaState("idle");
            cleanupAudioPlayer();
        });

        audio.addEventListener("error", () => {
            console.error("Audio playback error");
            setVimaState("idle");
            cleanupAudioPlayer();
        });

        mediaSourceRef.current = mediaSource;
        audioElRef.current = audio;
        pendingAudioChunksRef.current = [];
    }, []);

    const appendAudioChunk = useCallback((chunk: ArrayBuffer) => {
        const sourceBuffer = sourceBufferRef.current;
        if (!sourceBuffer) {
            pendingAudioChunksRef.current.push(chunk);
            return;
        }
        if (sourceBuffer.updating) {
            pendingAudioChunksRef.current.push(chunk);
        } else {
            sourceBuffer.appendBuffer(chunk);
        }
    }, []);

    const cleanupAudioPlayer = useCallback(() => {
        if (audioElRef.current) {
            audioElRef.current.pause();
            audioElRef.current = null;
        }
        mediaSourceRef.current = null;
        sourceBufferRef.current = null;
        pendingAudioChunksRef.current = [];
    }, []);

    const handleServerMessage = useCallback((msg: ServerMessage) => {
        switch (msg.type) {
            case "partial_transcript":
                // optional: show live transcript while user is talking
                break;

            case "final_transcript":
                setMessages((prev) => [
                    ...prev,
                    { id: generateId(), role: "user", content: msg.text },
                ]);
                setVimaState("thinking");
                break;

            case "loop_status":
                setLoopStatus(msg.step);
                break;

            case "audio_start":
                setLoopStatus(null);
                initAudioPlayer();
                setVimaState("speaking");
                audioElRef.current?.play().catch((err) => {
                    console.error("Autoplay blocked or failed:", err);
                });
                break;

            case "done":
                if (mediaSourceRef.current?.readyState === "open") {
                    mediaSourceRef.current.endOfStream();
                }
                break;

            case "error":
                setError(msg.message);
                setVimaState("error");
                break;
        }
    }, [initAudioPlayer]);

    // --- Recording ---
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported("audio/webm")
                    ? "audio/webm"
                    : "audio/mp4",
            });

            mediaRecorder.addEventListener("dataavailable", (event) => {
                if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
                    event.data.arrayBuffer().then((buf) => {
                        wsRef.current?.send(buf);
                    });
                }
            });

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(250); // stream chunks every 250ms

            setIsRecording(true);
            setVimaState("listening");
            setError(null);
        } catch (err: any) {
            console.error("Microphone access error:", err);
            setError("Microphone access denied. Please allow microphone permissions.");
            setVimaState("error");
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsRecording(false);

        // tell server the user is done talking
        wsRef.current?.send(JSON.stringify({ type: "audio_chunk" }));
    }, []);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    const interrupt = useCallback(() => {
        wsRef.current?.send(JSON.stringify({ type: "interrupt" }));
        cleanupAudioPlayer();
        setLoopStatus(null);
        setVimaState("idle");
    }, [cleanupAudioPlayer]);

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
        loopStatus,
        toggleRecording,
        stopRecording,
        startRecording,
        interrupt,
        dismissError,
    };
};