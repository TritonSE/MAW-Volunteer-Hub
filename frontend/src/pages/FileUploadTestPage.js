import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const DEBUG_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYxZjg1MGZjMTQ3MmM1ZDA2MWFiNDZhZiIsImVtYWlsIjoidGVzdEBlbWFpbC5jb20ifSwiaWF0IjoxNjQ0MDA3ODMxfQ.z1EIWevtvEW09mUss8yPN64UtLvqNWUZbzffYl0f9vQ";

async function postFile({ file, name }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  const result = await axios.post(
    // "http://localhost:3000/file/upload?secret_token=abc", // invalid secret token
    "http://localhost:3000/file/Upload?secret_token=" + DEBUG_TOKEN,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return result.data;
}

function ProfilePage() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const result = await postFile({ file, name });
    console.log(result);
  };
  const fileSelected = (event) => {
    const f = event.target.files[0];
    setFile(f);
  };

  const loadFile = async () => {
    const loadname = document.getElementById("show-textbox").value;

    const result = await axios.get(
      `http://localhost:3000/file/Display/${encodeURIComponent(loadname)}`,
      {
        headers: {
          Authorization: `bearer ${DEBUG_TOKEN}`,
        },
      }
    );

    const data = typeof result.data === "string" ? result.data : JSON.stringify(result.data);

    /*
     * TODO: This is a very crude way of detecting PDFs.
     *   MIME type detection should be done server-side
     *   and put in the Content-Type header, but this works
     *   temporarily.
     */
    const type = (() => {
      if (data.substring(0, 4) === "%PDF") return "application/pdf";

      return result.headers["content-type"] ?? "text/plain";
    })();

    const url = window.URL.createObjectURL(
      new Blob([data], {
        type,
      })
    );
    window.open(url);
  };

  /*
  const updateFilename = async () => {
    const old_name = document.getElementById("update-filename-old").value;
    const new_name = document.getElementById("update-filename-new").value;

    const formData = new FormData();
    formData.append("key", old_name);
    formData.append("updated_key", new_name);
    const result = await axios.patch(
      `http://localhost:3000/file/Update/${encodeURIComponent(
        old_name
      )}?secret_token=${DEBUG_TOKEN}`,
      `updated_key=${encodeURIComponent(new_name)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(result);
  };

  const update_submit = async (e) => {
    e.preventDefault();

    const filename = document.getElementById("update_file-filename").value;
    const newFilename = document.getElementById("update_file-newfilename").value;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("updated_file_name", newFilename);
    formData.append("Category_ID", "test");
    const result = await axios.post(
      `http://localhost:3000/file/Update/${encodeURIComponent(
        filename
      )}?secret_token=${DEBUG_TOKEN}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(result);
  };
  */

  const update_submit = async (e) => {
    e.preventDefault();

    const old_name = document.getElementById("update-filename").value;
    const new_name = document.getElementById("update-newfilename").value;

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (new_name.trim() !== "") formData.append("updated_file_name", new_name);

    const result = await axios.patch(
      `http://localhost:3000/file/Update/${encodeURIComponent(
        old_name
      )}?secret_token=${DEBUG_TOKEN}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(result);
  };

  const delete_file = async () => {
    const deletename = document.getElementById("delete-filename").value;

    const result = await axios.delete(
      `http://localhost:3000/file/Delete/${encodeURIComponent(
        deletename
      )}?secret_token=${DEBUG_TOKEN}`
    );
    console.log(result);
  };

  const delete_category = async () => {
    const deletename = document.getElementById("delete-category").value;

    const result = await axios.delete(
      `http://localhost:3000/file/Deletecat/${encodeURIComponent(
        deletename
      )}?secret_token=${DEBUG_TOKEN}`
    );
    console.log(result);
  };

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          name="name"
          placeholder="Filename"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <input onChange={fileSelected} type="file" />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      <br />
      <h1>Retrieve File</h1>
      <input type="text" id="show-textbox" placeholder="Filename" />
      <button type="button" onClick={() => loadFile()}>
        load
      </button>
      <br />
      <h1>Update</h1>
      <form onSubmit={update_submit}>
        <input type="text" placeholder="Filename" id="update-filename" />
        <input type="text" placeholder="New filename" id="update-newfilename" />
        <br />
        <br />
        <input onChange={fileSelected} type="file" />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      <br />
      <h1>Delete File</h1>
      <input id="delete-filename" />
      <button type="button" onClick={delete_file}>
        Delete
      </button>
      <br />
      <h1>Delete Category</h1>
      <input id="delete-category" />
      <button type="button" onClick={delete_category}>
        Delete
      </button>
      <br />
      <br />
    </div>
  );
}

export default ProfilePage;
