import type { ToolType } from "../types/tools.types"


const openYoutube = (payload: ToolType) => {
    if (payload.params?.query) {
        window.open(
            `https://www.youtube.com/results?search_query=${encodeURIComponent(payload.params.query)}`,
            "_blank"
        )
    } else {
        window.open("https://www.youtube.com", "_blank")
    }
}

const playMusic = (payload: ToolType) => {
    const query = payload.params?.query ?? ""
    window.open(
        `https://music.youtube.com/search?q=${encodeURIComponent(query)}`,
        "_blank"
    )
}

const openManhwa = (payload: ToolType) => {
    const query = payload.params?.query ?? ""
    window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query + " manhwa read online")}`,
        "_blank"
    )
}

export const executeTool = (payload: ToolType) => {
    switch (payload.tool) {
        case "openYoutube":
            openYoutube(payload)
            break
        case "playMusic":
            playMusic(payload)
            break
        case "openManhwa":
            openManhwa(payload)
            break
        default:
            // sendEmail, webSearch, setReminder are executed server-side by Node
            break
    }
}