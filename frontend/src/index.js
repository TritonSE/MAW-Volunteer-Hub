import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import history from "./history";
import "./index.css";
import App from "./App";

function CustomRouter({ ...props }) {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}

ReactDOM.render(
  <React.StrictMode>
    <CustomRouter>
      <App />
    </CustomRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
