import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    const videoPath = req.file.path;
    const scriptPath = path.join(__dirname, "../scripts/yolo_detect.py");

    // Spawn Python process
    const pythonProcess = spawn("python", [scriptPath, videoPath]);

    let dataString = "";
    let errorString = "";

    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python process:", err);
      res.status(500).json({ error: "Failed to start video analysis service", details: err.message });
    });

    pythonProcess.on("close", (code) => {
      // Clean up uploaded file after processing
      fs.unlink(videoPath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });

      if (code !== 0) {
        console.error("Python script error:", errorString);
        return res.status(500).json({ error: "Video analysis failed", details: errorString });
      }

      try {
        const results = JSON.parse(dataString);
        res.json(results);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, dataString);
        res.status(500).json({ error: "Failed to parse analysis results" });
      }
    });

  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
