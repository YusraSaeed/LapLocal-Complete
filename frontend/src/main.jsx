// ✅ main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <Toaster position="top-right" reverseOrder={false} />
    <App />
  </AppProvider>
);