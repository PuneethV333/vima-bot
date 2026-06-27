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

export const useAuth = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authApi,
        onSuccess: (res, variables) => {
            toast.success("Setup complete")
            queryClient.setQueryData(["me"], res)

            connectWS()

            const ws = getSocket()
            ws.onopen = () => {
                sendWS("PULL_MODELS", {
                    ollamaModel: variables.model,
                    whisperModel: variables.whisperModel
                })
            }
        },
        onError: () => {
            toast.error("Failed, try again")
        }
    })
}