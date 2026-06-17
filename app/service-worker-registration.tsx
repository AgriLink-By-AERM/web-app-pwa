"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
    };
  }
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (window.Capacitor?.isNativePlatform?.()) {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch((error) => {
        console.error("AgriLink service worker registration failed:", error);
      });
    });
  }, []);

  return null;
}
