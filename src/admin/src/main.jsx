import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SWRConfig } from "swr";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <App />
    </SWRConfig>
  </StrictMode>
);
