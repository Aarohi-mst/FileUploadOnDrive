import { useState, useRef } from "react";

function JsonFormatFileUpload() {
  const [files, setFiles] = useState([]);
  const [structure, setStructure] = useState([]);
  const dynamicFileRef = useRef(null);

  const addSid = () => {
    const sid = Date.now().toString();
    setStructure((prev) => [
      ...prev,
      {
        sid,
        name: `sid-${sid}`,
        stages: [],
      },
    ]);
  };

  const addStage = (sidIndex) => {
    const copy = [...structure];
    copy[sidIndex].stages.push({ name: "", files: [] });
    setStructure(copy);
  };

  const handleFileSelect = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const toggleFile = (sidIndex, stageIndex, fileIndex) => {
    const copy = [...structure];
    const fileList = copy[sidIndex].stages[stageIndex].files;

    if (fileList.includes(fileIndex)) {
      copy[sidIndex].stages[stageIndex].files = fileList.filter(
        (i) => i !== fileIndex
      );
    } else {
      fileList.push(fileIndex);
    }

    setStructure(copy);
  };

  const upload = async () => {
    if (!files.length || !structure.length) {
      alert("Select files and create folders first");
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("structure", JSON.stringify(structure));

    await fetch("http://localhost:3000/upload-dynamic", {
      method: "POST",
      body: formData,
    });

    alert("Uploaded");
    setFiles([]);
    setStructure([]);
    if (dynamicFileRef.current) {
      dynamicFileRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        ref={dynamicFileRef}
      />
      <br />
      <br />

      <button onClick={addSid}>Add Folder</button>

      {structure.map((sid, si) => (
        <div key={sid.sid} style={{ border: "1px solid #ccc", padding: 10 }}>
          {/* -------- TOP FOLDER NAME -------- */}
          <input
            type="text"
            placeholder={sid.name}
            value={sid.name}
            onChange={(e) => {
              const copy = [...structure];
              copy[si].name = e.target.value || `sid-${copy[si].sid}`;
              setStructure(copy);
            }}
          />

          <button onClick={() => addStage(si)}>Add Subfolder</button>

          {sid.stages.map((stage, ti) => (
            <div key={ti} style={{ marginLeft: 20 }}>
              {/* -------- SUBFOLDER NAME -------- */}
              <input
                placeholder="Subfolder name"
                value={stage.name}
                onChange={(e) => {
                  const copy = [...structure];
                  copy[si].stages[ti].name = e.target.value;
                  setStructure(copy);
                }}
              />

              <div>
                {files.map((f, fi) => (
                  <label key={fi} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={stage.files.includes(fi)}
                      onChange={() => toggleFile(si, ti, fi)}
                    />
                    {f.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <br />
      <button onClick={upload}>Upload</button>
    </div>
  );
}
export default JsonFormatFileUpload;
