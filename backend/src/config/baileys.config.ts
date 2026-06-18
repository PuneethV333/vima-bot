import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import { Boom } from '@hapi/boom';

let sock: ReturnType<typeof makeWASocket>;

export async function connectToWhatsApp(): Promise<typeof sock> {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    sock = makeWASocket({
        auth: state,
    });

    sock.ev.on('creds.update', saveCreds);

    return new Promise((resolve, reject) => {
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                qrcode.generate(qr, { small: true });
            }

            if (connection === 'close') {
                const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                if (shouldReconnect) {
                    connectToWhatsApp().then(resolve).catch(reject); // reconnect and resolve once it's back open
                } else {
                    reject(new Error('Logged out — delete auth_info and re-scan QR'));
                }
            } else if (connection === 'open') {
                console.log('WhatsApp connected!');
                resolve(sock); // only resolves here, once truly ready
            }
        });
    });
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
    if (!sock) throw new Error('WhatsApp socket not initialized');
    const jid = `${phoneNumber}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: message });
}