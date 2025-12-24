import { useState, useRef } from "react";

function JsonFormatFileUpload() {
  const [files, setFiles] = useState([]);
  const [structure, setStructure] = useState([]);
  const dynamicFileRef = useRef(null);

  const addSid = () => {
    setStructure([...structure, { sid: Date.now().toString(), stages: [] }]);
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
    const list = copy[sidIndex].stages[stageIndex].files;
    const idx = list.indexOf(fileIndex);

    idx >= 0 ? list.splice(idx, 1) : list.push(fileIndex);
    setStructure(copy);
  };

  const upload = async () => {
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
        <div key={sid.sid}>
          <h3>Folder</h3>
          <button onClick={() => addStage(si)}>Add Subfolder</button>

          {sid.stages.map((stage, ti) => (
            <div key={ti}>
              <input
                placeholder="Subfolder name"
                ref={dynamicFileRef}
                onChange={(e) => {
                  const copy = [...structure];
                  copy[si].stages[ti].name = e.target.value;
                  setStructure(copy);
                }}
              />

              {files.map((f, fi) => (
                <label key={fi}>
                  <input
                    type="checkbox"
                    ref={dynamicFileRef}
                    onChange={() => toggleFile(si, ti, fi)}
                  />
                  {f.name}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}
      <br />
      <br />
      <button onClick={upload}>Upload</button>
    </div>
  );
}
export default JsonFormatFileUpload;
