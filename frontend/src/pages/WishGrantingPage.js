import React from "react";
import SideNav from "../components/SideNav";
import { SIDENAV_STEPS } from "../constants/links";

function WishGrantingPage() {
  function gen_fs() {
    return SIDENAV_STEPS.map((name) => [
      {
        id: Math.random(),
        name: `${name} Files`,
        files: [
          { name: "Example File #1", contents: "hello" },
          { name: "Example File #2", contents: "world" },
          { name: "Example File #3", contents: "this is a sample file" },
          { name: "Example File #4", contents: "this is also a sample file" },
        ],
      },
      { id: Math.random(), name: "Category", files: [] },
    ]);
  }

  const fs = JSON.parse(localStorage.getItem("temp_files")) ?? gen_fs();

  function write_files(id, arr) {
    fs[id] = arr.slice();
    localStorage.setItem("temp_files", JSON.stringify(fs));
  }

  function get_context(tab, id) {
    return [fs[id], (f) => write_files(id, f)];
  }

  const tabs = SIDENAV_STEPS.map((name) => ({
    tab_route: name.toLowerCase().replace(/ |&/g, "-"),
    tab_name: name,
  }));

  return <SideNav tabs={tabs} getContext={(...args) => get_context(...args)} />;
}

export default WishGrantingPage;
