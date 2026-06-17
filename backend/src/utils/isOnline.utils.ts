import dns from "dns"

export const isOnline = (): Promise<boolean> => {
  return new Promise((resolve) => {
    dns.resolve("google.com", (err) => resolve(!err))
  })
}