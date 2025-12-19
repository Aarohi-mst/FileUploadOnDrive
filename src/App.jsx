import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
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
        <br />
      </p>

      <button type="submit" onClick={uploadFile}>
        Submit
      </button>
    </div>
  );
}

export default App;
