import { WebSocket } from "ws";
import { syncContacts } from "../controller/google.controller";

export const handleSyncContact = (ws: WebSocket) => {
    syncContacts()
        .then((count) => {
            ws.send(JSON.stringify({ type: "CONTACTS_SYNCED", data: count }))
        })
        .catch((err) => {
            console.error(err)
            ws.send(JSON.stringify({ type: "CONTACTS_ERROR" }))
        })
    ws.send(JSON.stringify({ type: "CONTACTS_SYNCING" }))
}