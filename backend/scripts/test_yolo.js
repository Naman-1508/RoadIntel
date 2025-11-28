import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, "yolo_detect.py");
// Use a dummy path or a real one if available. 
// If no file exists, the script should return an error but still run.
const videoPath = "test_video.mp4";

console.log("Running YOLO script...");
const pythonProcess = spawn("python", [scriptPath, videoPath]);

pythonProcess.stdout.on("data", (data) => {
    console.log("STDOUT:", data.toString());
});

pythonProcess.stderr.on("data", (data) => {
    console.error("STDERR:", data.toString());
});

pythonProcess.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
});
