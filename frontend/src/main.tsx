import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Contextt from "./Contextt";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Contextt>
      <App />
    </Contextt>
  </React.StrictMode>
);
