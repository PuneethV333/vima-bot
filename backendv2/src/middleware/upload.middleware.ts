import multer from "multer"

export const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowed = ["audio/webm", "audio/wav", "audio/mp4", "audio/ogg"]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only audio files allowed"))
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
})