import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import FunctionMenu from "./FunctionMenu";
import Header from "./Header";
import CheckPage from "./CheckPage";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Header />
    <CheckPage />
  </React.StrictMode>
);
