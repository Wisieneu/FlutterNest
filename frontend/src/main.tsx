import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

import "./index.scss";

const rootElement = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")!).render(rootElement);
