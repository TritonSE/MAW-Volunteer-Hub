import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

async function postFile({ filex }) {
  const formData = new FormData();
  formData.append("file", filex);

  const result = await axios.post("http://localhost:5000/file/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
}

function ProfilePage() {
  const [file, setFile] = useState("");
  const [fileName, setName] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const result = await postFile({ file });
  };
  const fileSelected = (event) => {
    const f = event.target.files[0];
    setFile(f);
  };

  const loadFile = async () => {
    const name = document.getElementById("show-textbox").value;
    window.open(`http://localhost:5000/file/display/${name}`);
  };
  return (
    <div>
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" />
        <button type="submit">Submit</button>
      </form>
      <input type="text" id="show-textbox" />
      <button type="button" onClick={() => loadFile()}>
        load
      </button>
    </div>
  );
}

export default ProfilePage;
