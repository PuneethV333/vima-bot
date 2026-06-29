import { google } from "googleapis"
import { oauth2Client } from "../config/oAuth.config"
import { prisma } from "../config/prisma"

export const getGoogleContacts = async () => {
    const settings = await prisma.settings.findFirst()
    if (!settings?.googleRefreshTokenEnc) throw new Error("google auth not completed")

    oauth2Client.setCredentials({
        refresh_token: settings.googleRefreshTokenEnc
    })

    const people = google.people({
        version: "v1",
        auth: oauth2Client
    })

    const res = await people.people.connections.list({
        resourceName: "people/me",
        pageSize: 1000,
        personFields: "name,emailAddresses,phoneNumbers"
    })

    return res.data.connections?.map((person) => ({
        name: person.names?.[0]?.displayName ?? "Unknown",
        email: person.emailAddresses?.[0]?.value ?? null,
        phone: person.phoneNumbers?.[0]?.value ?? null
    })) ?? []
}