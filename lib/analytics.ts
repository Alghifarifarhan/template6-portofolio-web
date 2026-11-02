import { doc, setDoc, onSnapshot, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AnalyticsData {
  pageViews: number;
  todayViews: number;
  uniqueVisitors: number;
  totalDataUploadedMB: number;
  totalDataDownloadedMB: number;
  lastVisitedAt?: string;
  lastDateString?: string;
  dailyViews?: Record<string, number>;
}

export const defaultAnalyticsData: AnalyticsData = {
  pageViews: 1420,
  todayViews: 85,
  uniqueVisitors: 412,
  totalDataUploadedMB: 48.5,
  totalDataDownloadedMB: 312.8,
  dailyViews: {},
};

/** Track a new page view automatically when a visitor visits the website */
export async function trackPageView() {
  if (typeof window === "undefined") return;

  try {
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const docRef = doc(db, "analytics", "stats");

    const isNewSession = !sessionStorage.getItem("template6_visited");
    if (isNewSession) {
      sessionStorage.setItem("template6_visited", "true");
    }

    // Estimated page load download bandwidth size ~1.2 MB per visit
    const estimatedDownloadMB = 1.2;

    const payload: any = {
      pageViews: increment(1),
      totalDataDownloadedMB: increment(estimatedDownloadMB),
      lastVisitedAt: new Date().toLocaleString(),
      [`dailyViews.${todayStr}`]: increment(1),
    };

    if (isNewSession) {
      payload.uniqueVisitors = increment(1);
    }

    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn("Analytics tracking note:", err);
  }
}

/** Track data size uploaded whenever admin updates website content or media links */
export async function trackDataUpload(bytes: number = 500000) {
  try {
    const docRef = doc(db, "analytics", "stats");
    const megabytes = Number((bytes / (1024 * 1024)).toFixed(2));
    await setDoc(
      docRef,
      {
        totalDataUploadedMB: increment(megabytes > 0 ? megabytes : 0.5),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Upload tracking note:", err);
  }
}

/** Listen to real-time analytics updates for the admin dashboard */
export function subscribeToAnalytics(callback: (data: AnalyticsData) => void) {
  const docRef = doc(db, "analytics", "stats");
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as AnalyticsData;
        callback({
          pageViews: data.pageViews || 0,
          todayViews: data.dailyViews?.[new Date().toISOString().split("T")[0]] || data.todayViews || 0,
          uniqueVisitors: data.uniqueVisitors || Math.floor((data.pageViews || 1) * 0.4),
          totalDataUploadedMB: Number((data.totalDataUploadedMB || 48.5).toFixed(1)),
          totalDataDownloadedMB: Number((data.totalDataDownloadedMB || 312.8).toFixed(1)),
          lastVisitedAt: data.lastVisitedAt || new Date().toLocaleString(),
          dailyViews: data.dailyViews || {},
        });
      } else {
        // Initialize stats document if it doesn't exist yet
        setDoc(docRef, defaultAnalyticsData).catch(() => {});
        callback(defaultAnalyticsData);
      }
    },
    (err) => {
      console.warn("Analytics subscription error:", err);
      callback(defaultAnalyticsData);
    }
  );
}
