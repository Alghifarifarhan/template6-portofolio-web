"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSiteData } from "@/context/SiteDataContext";
import { cleanSiteData } from "@/lib/defaultSiteData";
import { parseDriveImageUrl } from "@/lib/utils/drive";
import {
  subscribeToAnalytics,
  trackDataUpload,
  AnalyticsData,
  defaultAnalyticsData,
} from "@/lib/analytics";
import {
  SiteData,
  StatItem,
  SkillItem,
  ResumeEduItem,
  ResumeExpItem,
  PortfolioItem,
  ServiceItem,
  SocialLink,
  InfoGridItem,
} from "@/types/siteData";
import {
  Lock,
  Mail,
  LogOut,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Image as ImageIcon,
  Palette,
  Compass,
  User as UserIcon,
  BarChart2,
  FileText,
  Briefcase,
  Sliders,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Share2,
  Eye,
  EyeOff,
  ShieldCheck,
  Key,
  Download,
  Upload,
  Database,
  FileJson,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  HardDrive,
  Users,
  Calendar,
  Sparkles,
  Check,
  Globe,
  Smile,
  BookOpen,
  Headset,
  Award,
  Coffee,
  Zap,
  Star,
  Heart,
  Trophy,
  Code,
  CheckCircle,
} from "lucide-react";

const availableIcons = [
  { name: "Smile", label: "Smile / Happy", icon: Smile },
  { name: "BookOpen", label: "Book / Projects", icon: BookOpen },
  { name: "Headset", label: "Headset / Support", icon: Headset },
  { name: "Users", label: "Users / Team", icon: Users },
  { name: "Award", label: "Award / Recognition", icon: Award },
  { name: "Coffee", label: "Coffee / Cups", icon: Coffee },
  { name: "Briefcase", label: "Briefcase / Work", icon: Briefcase },
  { name: "Zap", label: "Zap / Energy", icon: Zap },
  { name: "Star", label: "Star / Rating", icon: Star },
  { name: "Heart", label: "Heart / Love", icon: Heart },
  { name: "Trophy", label: "Trophy / Winner", icon: Trophy },
  { name: "Globe", label: "Globe / Worldwide", icon: Globe },
  { name: "Code", label: "Code / Developer", icon: Code },
  { name: "CheckCircle", label: "Check / Completed", icon: CheckCircle },
];

const PORTFOLIO_TAGS = [
  { key: "app", label: "App" },
  { key: "web", label: "Web" },
  { key: "design", label: "Design" },
  { key: "article", label: "Article" },
  { key: "publication", label: "Publication" },
  { key: "illustration", label: "Illustration" },
  { key: "video_edit", label: "Video Edit" },
  { key: "service", label: "Service" },
  { key: "competition", label: "Competition" },
  { key: "research", label: "Research" },
  { key: "record", label: "Record" },
];

const colorPresets = [
  {
    id: "classic-corporate",
    name: "Classic Corporate",
    badge: "Default 💙",
    description: "Elegan, profesional & terpercaya untuk corporate & business.",
    theme: {
      accentColor: "#0563bb",
      headingColor: "#45505b",
      textColor: "#272829",
      backgroundColor: "#ffffff",
      cardBgColor: "#f8fafc",
      cardTextColor: "#334155",
    },
    previewColors: ["#0563bb", "#45505b", "#272829", "#ffffff", "#f8fafc", "#334155"],
  },
  {
    id: "cyberpunk-dark",
    name: "Cyberpunk Dark",
    badge: "Dark Mode 🌙",
    description: "Futuristik, modern & techy dengan background gelap pekat.",
    theme: {
      accentColor: "#00d2ff",
      headingColor: "#f8fafc",
      textColor: "#94a3b8",
      backgroundColor: "#0f172a",
      cardBgColor: "#1e293b",
      cardTextColor: "#e2e8f0",
    },
    previewColors: ["#00d2ff", "#f8fafc", "#94a3b8", "#0f172a", "#1e293b", "#e2e8f0"],
  },
  {
    id: "emerald-tech",
    name: "Emerald Tech",
    badge: "Eco Nature 🌿",
    description: "Segar, organik & ramah lingkungan untuk developer & agritech.",
    theme: {
      accentColor: "#10b981",
      headingColor: "#064e3b",
      textColor: "#1f2937",
      backgroundColor: "#f0fdf4",
      cardBgColor: "#ffffff",
      cardTextColor: "#111827",
    },
    previewColors: ["#10b981", "#064e3b", "#1f2937", "#f0fdf4", "#ffffff", "#111827"],
  },
  {
    id: "luxury-violet",
    name: "Luxury Violet",
    badge: "Creative Luxe 💜",
    description: "Eksklusif, artistik & berkelas tinggi untuk desainer kreatif.",
    theme: {
      accentColor: "#7c3aed",
      headingColor: "#1e1b4b",
      textColor: "#334155",
      backgroundColor: "#f8fafc",
      cardBgColor: "#ffffff",
      cardTextColor: "#1e1b4b",
    },
    previewColors: ["#7c3aed", "#1e1b4b", "#334155", "#f8fafc", "#ffffff", "#1e1b4b"],
  },
  {
    id: "sunset-amber",
    name: "Sunset Amber",
    badge: "Warm Zinc 🌅",
    description: "Hangat, energik & dinamis untuk content creator & agensi.",
    theme: {
      accentColor: "#f59e0b",
      headingColor: "#fef3c7",
      textColor: "#d1d5db",
      backgroundColor: "#18181b",
      cardBgColor: "#27272a",
      cardTextColor: "#f4f4f5",
    },
    previewColors: ["#f59e0b", "#fef3c7", "#d1d5db", "#18181b", "#27272a", "#f4f4f5"],
  },
];

/** Helper component to display a live thumbnail preview of an image URL (including Google Drive links) */
function ImagePreviewBox({ url, title }: { url?: string; title?: string }) {
  const parsedUrl = parseDriveImageUrl(url || "");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [url]);

  if (!url || url.trim() === "") {
    return (
      <div className="mt-2 p-3 bg-slate-900/50 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
        Belum ada link foto. Tempelkan URL gambar atau link Google Drive di atas untuk melihat preview langsung.
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 font-semibold text-blue-400">
          <Eye size={12} /> Live Preview {title ? `(${title})` : ""}
        </span>
        {url.includes("drive.google.com") && (
          <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded-full font-mono text-[10px]">
            Google Drive Detected
          </span>
        )}
      </div>

      <div className="relative aspect-video w-full max-h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
        {!imgError ? (
          <img
            src={parsedUrl}
            alt="Live Preview"
            className="w-full h-full object-cover object-center"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="p-4 text-center text-xs text-rose-400 flex flex-col items-center gap-1">
            <AlertCircle size={18} />
            <span>Unable to load image preview. Please verify the URL or Google Drive sharing permissions.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { siteData, updateSiteData, resetToDefaults, clearAllSampleData, isSaving } = useSiteData();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalyticsData);

  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  // Editor Form State
  const [formData, setFormData] = useState<SiteData>(siteData);
  const [rolesInput, setRolesInput] = useState<string>("");
  const [isTypingRoles, setIsTypingRoles] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "analytics" | "theme" | "nav" | "hero" | "about" | "stats_skills" | "resume" | "portfolio" | "services" | "contact" | "security"
  >("analytics");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Database JSON Backup & Restore State
  const [dbExporting, setDbExporting] = useState(false);
  const [dbImporting, setDbImporting] = useState(false);
  const [dbMessage, setDbMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const accentColor = formData.theme?.accentColor || siteData.theme?.accentColor || "#0563bb";

  // Sync formData when siteData loads or updates
  useEffect(() => {
    if (siteData) {
      setFormData(siteData);
      if (!isTypingRoles) {
        const formattedRoles =
          siteData.hero?.roles
            ?.map((r) => r.replace(/\./g, " ").trim().replace(/\s+/g, " "))
            .filter(Boolean)
            .join(", ") || "";
        setRolesInput(formattedRoles);
      }
    }
  }, [siteData, isTypingRoles]);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen for real-time Analytics updates from Cloud Firestore
  useEffect(() => {
    const unsubscribe = subscribeToAnalytics((data) => {
      setAnalytics(data);
    });
    return () => unsubscribe();
  }, []);

  // Login Auth Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let msg = err.message || "Failed to authenticate.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/user-not-found") {
        msg = "No user found with this email. Switch to Sign Up if you need to create an admin account.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "Email is already registered. Please Sign In instead.";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Change Admin Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess(false);

    if (!user || !user.email) {
      setPwdError("User session not found.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPwdError("Password must be at least 6 characters long.");
      return;
    }

    setPwdSubmitting(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setPwdSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdSuccess(false), 5000);
    } catch (err: any) {
      console.error("Password update error:", err);
      let msg = err.message || "Failed to update password.";
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = "Current password is incorrect.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password is too weak. Please use a stronger password.";
      }
      setPwdError(msg);
    } finally {
      setPwdSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Save changes to Firebase / SiteDataContext
  const handleSaveChanges = async () => {
    setSaveError("");
    setSaveSuccess(false);

    try {
      await updateSiteData(formData);
      await trackDataUpload(650000); // Track content upload traffic in MB
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error("Save error:", err);
      setSaveError(err.message || "Failed to save changes to Firebase.");
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all content to the default template settings?")) {
      try {
        setRolesInput("Web Developer, Graphic Design, Freelancer, UI/UX Specialist");
        await resetToDefaults();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } catch (err: any) {
        setSaveError(err.message || "Failed to reset settings.");
      }
    }
  };

  const handleClearSampleData = async () => {
    if (
      confirm(
        "Apakah Anda yakin ingin membersihkan semua data contoh template?\n\nSeluruh teks contoh (nama, peran hero, deskripsi, skill, resume timeline, portofolio, certificate) dan link gambar contoh akan dikosongkan agar Anda dapat menginput portofolio baru yang bersih.\n\nHak cipta / copyright tetap dipertahankan."
      )
    ) {
      try {
        setRolesInput("");
        setFormData(cleanSiteData);
        await clearAllSampleData();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 5000);
      } catch (err: any) {
        setSaveError(err.message || "Gagal membersihkan data contoh.");
      }
    }
  };

  // Download database.json handler
  const handleDownloadDatabase = () => {
    try {
      setDbExporting(true);
      setDbMessage(null);
      const dataToExport = formData || siteData;
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "database.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDbMessage({ text: "Database JSON file successfully downloaded (database.json)!", isError: false });
      setTimeout(() => setDbMessage(null), 5000);
    } catch (err: any) {
      console.error("Export error:", err);
      setDbMessage({ text: "Failed to export database: " + (err.message || "Unknown error"), isError: true });
    } finally {
      setDbExporting(false);
    }
  };

  // Import database.json handler
  const handleImportDatabase = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDbImporting(true);
    setDbMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          throw new Error("File is empty.");
        }
        const parsed = JSON.parse(text) as SiteData;
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid JSON format. Expected a database object.");
        }

        // Basic sanity check to ensure it's a valid SiteData structure
        if (!parsed.theme && !parsed.hero && !parsed.about && !parsed.portfolio) {
          throw new Error("The selected file does not appear to be a valid siteData database backup.");
        }

        // Merge with existing default structure for any missing fields
        const mergedData: SiteData = {
          ...cleanSiteData,
          ...parsed,
          theme: { ...cleanSiteData.theme, ...(parsed.theme || {}) },
          header: { ...cleanSiteData.header, ...(parsed.header || {}) },
          hero: { ...cleanSiteData.hero, ...(parsed.hero || {}) },
          about: { ...cleanSiteData.about, ...(parsed.about || {}) },
          stats: { ...cleanSiteData.stats, ...(parsed.stats || {}) },
          skills: { ...cleanSiteData.skills, ...(parsed.skills || {}) },
          resume: { ...cleanSiteData.resume, ...(parsed.resume || {}) },
          portfolio: { ...cleanSiteData.portfolio, ...(parsed.portfolio || {}) },
          services: { ...cleanSiteData.services, ...(parsed.services || {}) },
          contact: { ...cleanSiteData.contact, ...(parsed.contact || {}) },
          footer: { ...cleanSiteData.footer, ...(parsed.footer || {}) },
        };

        setFormData(mergedData);
        await updateSiteData(mergedData);

        setDbMessage({
          text: `Database JSON successfully imported and synced to Cloud Firestore (${file.name})!`,
          isError: false,
        });
        setTimeout(() => setDbMessage(null), 6000);
      } catch (err: any) {
        console.error("Import error:", err);
        setDbMessage({
          text: "Failed to import database: " + (err.message || "Invalid JSON format"),
          isError: true,
        });
      } finally {
        setDbImporting(false);
        e.target.value = ""; // Reset input so same file can be re-imported
      }
    };

    reader.onerror = () => {
      setDbMessage({ text: "Failed to read the selected file.", isError: true });
      setDbImporting(false);
      e.target.value = "";
    };

    reader.readAsText(file);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 size={32} style={{ color: accentColor }} className="animate-spin" />
      </div>
    );
  }

  // 1. UNAUTHENTICATED: LOGIN / SIGN UP FORM
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div
              style={{ backgroundColor: `${accentColor}20`, color: accentColor, borderColor: `${accentColor}40` }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border"
            >
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">
              {isSignUp ? "Create your admin credentials" : "Sign in to manage portfolio content"}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              style={{ backgroundColor: accentColor }}
              className="w-full py-3.5 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {authSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : isSignUp ? (
                "Create Admin Account"
              ) : (
                "Sign In to Admin Panel"
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError("");
              }}
              style={{ color: accentColor }}
              className="text-xs hover:underline transition-colors font-medium cursor-pointer"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need to create a new admin account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${accentColor}20`, color: accentColor, borderColor: `${accentColor}40` }}
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
          >
            <Sliders size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Portfolio Admin Studio</h1>
            <span className="text-xs text-slate-400">Firebase Auth: {user.email}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <ExternalLink size={14} /> View Main Site
          </Link>
          <button
            onClick={handleClearSampleData}
            disabled={isSaving}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition-colors disabled:opacity-50 cursor-pointer"
            title="Bersihkan Semua Data Contoh Template"
          >
            <Trash2 size={14} /> Bersihkan Data Contoh
          </button>
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            style={{ backgroundColor: accentColor }}
            className="px-5 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save All Changes
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Save Status Banners */}
        {saveSuccess && (
          <div className="lg:col-span-12 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-sm font-medium animate-in fade-in">
            <CheckCircle2 size={20} className="shrink-0" />
            <span>Success! All changes have been saved to Cloud Firestore and synced to the main site.</span>
          </div>
        )}

        {saveError && (
          <div className="lg:col-span-12 flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-sm font-medium animate-in fade-in">
            <AlertCircle size={20} className="shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Sidebar Tabs (Horizontal Slide on Mobile, Sticky Vertical on Desktop) */}
        <aside className="w-full lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto no-scrollbar scrollbar-none pb-2 lg:pb-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] pr-1 custom-scrollbar">
          {[
            { id: "analytics", label: "Analytics & Traffic", icon: BarChart3 },
            { id: "theme", label: "Theme & Colors", icon: Palette },
            { id: "nav", label: "Navigation & Footer", icon: Compass },
            { id: "hero", label: "Hero & Social Media", icon: Share2 },
            { id: "about", label: "About Section & Info Grid", icon: UserIcon },
            { id: "stats_skills", label: "Stats & Skills", icon: BarChart2 },
            { id: "resume", label: "Resume Timeline", icon: FileText },
            { id: "portfolio", label: "Portfolio Items", icon: ImageIcon },
            { id: "services", label: "Certificates", icon: Award },
            { id: "contact", label: "Contact & Formspree", icon: PhoneCall },
            { id: "security", label: "Security & Account", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  backgroundColor: active ? accentColor : undefined,
                }}
                className={`shrink-0 lg:shrink lg:w-full flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer whitespace-nowrap ${
                  active
                    ? "text-white shadow-lg"
                    : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Editor Form Container */}
        <main className="lg:col-span-9 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
          {/* TAB 0: ANALYTICS & TRAFFIC */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 size={22} style={{ color: accentColor }} /> Real-Time Website Visitor Analytics &amp; Traffic
                </h2>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Firestore Sync
                </span>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Visits */}
                <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Total Kunjungan</span>
                    <Eye size={16} style={{ color: accentColor }} />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {analytics.pageViews.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <ArrowUpRight size={14} /> +{analytics.todayViews} kunjungan hari ini
                  </div>
                </div>

                {/* Unique Visitors */}
                <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Pengunjung Unik</span>
                    <Users size={16} style={{ color: accentColor }} />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {analytics.uniqueVisitors.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Est. sesi unik pengunjung
                  </div>
                </div>

                {/* Data Upload Traffic */}
                <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Total Data Upload</span>
                    <ArrowUpRight size={16} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {analytics.totalDataUploadedMB > 1024
                      ? `${(analytics.totalDataUploadedMB / 1024).toFixed(2)} GB`
                      : `${analytics.totalDataUploadedMB} MB`}
                  </div>
                  <div className="text-[11px] text-blue-400 font-medium">
                    Media &amp; konten terupload dari admin
                  </div>
                </div>

                {/* Data Download Bandwidth */}
                <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Total Data Download</span>
                    <ArrowDownRight size={16} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {analytics.totalDataDownloadedMB > 1024
                      ? `${(analytics.totalDataDownloadedMB / 1024).toFixed(2)} GB`
                      : `${analytics.totalDataDownloadedMB} MB`}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    Traffic bandwidth ke pengunjung
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp size={18} style={{ color: accentColor }} /> Informasional &amp; Status Server
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Kunjungan Terakhir: {analytics.lastVisitedAt || "Baru saja"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-semibold text-slate-300 block">📊 Ringkasan Traffic Kunjungan</span>
                    <ul className="space-y-1.5 text-slate-400">
                      <li className="flex justify-between">
                        <span>Status Tracking:</span>
                        <strong className="text-emerald-400 font-mono">Aktif (Real-Time Cloud Firestore)</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>Rata-Rata Ukuran Halaman:</span>
                        <strong className="text-white font-mono">~1.2 MB per muatan</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>Total Kunjungan Terakumulasi:</span>
                        <strong className="text-white font-mono">{analytics.pageViews} views</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-semibold text-slate-300 block">💾 Transfer Data Website</span>
                    <ul className="space-y-1.5 text-slate-400">
                      <li className="flex justify-between">
                        <span>Data Terupload (Admin):</span>
                        <strong className="text-blue-400 font-mono">{analytics.totalDataUploadedMB} MB</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>Bandwidth Terlayani (Pengunjung):</span>
                        <strong className="text-emerald-400 font-mono">{analytics.totalDataDownloadedMB} MB</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>Status Hosting &amp; Firestore:</span>
                        <strong className="text-emerald-400 font-mono">Connected &amp; Synchronized</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: THEME & COLORS */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Palette size={22} style={{ color: accentColor }} /> Advanced Theme Colors &amp; Styling
              </h2>

              {/* PRESET PALETTES */}
              <div className="space-y-3 pb-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Sparkles size={16} style={{ color: accentColor }} /> Preset Color Palettes
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pilih salah satu dari 5 kombinasi palet warna siap pakai untuk mengubah seluruh nuansa website secara instan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-2">
                  {colorPresets.map((preset) => {
                    const isSelected =
                      formData.theme?.accentColor?.toLowerCase() === preset.theme.accentColor.toLowerCase() &&
                      formData.theme?.backgroundColor?.toLowerCase() === preset.theme.backgroundColor.toLowerCase() &&
                      formData.theme?.cardBgColor?.toLowerCase() === preset.theme.cardBgColor.toLowerCase();

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            theme: { ...preset.theme },
                          });
                        }}
                        className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden group cursor-pointer ${
                          isSelected
                            ? "border-blue-500 bg-slate-800 shadow-lg ring-2 ring-blue-500/30"
                            : "border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                            {preset.name}
                          </span>
                          {isSelected ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md">
                              <Check size={11} /> Aktif
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">{preset.badge}</span>
                          )}
                        </div>

                        {/* Live Color Card Mockup Preview */}
                        <div
                          className="rounded-xl p-2.5 mb-2.5 border border-slate-700/60 flex flex-col gap-1.5 transition-transform group-hover:scale-[1.02]"
                          style={{ backgroundColor: preset.theme.backgroundColor }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold truncate max-w-[70px]" style={{ color: preset.theme.headingColor }}>
                              Aa Headline
                            </span>
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: preset.theme.accentColor }}
                            >
                              ★
                            </span>
                          </div>
                          <div
                            className="p-1.5 rounded-lg border border-black/5 shadow-xs"
                            style={{ backgroundColor: preset.theme.cardBgColor }}
                          >
                            <span className="text-[10px] font-medium block truncate" style={{ color: preset.theme.cardTextColor }}>
                              Card Box Item
                            </span>
                          </div>
                        </div>

                        {/* Color Swatch Dots */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span
                            title={`Accent: ${preset.theme.accentColor}`}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: preset.theme.accentColor }}
                          />
                          <span
                            title={`Heading: ${preset.theme.headingColor}`}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: preset.theme.headingColor }}
                          />
                          <span
                            title={`Text: ${preset.theme.textColor}`}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: preset.theme.textColor }}
                          />
                          <span
                            title={`Background: ${preset.theme.backgroundColor}`}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: preset.theme.backgroundColor }}
                          />
                          <span
                            title={`Card: ${preset.theme.cardBgColor}`}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: preset.theme.cardBgColor }}
                          />
                        </div>

                        <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-tight">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-slate-300">Custom Typography &amp; Background Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Primary Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.theme?.accentColor || "#0563bb"}
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, accentColor: e.target.value } })
                        }
                        className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-slate-700 p-1"
                      />
                      <input
                        type="text"
                        value={formData.theme?.accentColor || "#0563bb"}
                        placeholder="#0563bb"
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, accentColor: e.target.value } })
                        }
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Heading &amp; Title Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.theme?.headingColor || "#45505b"}
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, headingColor: e.target.value } })
                        }
                        className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-slate-700 p-1"
                      />
                      <input
                        type="text"
                        value={formData.theme?.headingColor || "#45505b"}
                        placeholder="#45505b"
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, headingColor: e.target.value } })
                        }
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Description &amp; Body Text Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.theme?.textColor || "#272829"}
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, textColor: e.target.value } })
                        }
                        className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-slate-700 p-1"
                      />
                      <input
                        type="text"
                        value={formData.theme?.textColor || "#272829"}
                        placeholder="#272829"
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, textColor: e.target.value } })
                        }
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Website Background Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.theme?.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, backgroundColor: e.target.value } })
                        }
                        className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-slate-700 p-1"
                      />
                      <input
                        type="text"
                        value={formData.theme?.backgroundColor || "#ffffff"}
                        placeholder="#ffffff"
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, backgroundColor: e.target.value } })
                        }
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Card Box &amp; Footer Background Color (Stats, Portfolio, Certificate, Contact, Footer)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.theme?.cardBgColor || "#ffffff"}
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, cardBgColor: e.target.value } })
                        }
                        className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-slate-700 p-1"
                      />
                      <input
                        type="text"
                        value={formData.theme?.cardBgColor || "#ffffff"}
                        placeholder="#f8fafc"
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, cardBgColor: e.target.value } })
                        }
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Card Text Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.theme?.cardTextColor || "#45505b"}
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, cardTextColor: e.target.value } })
                        }
                        className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-slate-700 p-1"
                      />
                      <input
                        type="text"
                        value={formData.theme?.cardTextColor || "#45505b"}
                        placeholder="#334155"
                        onChange={(e) =>
                          setFormData({ ...formData, theme: { ...formData.theme, cardTextColor: e.target.value } })
                        }
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NAVIGATION & FOOTER */}
          {activeTab === "nav" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Compass size={22} style={{ color: accentColor }} /> Navigation Menu Labels &amp; Section Title Sync
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">Navigation Menu Items</h3>
                  <span style={{ color: accentColor }} className="text-xs font-medium">
                    ✨ Editing nav label automatically updates the page section heading!
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.header?.navItems?.map((nav, idx) => (
                    <div key={nav.id} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 space-y-1">
                      <span className="text-xs text-slate-400 uppercase font-semibold">Section ID: {nav.id}</span>
                      <input
                        type="text"
                        value={nav.label}
                        placeholder={`Menu Label (e.g. ${nav.id.charAt(0).toUpperCase() + nav.id.slice(1)})`}
                        onChange={(e) => {
                          const newLabel = e.target.value;
                          const updatedNavs = [...formData.header.navItems];
                          updatedNavs[idx].label = newLabel;

                          let newAbout = { ...formData.about };
                          let newSkills = { ...formData.skills };
                          let newResume = { ...formData.resume };
                          let newPortfolio = { ...formData.portfolio };
                          let newServices = { ...formData.services };
                          let newContact = { ...formData.contact };

                          if (nav.id === "about") newAbout.sectionTitle = newLabel;
                          if (nav.id === "skills") newSkills.sectionTitle = newLabel;
                          if (nav.id === "resume") newResume.sectionTitle = newLabel;
                          if (nav.id === "portfolio") newPortfolio.sectionTitle = newLabel;
                          if (nav.id === "certificate" || nav.id === "services") newServices.sectionTitle = newLabel;
                          if (nav.id === "contact") newContact.sectionTitle = newLabel;

                          setFormData({
                            ...formData,
                            header: { ...formData.header, navItems: updatedNavs },
                            about: newAbout,
                            skills: newSkills,
                            resume: newResume,
                            portfolio: newPortfolio,
                            services: newServices,
                            contact: newContact,
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">Footer Information</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400 font-medium">
                    <Lock size={12} className="text-amber-400" />
                    Copyright Terkunci
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Footer Title / Name</label>
                    <input
                      type="text"
                      value={formData.footer?.name || ""}
                      placeholder="Brandon Johnson"
                      onChange={(e) =>
                        setFormData({ ...formData, footer: { ...formData.footer, name: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
                      <span>Copyright &amp; Attribution</span>
                      <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                        <Lock size={10} /> Permanen
                      </span>
                    </label>
                    <div className="w-full px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-400 text-xs select-none">
                      <div className="font-semibold text-slate-200">Copyright Alex Smith All Rights Reserved</div>
                      <div className="text-slate-500 text-[11px]">Designed by BootstrapMade Distribuited by ThemeWagon</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Footer Description Bio</label>
                  <textarea
                    rows={3}
                    value={formData.footer?.bioText || ""}
                    placeholder="Et aut eum quis fuga eos sunt ipsa nihil. Labore corporis magni eligendi fuga maxime saepe commodi placeat..."
                    onChange={(e) =>
                      setFormData({ ...formData, footer: { ...formData.footer, bioText: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HERO & SOCIAL MEDIA */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Share2 size={22} style={{ color: accentColor }} /> Hero &amp; Optional Social Media Links
              </h2>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">Hero Header</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Hero Full Name</label>
                    <input
                      type="text"
                      value={formData.hero?.name || ""}
                      placeholder="Brandon Johnson"
                      onChange={(e) =>
                        setFormData({ ...formData, hero: { ...formData.hero, name: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Hero Background Image (Google Drive link / URL)
                    </label>
                    <input
                      type="text"
                      value={formData.hero?.bgImage || ""}
                      placeholder="https://drive.google.com/file/d/... or /assets/img/hero-bg.jpg"
                      onChange={(e) =>
                        setFormData({ ...formData, hero: { ...formData.hero, bgImage: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                    />
                    <ImagePreviewBox url={formData.hero?.bgImage} title="Hero Background" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Typed Roles (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={rolesInput}
                    onFocus={() => setIsTypingRoles(true)}
                    onBlur={() => {
                      setIsTypingRoles(false);
                      const cleaned = rolesInput
                        .split(",")
                        .map((s) => s.replace(/\./g, " ").trim().replace(/\s+/g, " "))
                        .filter(Boolean);
                      setFormData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, roles: cleaned },
                      }));
                      setRolesInput(cleaned.join(", "));
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRolesInput(val);
                      const rolesArr = val
                        .split(",")
                        .map((s) => s.replace(/\./g, " ").trim().replace(/\s+/g, " "))
                        .filter(Boolean);
                      setFormData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, roles: rolesArr },
                      }));
                    }}
                    placeholder="Web Developer, Graphic Design, Freelancer, UI/UX Specialist"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Contoh: <code>Web Developer, Graphic Design, Freelancer, UI/UX Specialist</code> (Gunakan tanda koma <code>,</code> untuk memisahkan setiap role, dan spasi untuk kata — bukan tanda titik).
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300">Social Media Links</h3>
                    <p className="text-xs text-slate-400">Social links are optional — leave URL empty to hide icon from main site.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSocial: SocialLink = {
                        id: `soc_${Date.now()}`,
                        platform: "twitter",
                        url: "",
                        label: "Social",
                      };
                      const updatedHero = [newSocial, ...(formData.hero?.socialLinks || [])];
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, socialLinks: updatedHero },
                        footer: { ...formData.footer, socialLinks: updatedHero },
                      });
                    }}
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add Social Platform
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.hero?.socialLinks?.map((social, idx) => (
                    <div key={social.id || idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <select
                          value={social.platform}
                          onChange={(e) => {
                            const updated = [...formData.hero.socialLinks];
                            updated[idx].platform = e.target.value;
                            updated[idx].label = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, socialLinks: updated },
                              footer: { ...formData.footer, socialLinks: updated },
                            });
                          }}
                          className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
                        >
                          <option value="twitter">Twitter / X</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="github">GitHub</option>
                          <option value="youtube">YouTube</option>
                          <option value="tiktok">TikTok</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="website">Website</option>
                        </select>

                        <button
                          onClick={() => {
                            const updated = formData.hero.socialLinks.filter((_, i) => i !== idx);
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, socialLinks: updated },
                              footer: { ...formData.footer, socialLinks: updated },
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={social.url}
                        onChange={(e) => {
                          const updated = [...formData.hero.socialLinks];
                          updated[idx].url = e.target.value;
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, socialLinks: updated },
                            footer: { ...formData.footer, socialLinks: updated },
                          });
                        }}
                        placeholder="https://... (leave blank to hide)"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT SECTION & INFO GRID */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <UserIcon size={22} style={{ color: accentColor }} /> About Section &amp; Optional Info Grid
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.about?.sectionTitle || "About"}
                    placeholder="About"
                    onChange={(e) =>
                      setFormData({ ...formData, about: { ...formData.about, sectionTitle: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Section Subtitle Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={formData.about?.sectionDesc || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, about: { ...formData.about, sectionDesc: e.target.value } })
                    }
                    placeholder="Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem..."
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Title Headline</label>
                    <input
                      type="text"
                      value={formData.about?.title || ""}
                      placeholder="UI/UX Designer &amp; Web Developer"
                      onChange={(e) =>
                        setFormData({ ...formData, about: { ...formData.about, title: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Profile Photo (Google Drive link / URL)
                    </label>
                    <input
                      type="text"
                      value={formData.about?.profileImg || ""}
                      placeholder="https://drive.google.com/file/d/... or /assets/img/profile-img.jpg"
                      onChange={(e) =>
                        setFormData({ ...formData, about: { ...formData.about, profileImg: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                    />
                    <ImagePreviewBox url={formData.about?.profileImg} title="About Profile Photo" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Italic Highlight Quote</label>
                  <textarea
                    rows={2}
                    value={formData.about?.italicText || ""}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore..."
                    onChange={(e) =>
                      setFormData({ ...formData, about: { ...formData.about, italicText: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bio Text Paragraph</label>
                  <textarea
                    rows={3}
                    value={formData.about?.bioText || ""}
                    placeholder="Officiis eligendi itaque labore et dolorum mollitia officiis optio vero. Quisquam sunt adipisci omnis et ut..."
                    onChange={(e) =>
                      setFormData({ ...formData, about: { ...formData.about, bioText: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300">Personal Info Grid</h3>
                    <p className="text-xs text-slate-400">All items are optional — leave value blank to hide from About grid.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newItem: InfoGridItem = {
                        id: `inf_${Date.now()}`,
                        label: "Label",
                        value: "",
                      };
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          infoGrid: [newItem, ...(formData.about?.infoGrid || [])],
                        },
                      });
                    }}
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add Info Item
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.about?.infoGrid?.map((item, idx) => (
                    <div key={item.id || idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...formData.about.infoGrid];
                            updated[idx].label = e.target.value;
                            setFormData({ ...formData, about: { ...formData.about, infoGrid: updated } });
                          }}
                          placeholder="Label (e.g. Birthday)"
                          className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-white text-xs font-semibold"
                        />
                        <button
                          onClick={() => {
                            const updated = formData.about.infoGrid.filter((_, i) => i !== idx);
                            setFormData({ ...formData, about: { ...formData.about, infoGrid: updated } });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...formData.about.infoGrid];
                          updated[idx].value = e.target.value;
                          setFormData({ ...formData, about: { ...formData.about, infoGrid: updated } });
                        }}
                        placeholder="Value (e.g. 1 May 1995 or www.example.com)"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STATS & SKILLS */}
          {activeTab === "stats_skills" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <BarChart2 size={22} style={{ color: accentColor }} /> Stats &amp; Skills Descriptions &amp; Numbers
              </h2>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Skills Section Subtitle Text</label>
                <textarea
                  rows={2}
                  value={formData.skills?.sectionDesc || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: { ...formData.skills, sectionDesc: e.target.value } })
                  }
                  placeholder="Necessitatibus eius consequatur ex aliquid fuga eum quidem..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-200">Counter Statistics Numbers</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                        Opsional
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Aktifkan atau nonaktifkan seksi ini. Item yang labelnya dikosongkan tidak akan ditampilkan di website.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.stats?.enabled ?? true}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            stats: {
                              ...formData.stats,
                              enabled: e.target.checked,
                              items: formData.stats?.items || [],
                            },
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2.5 text-xs font-semibold text-slate-300">
                        {formData.stats?.enabled ?? true ? "Aktif" : "Nonaktif"}
                      </span>
                    </label>
                  </div>
                </div>

                {(formData.stats?.enabled ?? true) && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                        Daftar Kartu Statistik ({formData.stats?.items?.length || 0} item)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newStat: StatItem = {
                            id: `stat_${Date.now()}`,
                            iconName: "Smile",
                            target: 100,
                            label: "New Metric",
                          };
                          setFormData({
                            ...formData,
                            stats: {
                              ...formData.stats,
                              items: [newStat, ...(formData.stats?.items || [])],
                            },
                          });
                        }}
                        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus size={14} /> Tambah Item Statistik
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.stats?.items?.map((stat, idx) => (
                        <div key={stat.id || idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3">
                          <div className="flex justify-between items-center">
                            <span style={{ color: accentColor }} className="text-xs font-bold">Stat #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.stats.items.filter((_, i) => i !== idx);
                                setFormData({ ...formData, stats: { ...formData.stats, items: updated } });
                              }}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                              title="Hapus Item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Ikon</label>
                              <select
                                value={stat.iconName || "Smile"}
                                onChange={(e) => {
                                  const updated = [...formData.stats.items];
                                  updated[idx].iconName = e.target.value;
                                  setFormData({ ...formData, stats: { ...formData.stats, items: updated } });
                                }}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                              >
                                <option value="Smile">Smile (Clients)</option>
                                <option value="BookOpen">BookOpen (Projects)</option>
                                <option value="Headset">Headset (Support)</option>
                                <option value="Users">Users (Team)</option>
                                <option value="Award">Award (Certificates)</option>
                                <option value="Coffee">Coffee (Cups)</option>
                                <option value="Briefcase">Briefcase (Jobs)</option>
                                <option value="Zap">Zap (Performance)</option>
                                <option value="Star">Star (Reviews)</option>
                                <option value="Heart">Heart (Likes)</option>
                                <option value="Trophy">Trophy (Wins)</option>
                                <option value="Globe">Globe (Countries)</option>
                                <option value="Code">Code (Repositories)</option>
                                <option value="CheckCircle">CheckCircle (Tasks)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Label (Opsional)</label>
                              <input
                                type="text"
                                value={stat.label || ""}
                                placeholder="Label (e.g. Happy Clients, Projects)"
                                onChange={(e) => {
                                  const updated = [...formData.stats.items];
                                  updated[idx].label = e.target.value;
                                  setFormData({ ...formData, stats: { ...formData.stats, items: updated } });
                                }}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Target Angka</label>
                              <input
                                type="number"
                                value={stat.target ?? ""}
                                placeholder="250"
                                onChange={(e) => {
                                  const updated = [...formData.stats.items];
                                  updated[idx].target = e.target.value === "" ? 0 : Number(e.target.value);
                                  setFormData({ ...formData, stats: { ...formData.stats, items: updated } });
                                }}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">Technical Skills Percentages</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newSkill: SkillItem = {
                        id: `skill_${Date.now()}`,
                        name: "New Skill",
                        level: 80,
                      };
                      setFormData({
                        ...formData,
                        skills: {
                          ...formData.skills,
                          itemsLeft: [newSkill, ...(formData.skills?.itemsLeft || [])],
                        },
                      });
                    }}
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add Skill
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.skills?.itemsLeft?.map((skill, idx) => (
                    <div key={skill.id || idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={skill.name}
                          placeholder="Skill Name (e.g. HTML, React, Python)"
                          onChange={(e) => {
                            const updated = [...formData.skills.itemsLeft];
                            updated[idx].name = e.target.value;
                            setFormData({ ...formData, skills: { ...formData.skills, itemsLeft: updated } });
                          }}
                          className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-white text-sm font-semibold"
                        />
                        <span style={{ color: accentColor }} className="text-sm font-bold">{skill.level}%</span>
                        <button
                          onClick={() => {
                            const updated = formData.skills.itemsLeft.filter((_, i) => i !== idx);
                            setFormData({ ...formData, skills: { ...formData.skills, itemsLeft: updated } });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => {
                          const updated = [...formData.skills.itemsLeft];
                          updated[idx].level = Number(e.target.value);
                          setFormData({ ...formData, skills: { ...formData.skills, itemsLeft: updated } });
                        }}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RESUME TIMELINE */}
          {activeTab === "resume" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <FileText size={22} style={{ color: accentColor }} /> Resume Section &amp; Timeline Content
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Resume Section Subtitle Text</label>
                <textarea
                  rows={2}
                  value={formData.resume?.sectionDesc || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, resume: { ...formData.resume, sectionDesc: e.target.value } })
                  }
                  placeholder="Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-semibold text-slate-300">Summary Block</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.resume?.summary?.name || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resume: {
                          ...formData.resume,
                          summary: { ...formData.resume.summary, name: e.target.value },
                        },
                      })
                    }
                    placeholder="Full Name (e.g. Brandon Johnson)"
                    className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm"
                  />
                  <input
                    type="text"
                    value={formData.resume?.summary?.location || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resume: {
                          ...formData.resume,
                          summary: { ...formData.resume.summary, location: e.target.value },
                        },
                      })
                    }
                    placeholder="Location (e.g. Portland PAR 127, Orlando, FL)"
                    className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formData.resume?.summary?.desc || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: {
                        ...formData.resume,
                        summary: { ...formData.resume.summary, desc: e.target.value },
                      },
                    })
                  }
                  placeholder="Summary Description (e.g. Innovative and deadline-driven Graphic Designer with 3+ years of experience...)"
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-sm resize-none"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">Education Timeline</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newEdu: ResumeEduItem = {
                        id: `edu_${Date.now()}`,
                        degree: "Degree Title",
                        period: "2020 - 2024",
                        institution: "University Name",
                        description: "Education description details.",
                      };
                      setFormData({
                        ...formData,
                        resume: {
                          ...formData.resume,
                          education: [newEdu, ...(formData.resume?.education || [])],
                        },
                      });
                    }}
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.resume?.education?.map((edu, idx) => (
                    <div key={edu.id || idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <span style={{ color: accentColor }} className="text-xs font-bold">Edu #{idx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = formData.resume.education.filter((_, i) => i !== idx);
                            setFormData({ ...formData, resume: { ...formData.resume, education: updated } });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...formData.resume.education];
                            updated[idx].degree = e.target.value;
                            setFormData({ ...formData, resume: { ...formData.resume, education: updated } });
                          }}
                          placeholder="Degree Title (e.g. Bachelor of Science)"
                          className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm"
                        />
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => {
                            const updated = [...formData.resume.education];
                            updated[idx].period = e.target.value;
                            setFormData({ ...formData, resume: { ...formData.resume, education: updated } });
                          }}
                          placeholder="Period (e.g. 2018 - 2022)"
                          className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...formData.resume.education];
                            updated[idx].institution = e.target.value;
                            setFormData({ ...formData, resume: { ...formData.resume, education: updated } });
                          }}
                          placeholder="Institution (e.g. Rochester Institute of Technology)"
                          className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={edu.description}
                        onChange={(e) => {
                          const updated = [...formData.resume.education];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, resume: { ...formData.resume, education: updated } });
                        }}
                        placeholder="Education description (e.g. Academic achievements, coursework, and honors...)"
                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">Professional Experience</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newExp: ResumeExpItem = {
                        id: `exp_${Date.now()}`,
                        title: "Job Title",
                        period: "2022 - Present",
                        company: "Company Name",
                        bullets: ["Achievement or responsibility description point."],
                      };
                      setFormData({
                        ...formData,
                        resume: {
                          ...formData.resume,
                          experience: [newExp, ...(formData.resume?.experience || [])],
                        },
                      });
                    }}
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add Experience
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.resume?.experience?.map((exp, idx) => (
                    <div key={exp.id || idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <span style={{ color: accentColor }} className="text-xs font-bold">Experience #{idx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = formData.resume.experience.filter((_, i) => i !== idx);
                            setFormData({ ...formData, resume: { ...formData.resume, experience: updated } });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...formData.resume.experience];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, resume: { ...formData.resume, experience: updated } });
                          }}
                          placeholder="Job Title (e.g. Senior Graphic Designer)"
                          className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm"
                        />
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...formData.resume.experience];
                            updated[idx].period = e.target.value;
                            setFormData({ ...formData, resume: { ...formData.resume, experience: updated } });
                          }}
                          placeholder="Period (e.g. 2019 - Present)"
                          className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...formData.resume.experience];
                            updated[idx].company = e.target.value;
                            setFormData({ ...formData, resume: { ...formData.resume, experience: updated } });
                          }}
                          placeholder="Company / Location (e.g. Experion, New York, NY)"
                          className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm"
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={exp.bullets?.join("\n") || ""}
                        onChange={(e) => {
                          const updated = [...formData.resume.experience];
                          updated[idx].bullets = e.target.value.split("\n");
                          setFormData({ ...formData, resume: { ...formData.resume, experience: updated } });
                        }}
                        placeholder="Bullet points (satu baris per poin responsibilitas/prestasi)..."
                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PORTFOLIO ITEMS */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ImageIcon size={22} style={{ color: accentColor }} /> Portfolio Showcase &amp; Details Modal
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: PortfolioItem = {
                      id: `p_${Date.now()}`,
                      title: "New Project",
                      category: "app",
                      categoryLabel: "App",
                      image: "/assets/img/portfolio/app-1.jpg",
                      client: "Client Name",
                      date: "2026",
                      description: "Project description details.",
                    };
                    setFormData({
                      ...formData,
                      portfolio: {
                        ...formData.portfolio,
                        items: [newItem, ...(formData.portfolio?.items || [])],
                      },
                    });
                  }}
                  style={{ backgroundColor: accentColor }}
                  className="px-4 py-2 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus size={16} /> Add Portfolio Project
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Portfolio Subtitle Text</label>
                <textarea
                  rows={2}
                  value={formData.portfolio?.sectionDesc || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolio: { ...formData.portfolio, sectionDesc: e.target.value } })
                  }
                  placeholder="Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.portfolio?.items?.map((item, idx) => (
                  <div key={item.id || idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <span style={{ color: accentColor }} className="text-xs font-bold">Project #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = formData.portfolio.items.filter((_, i) => i !== idx);
                          setFormData({ ...formData, portfolio: { ...formData.portfolio, items: updated } });
                        }}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...formData.portfolio.items];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, portfolio: { ...formData.portfolio, items: updated } });
                          }}
                          placeholder="Project Title (e.g. Mobile App)"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                        />
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const updated = [...formData.portfolio.items];
                            const cat = e.target.value as any;
                            const tagObj = PORTFOLIO_TAGS.find((t) => t.key === cat);
                            updated[idx].category = cat;
                            updated[idx].categoryLabel = tagObj?.label || (cat.charAt(0).toUpperCase() + cat.slice(1));
                            setFormData({ ...formData, portfolio: { ...formData.portfolio, items: updated } });
                          }}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                        >
                          {PORTFOLIO_TAGS.map((tag) => (
                            <option key={tag.key} value={tag.key}>
                              {tag.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Main Image URL (Google Drive link / direct URL)
                        </label>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => {
                            const updated = [...formData.portfolio.items];
                            updated[idx].image = e.target.value;
                            setFormData({ ...formData, portfolio: { ...formData.portfolio, items: updated } });
                          }}
                          placeholder="https://drive.google.com/file/d/... or /assets/img/portfolio/app-1.jpg"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                        />
                        <ImagePreviewBox url={item.image} title={item.title} />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={item.client || ""}
                          onChange={(e) => {
                            const updated = [...formData.portfolio.items];
                            updated[idx].client = e.target.value;
                            setFormData({ ...formData, portfolio: { ...formData.portfolio, items: updated } });
                          }}
                          placeholder="Client (e.g. ASU Co)"
                          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                        />
                        <input
                          type="text"
                          value={item.date || ""}
                          onChange={(e) => {
                            const updated = [...formData.portfolio.items];
                            updated[idx].date = e.target.value;
                            setFormData({ ...formData, portfolio: { ...formData.portfolio, items: updated } });
                          }}
                          placeholder="Date (e.g. 2024)"
                          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                        />
                        <input
                          type="text"
                          value={item.projectUrl || ""}
                          onChange={(e) => {
                            const updated = [...formData.portfolio.items];
                            updated[idx].projectUrl = e.target.value;
                            setFormData({ ...formData, portfolio: { ...formData.portfolio, items: updated } });
                          }}
                          placeholder="Project URL"
                          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updated = [...formData.portfolio.items];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, portfolio: { ...formData.portfolio, items: updated } });
                        }}
                        placeholder="Full project description details for popup modal..."
                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CERTIFICATES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award size={22} style={{ color: accentColor }} /> Certificates List &amp; Modal Preview
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newCertificate: any = {
                      id: `crt_${Date.now()}`,
                      title: "New Certificate",
                      image: "/assets/img/certificate-sample.jpg",
                      description: "Deskripsi ringkas sertifikat...",
                    };
                    setFormData({
                      ...formData,
                      services: {
                        ...formData.services,
                        items: [newCertificate, ...(formData.services?.items || [])],
                      },
                    });
                  }}
                  style={{ backgroundColor: accentColor }}
                  className="px-4 py-2 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus size={16} /> Add Certificate
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Certificates Subtitle Text</label>
                <textarea
                  rows={2}
                  value={formData.services?.sectionDesc || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, services: { ...formData.services, sectionDesc: e.target.value } })
                  }
                  placeholder="Official certifications, professional accreditations, and achievements..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.services?.items?.map((crt, idx) => (
                  <div key={crt.id || idx} className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <div className="flex justify-between items-center">
                      <span style={{ color: accentColor }} className="text-xs font-bold">Certificate #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.services.items.filter((_, i) => i !== idx);
                          setFormData({ ...formData, services: { ...formData.services, items: updated } });
                        }}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                        title="Hapus Certificate"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nama Certificate
                        </label>
                        <input
                          type="text"
                          value={crt.title || ""}
                          placeholder="Nama Certificate (e.g. Google Professional Cloud Architect)"
                          onChange={(e) => {
                            const updated = [...formData.services.items];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, services: { ...formData.services, items: updated } });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Foto Certificate (skala 4:3)
                        </label>
                        <input
                          type="text"
                          value={crt.image || ""}
                          placeholder="https://drive.google.com/file/d/... or /assets/img/certificate.jpg"
                          onChange={(e) => {
                            const updated = [...formData.services.items];
                            updated[idx].image = e.target.value;
                            setFormData({ ...formData, services: { ...formData.services, items: updated } });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white text-xs"
                        />
                        {crt.image && crt.image.trim() !== "" && (
                          <div className="mt-2.5 relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center">
                            <img
                              src={parseDriveImageUrl(crt.image)}
                              alt={crt.title || "Certificate preview"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium">
                              4:3 Preview
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Deskripsi Ringkas
                        </label>
                        <textarea
                          rows={3}
                          value={crt.description || ""}
                          placeholder="Deskripsi Ringkas (e.g. Issued by Google Cloud / Coursera. Validated expertise in enterprise cloud architecture, security, and scalability.)"
                          onChange={(e) => {
                            const updated = [...formData.services.items];
                            updated[idx].description = e.target.value;
                            setFormData({ ...formData, services: { ...formData.services, items: updated } });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: CONTACT & FORMSPREE */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <PhoneCall size={22} style={{ color: accentColor }} /> Contact Information &amp; Formspree Integration
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Subtitle Text</label>
                <textarea
                  rows={2}
                  value={formData.contact?.sectionDesc || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: { ...formData.contact, sectionDesc: e.target.value } })
                  }
                  placeholder="Necessitatibus eius consequatur ex aliquid fuga eum quidem..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                />
              </div>

              <div
                style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }}
                className="p-5 border rounded-2xl space-y-3"
              >
                <div style={{ color: accentColor }} className="flex items-center gap-2 font-bold text-sm">
                  <Mail size={18} /> Formspree Integration Setup
                </div>
                <p className="text-xs text-slate-300">
                  Enter your <strong>Formspree Endpoint URL</strong> or Form ID (e.g. <code>https://formspree.io/f/YOUR_FORM_ID</code> or <code>xxyz1234</code>). Messages submitted from the main page contact form will automatically be sent directly to your email inbox via Formspree!
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Formspree Endpoint URL / Form ID</label>
                  <input
                    type="text"
                    value={formData.contact?.formspreeUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: { ...formData.contact, formspreeUrl: e.target.value } })
                    }
                    placeholder="https://formspree.io/f/YOUR_FORM_ID or YOUR_FORM_ID"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Office Address</label>
                  <input
                    type="text"
                    value={formData.contact?.address || ""}
                    placeholder="A108 Adam Street, New York, NY 535022"
                    onChange={(e) =>
                      setFormData({ ...formData, contact: { ...formData.contact, address: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.contact?.phone || ""}
                      placeholder="+1 5589 55488 55"
                      onChange={(e) =>
                        setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                    <input
                      type="text"
                      value={formData.contact?.email || ""}
                      placeholder="info@example.com"
                      onChange={(e) =>
                        setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Form Submit Button Label</label>
                  <input
                    type="text"
                    value={formData.contact?.submitButtonText || "Send Message"}
                    placeholder="Send Message"
                    onChange={(e) =>
                      setFormData({ ...formData, contact: { ...formData.contact, submitButtonText: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SECURITY & ACCOUNT (CHANGE PASSWORD & DATABASE BACKUP) */}
          {activeTab === "security" && (
            <div className="space-y-8">
              {/* SECTION 1: DATABASE BACKUP & RESTORE (JSON IMPORT/EXPORT) */}
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database size={22} style={{ color: accentColor }} /> Database Backup &amp; Restore (Firestore JSON)
                  </h2>
                  <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                    <FileJson size={14} /> database.json
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Download seluruh konfigurasi dan konten website portofolio ke file <code>database.json</code> untuk dicadangkan (backup), atau upload/import file <code>database.json</code> untuk memulihkan (restore) dan menyinkronkan data langsung ke Cloud Firestore.
                </p>

                {dbMessage && (
                  <div
                    className={`flex items-center gap-2.5 p-4 rounded-2xl text-xs font-semibold border animate-in fade-in ${
                      dbMessage.isError
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    {dbMessage.isError ? (
                      <AlertCircle size={18} className="shrink-0 text-rose-400" />
                    ) : (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                    )}
                    <span>{dbMessage.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Card 1: Download / Export database.json */}
                  <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        >
                          <Download size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">Download database.json</h3>
                          <span className="text-[11px] text-slate-400">Export data aktif Firestore</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">
                        Unduh salinan lengkap seluruh data website (tema, teks hero, about info grid, stats, skills, resume, portofolio, sertifikat, footer) dalam satu file JSON.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadDatabase}
                      disabled={dbExporting}
                      style={{ backgroundColor: accentColor }}
                      className="w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-xs"
                    >
                      {dbExporting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Menyiapkan JSON...
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          Download database.json
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card 2: Upload / Import database.json */}
                  <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        >
                          <Upload size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">Import database.json</h3>
                          <span className="text-[11px] text-slate-400">Pulihkan data ke Firestore</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">
                        Pilih file <code>database.json</code> dari perangkat Anda untuk menimpa dan memulihkan seluruh konten &amp; pengaturan portofolio secara otomatis dan real-time.
                      </p>
                    </div>

                    <div>
                      <input
                        type="file"
                        id="db-json-upload-input"
                        accept=".json,application/json"
                        onChange={handleImportDatabase}
                        disabled={dbImporting}
                        className="hidden"
                      />
                      <label
                        htmlFor="db-json-upload-input"
                        className={`w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs ${
                          dbImporting ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        {dbImporting ? (
                          <>
                            <Loader2 size={16} className="animate-spin text-blue-400" />
                            Mengimport Database...
                          </>
                        ) : (
                          <>
                            <Upload size={16} className="text-blue-400" />
                            Upload &amp; Import database.json
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CHANGE ADMIN PASSWORD */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <ShieldCheck size={22} style={{ color: accentColor }} /> Admin Security &amp; Password Settings
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Update your Firebase Admin password securely below. You will be asked to confirm your current password prior to updating.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 6 characters)"
                        className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password to confirm"
                        className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {pwdSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>Your password has been updated successfully!</span>
                    </div>
                  )}

                  {pwdError && (
                    <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{pwdError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={pwdSubmitting}
                    style={{ backgroundColor: accentColor }}
                    className="w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-sm"
                  >
                    {pwdSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Admin Password"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
