import { authApi, getMeApi } from "@/api/auth.api";
import { connectWS, getSocket, sendWS } from "@/lib/ws";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetMe = () =>
    useQuery({
        queryKey: ["me"],
        queryFn: getMeApi,
        retry: false
    })

export const useAuth = (onSuccess: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: authApi,
        onSuccess: (res, variables) => {
            queryClient.setQueryData(["me"], res)
            connectWS()

            const ws = getSocket()!

            const send = () => {
                console.log("sending PULL_MODELS")
                sendWS("PULL_MODELS", {
                    ollamaModel: variables.model,
                    whisperModel: variables.whisperModel,
                })
                onSuccess()
            }

            if (ws.readyState === WebSocket.OPEN) {
                send()
            } else {
                ws.onopen = send
            }
        },
        onError: () => toast.error("Failed, try again")
    })
}