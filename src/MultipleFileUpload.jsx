import { useState, useRef } from "react";

function MultipleFileUpload() {
  const [files, setFiles] = useState([]);
  const [customNames, setCustomNames] = useState([]);
  const multipleFileRef = useRef(null);

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setCustomNames(selectedFiles.map(() => ""));
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
    if (multipleFileRef.current) {
      multipleFileRef.current.value = "";
    }
  };
  return (
    <div>
      <p>
        <label htmlFor="fileUpload">Upload Multiple File:</label>
        <br /> <br />
        <input
          type="file"
          multiple
          id="fileUploadMultiple"
          placeholder="Upload your file"
          ref={multipleFileRef}
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

export default MultipleFileUpload;
