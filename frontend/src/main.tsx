import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

import "./index.scss";

const env = import.meta.env.VITE_ENV;

const rootElement =
  env == "PROD" ? (
    <App />
  ) : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

ReactDOM.createRoot(document.getElementById("root")!).render(rootElement);
