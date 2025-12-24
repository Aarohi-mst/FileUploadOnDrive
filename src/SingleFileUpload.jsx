import { useState, useRef } from "react";

function SingleFileUpload() {
  const [file, setFile] = useState(null);
  const [customName, setCustomName] = useState("");
  const singleFileRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
    setCustomName("");
    if (singleFileRef.current) {
      singleFileRef.current.value = "";
    }
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
          ref={singleFileRef}
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
    </div>
  );
}
export default SingleFileUpload;
