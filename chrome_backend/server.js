const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = 32300;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Ensure upload and processed directories exist
const uploadDir = path.join(__dirname, "uploads");
const processedDir = path.join(__dirname, "processed");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir);

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    // Use original filename with timestamp to avoid conflicts
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 200, // 200MB limit
  },
});

// Endpoint to handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("File received:", req.file.filename);

  const inputFile = path.join(uploadDir, req.file.filename);
  const outputFileName = `${path.parse(req.file.filename).name}.webm`;
  const outputFile = path.join(processedDir, outputFileName);

  console.log("Converting file...");
  console.log("Input:", inputFile);
  console.log("Output:", outputFile);

  // Run FFmpeg command to convert the file
  exec(
    `ffmpeg -i "${inputFile}" -c:v libvpx -b:v 1M -c:a libvorbis "${outputFile}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error("FFmpeg Error:", error);
        return res.status(500).json({ error: "File processing failed" });
      }

      // Log FFmpeg output for debugging
      if (stderr) {
        console.log("FFmpeg stderr:", stderr);
      }

      console.log("Conversion completed successfully");

      res.json({
        message: "File processed successfully",
        originalName: req.file.originalname,
        downloadUrl: `/download/${outputFileName}`,
      });
    }
  );
});

// Endpoint to serve processed files
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(processedDir, req.params.filename);

  if (fs.existsSync(filePath)) {
    console.log("Sending file:", filePath);
    res.download(filePath);
  } else {
    console.log("File not found:", filePath);
    res.status(404).json({ error: "File not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
  console.log(`Processed directory: ${processedDir}`);
});
