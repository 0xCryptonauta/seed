import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Service Worker registration with update handling
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = "/sw.js";

    // Check if service worker is supported and we're not in development
    if (import.meta.env.PROD) {
      navigator.serviceWorker
        .register(swUrl, { scope: "/" })
        .then((registration) => {
          console.log("ServiceWorker registration successful");

          // Handle updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    // New update available
                    console.log("New content is available; please refresh.");
                    // You can add a UI notification here
                  } else {
                    // Content is cached for offline use
                    console.log("Content is cached for offline use.");
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error("ServiceWorker registration failed:", error);
        });
    } else {
      console.log("ServiceWorker registration skipped in development");
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
