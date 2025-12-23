import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [customName, setCustomName] = useState("");
  const [customNames, setCustomNames] = useState([]);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setCustomNames(selectedFiles.map(() => ""));
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("customName", customName);
    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert("File uploaded successfully");
    } catch (err) {
      alert("Error uploading file");
    }
    setFile(null);
  };

  const uploadMultipleFiles = async () => {
    if (!files || files.length === 0) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("customNames", JSON.stringify(customNames));
    try {
      const res = await fetch("http://localhost:3000/upload-multiple", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert("Files uploaded successfully");
    } catch (err) {
      alert("Error uploading files");
    }
    setFiles([]);
    setCustomNames([]);
  };

  return (
    <div>
      <p>
        <label htmlFor="fileUpload">Upload File:</label>
        <br /> <br />
        <input
          type="file"
          id="fileUpload"
          placeholder="Upload your file"
          onChange={(e) => handleFileChange(e)}
        />
        <br /> <br />
        <input
          type="text"
          value={customName}
          placeholder="Enter file name"
          onChange={(e) => setCustomName(e.target.value)}
        />
        <br />
      </p>
      <br />
      <button type="submit" onClick={uploadFile}>
        Submit single file
      </button>

      <p>
        <label htmlFor="fileUpload">Upload Multiple File:</label>
        <br /> <br />
        <input
          type="file"
          multiple
          id="fileUploadMultiple"
          placeholder="Upload your file"
          onChange={(e) => handleFilesChange(e)}
        />
        <br />
        <br />
        {files.map((_, i) => (
          <div key={i}>
            <input
              type="text"
              placeholder={`Custom name for the file ${i + 1}`}
              value={customNames[i]}
              onChange={(e) => {
                const updated = [...customNames];
                updated[i] = e.target.value;
                setCustomNames(updated);
              }}
            />
          </div>
        ))}
        <br />
      </p>
      <button type="submit" onClick={uploadMultipleFiles}>
        Submit multiple files
      </button>
    </div>
  );
}

export default App;
