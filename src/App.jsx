import SingleFileUpload from "./singleFileUpload";
import MultipleFileUpload from "./multipleFileUpload";
import JsonFormatFileUpload from "./jsonFormatFileUpload";

function App() {
  return (
    <div>
      <h1>File Upload Platform</h1>
      <p>
        <h3>Uplaod single file</h3>
        <SingleFileUpload />
      </p>
      <br />
      <p>
        <h3>Upload multiple files</h3>
        <MultipleFileUpload />
      </p>
      <br />
      <p>
        <h3>Upload files in JSON format folder structure</h3>
        <JsonFormatFileUpload />
      </p>
      <br />
    </div>
  );
}

export default App;
