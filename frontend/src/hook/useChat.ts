import { useMutation } from "@tanstack/react-query"
import { chatApi } from "../api/chat.api"

export const useChat = () => {
    return useMutation({
        mutationKey:["chat"],
        mutationFn:(file:File) => chatApi(file),
    })
}