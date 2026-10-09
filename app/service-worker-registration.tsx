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

    const register = () => {
      navigator.serviceWorker.register("/service-worker.js").catch((error) => {
        console.error("AgriLink service worker registration failed:", error);
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
