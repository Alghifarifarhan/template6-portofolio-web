"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SiteData } from "@/types/siteData";
import { defaultSiteData, cleanSiteData } from "@/lib/defaultSiteData";

interface SiteDataContextType {
  siteData: SiteData;
  updateSiteData: (newData: SiteData) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  clearAllSampleData: () => Promise<void>;
  isLoaded: boolean;
  isSaving: boolean;
}

const SiteDataContext = createContext<SiteDataContextType>({
  siteData: defaultSiteData,
  updateSiteData: async () => {},
  resetToDefaults: async () => {},
  clearAllSampleData: async () => {},
  isLoaded: false,
  isSaving: false,
});

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamically update CSS root variables whenever theme colors change
  useEffect(() => {
    if (typeof window === "undefined" || !siteData?.theme) return;
    const root = document.documentElement;
    const t = siteData.theme;

    if (t.accentColor) root.style.setProperty("--accent-color", t.accentColor);
    if (t.headingColor) root.style.setProperty("--heading-color", t.headingColor);
    if (t.textColor) root.style.setProperty("--text-color", t.textColor);
    if (t.backgroundColor) root.style.setProperty("--background-color", t.backgroundColor);
    if (t.cardBgColor) root.style.setProperty("--card-bg-color", t.cardBgColor);
    if (t.cardTextColor) root.style.setProperty("--card-text-color", t.cardTextColor);
  }, [siteData?.theme]);

  // Helper to broadcast siteData to other open tabs/windows
  const broadcastUpdate = (data: SiteData) => {
    if (typeof window !== "undefined") {
      try {
        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel("template6_site_data_sync");
          channel.postMessage({ type: "UPDATE_SITE_DATA", data });
          channel.close();
        }
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }
  };

  useEffect(() => {
    // 1. Load cached data from localStorage first for instant rendering
    try {
      const cached = localStorage.getItem("template6_siteData");
      if (cached) {
        setSiteData(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Failed to load local cached siteData:", e);
    }

    // 2. Inter-tab real-time sync using BroadcastChannel
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("template6_site_data_sync");
        channel.onmessage = (event) => {
          if (event.data?.type === "UPDATE_SITE_DATA" && event.data?.data) {
            setSiteData(event.data.data);
            try {
              localStorage.setItem("template6_siteData", JSON.stringify(event.data.data));
            } catch (err) {
              console.warn("LocalStorage sync error:", err);
            }
          }
        };
      } catch (e) {
        console.warn("Failed to initialize BroadcastChannel:", e);
      }
    }

    // 3. Fallback Storage event listener for cross-tab sync
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "template6_siteData" && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setSiteData(parsed);
        } catch (err) {
          console.warn("Storage sync parse error:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    // 4. Real-time sync with Cloud Firestore document settings/siteData
    const docRef = doc(db, "settings", "siteData");
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as SiteData;
          setSiteData(remoteData);
          try {
            localStorage.setItem("template6_siteData", JSON.stringify(remoteData));
          } catch (e) {
            console.warn("Failed to update local cache:", e);
          }
          broadcastUpdate(remoteData);
        } else {
          // Document does not exist in Firestore yet -> initialize with default template data
          setDoc(docRef, defaultSiteData).catch((err) =>
            console.warn("Auto-initialization of Firestore siteData doc:", err)
          );
        }
        setIsLoaded(true);
      },
      (error) => {
        console.warn("Firestore subscription error, falling back to local state:", error);
        setIsLoaded(true);
      }
    );

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
      unsubscribe();
    };
  }, []);

  const updateSiteData = async (newData: SiteData) => {
    setIsSaving(true);
    try {
      setSiteData(newData);
      try {
        localStorage.setItem("template6_siteData", JSON.stringify(newData));
      } catch (e) {
        console.warn("LocalStorage save error:", e);
      }
      broadcastUpdate(newData);

      const docRef = doc(db, "settings", "siteData");
      await setDoc(docRef, newData, { merge: true });
    } catch (error) {
      console.error("Failed to update siteData in Firestore:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = async () => {
    setIsSaving(true);
    try {
      setSiteData(defaultSiteData);
      try {
        localStorage.setItem("template6_siteData", JSON.stringify(defaultSiteData));
      } catch (e) {
        console.warn("LocalStorage reset error:", e);
      }
      broadcastUpdate(defaultSiteData);

      const docRef = doc(db, "settings", "siteData");
      await setDoc(docRef, defaultSiteData);
    } catch (error) {
      console.error("Failed to reset siteData in Firestore:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const clearAllSampleData = async () => {
    setIsSaving(true);
    try {
      setSiteData(cleanSiteData);
      try {
        localStorage.setItem("template6_siteData", JSON.stringify(cleanSiteData));
      } catch (e) {
        console.warn("LocalStorage clear error:", e);
      }
      broadcastUpdate(cleanSiteData);

      const docRef = doc(db, "settings", "siteData");
      await setDoc(docRef, cleanSiteData);
    } catch (error) {
      console.error("Failed to clear siteData in Firestore:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        siteData,
        updateSiteData,
        resetToDefaults,
        clearAllSampleData,
        isLoaded,
        isSaving,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => useContext(SiteDataContext);
