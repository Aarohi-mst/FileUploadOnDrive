import express from "express"; //server
import multer from "multer"; //upload files handler (middleware)
import pkg from "googleapis"; //google drive api client
const { google } = pkg;
import fs from "fs"; //file system in-built in node
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;
const upload = multer({ dest: "uploads/" }); //folder to store uploaded files temporarily

//Google Auth
const auth = new google.auth.GoogleAuth({
  //creates google authentication object
  keyFile: "service-account.json", //path to credential file downloaded from Google Cloud Console
  scopes: ["https://www.googleapis.com/auth/drive.file"], //defines permissions like: Can create, upload, and modify filesthat this app creates in Google Drive
});
const drive = google.drive({ version: "v3", auth }); //creates google drive api client
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const customName = req.body.customName;
    const ext = path.extname(req.file.originalname);
    const finalName = customName
      ? `${customName}${ext}`
      : req.file.originalname;
    const response = await drive.files.create({
      requestBody: {
        name: finalName,
        parents: ["0AKOQKBgucs4WUk9PVA"],
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      },
      supportsAllDrives: true,
    });

    fs.unlinkSync(req.file.path); //deletes the file from local uploads folder after uploading to google drive
    res.json({ fileId: response.data.id });
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    res.status(500).send(error.message);
  }
});

app.post("/upload-multiple", upload.array("files", 10), async (req, res) => {
  try {
    const customNames = JSON.parse(req.body.customNames || "[]");
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const ext = path.extname(file.originalname);

      const finalName = customNames[i]
        ? `${customNames[i]}${ext}`
        : file.originalname;

      const response = await drive.files.create({
        requestBody: {
          name: finalName,
          parents: ["0AKOQKBgucs4WUk9PVA"],
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.path),
        },
        supportsAllDrives: true,
      });

      uploadedFiles.push(response.data.id);
      fs.unlinkSync(file.path);
    }
    res.json({ fileIds: uploadedFiles });
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => console.log("Server running on port ", PORT));
