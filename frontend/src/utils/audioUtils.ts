export const float32ToWavBlob = (audio: Float32Array, sampleRate = 16000): Blob => {
    const buffer = new ArrayBuffer(44 + audio.length * 2)

    const view = new DataView(buffer)

    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i))
        }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + audio.length * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, audio.length * 2, true)


    let offset = 44
    for (let i = 0; i < audio.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, audio[i]))
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }

    return new Blob([buffer], { type: "audio/wav" })

}