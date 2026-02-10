"use client";
import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("SW registrado:", reg))
        .catch((err) => console.error("SW error:", err));
    }
  }, []);

  return null;
}