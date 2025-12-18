import express from "express"; //server
import multer from "multer"; //upload files handler (middleware)
import pkg from "googleapis"; //google drive api client
const { google } = pkg;
import fs from "fs"; //file system in-built in node
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const upload = multer({ dest: "uploads/" }); //folder to store uploaded files temporarily

//Google Auth
console.log("1");
const auth = new google.auth.GoogleAuth({
  //creates google authentication object
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, //path to credential file downloaded from Google Cloud Console
  scopes: ["https://www.googleapis.com/auth/drive.file"], //defines permissions like: Can create, upload, and modify filesthat this app creates in Google Drive
});
const drive = google.drive({ version: "v3", auth }); //creates google drive api client
console.log("2");
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("Req File:", req.file);
  try {
    const response = await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        parents: ["0AKOQKBgucs4WUk9PVA"],
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      },
      supportsAllDrives: true,
    });

    console.log("Response", response.data);
    fs.unlinkSync(req.file.path); //deletes the file from local uploads folder after uploading to google drive
    res.json({ fileId: response.data.id });
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    res.status(500).send(error.message);
  }
  console.log("3");
});
console.log("4");
app.listen(3000, () => console.log("Server running on port ", PORT));
