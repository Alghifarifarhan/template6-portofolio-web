"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Globe,
  MessageCircle,
  Video,
  ArrowUp,
} from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const platformIconMap: Record<string, typeof Twitter> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  whatsapp: MessageCircle,
  tiktok: Video,
  website: Globe,
};

function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(5, 99, 187, ${alpha})`;
  let c = hex.replace("#", "").trim();
  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  if (c.length === 6) {
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}

export default function Footer() {
  const { siteData } = useSiteData();
  const footer = siteData.footer;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const cardBgColor = siteData.theme?.cardBgColor || "#ffffff";
  const cardTextColor = siteData.theme?.cardTextColor || "#45505b";

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeSocialLinks = footer?.socialLinks?.filter((s) => s.url && s.url.trim() !== "") || [];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
      setShowScrollTop(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const circumference = 2 * Math.PI * 21; // ~131.95px

  return (
    <footer
      id="footer"
      style={{ backgroundColor: cardBgColor, borderColor: cardBgColor }}
      className="relative py-12 border-t text-center overflow-hidden transition-colors duration-300"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 xl:pl-32"
      >
        {footer?.name && (
          <h3 style={{ color: cardTextColor }} className="text-2xl font-bold mb-2">
            {footer.name}
          </h3>
        )}
        {footer?.bioText && (
          <p style={{ color: cardTextColor }} className="text-sm max-w-md mx-auto mb-6 italic opacity-85">
            {footer.bioText}
          </p>
        )}

        {/* Social Icons */}
        {activeSocialLinks.length > 0 && (
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {activeSocialLinks.map((social, idx) => {
              const Icon = platformIconMap[social.platform.toLowerCase()] || Globe;
              return (
                <motion.a
                  key={social.id || idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ backgroundColor: accentColor }}
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  aria-label={social.label || social.platform}
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </div>
        )}

        {/* Copyright (Locked Attribution) */}
        <div style={{ color: cardTextColor }} className="text-xs space-y-1.5 pt-4 opacity-80">
          <p>
            Copyright <strong style={{ color: cardTextColor }} className="font-semibold">{footer?.copyrightName || "Alex Smith"}</strong> {footer?.copyrightText || "All Rights Reserved"}
          </p>
          <p style={{ color: cardTextColor }} className="opacity-90">
            Designed by{" "}
            <a
              href="https://bootstrapmade.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline transition-colors"
              style={{ color: accentColor }}
            >
              BootstrapMade
            </a>{" "}
            Distribuited by{" "}
            <a
              href="https://themewagon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline transition-colors"
              style={{ color: accentColor }}
            >
              ThemeWagon
            </a>
          </p>
        </div>
      </motion.div>

      {/* Floating Aesthetic Scroll To Top Button with Circular Progress Indicator */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
          >
            {/* SVG Progress Ring */}
            <svg
              className="absolute w-[52px] h-[52px] -rotate-90 pointer-events-none"
              viewBox="0 0 52 52"
            >
              {/* Background Track */}
              <circle
                cx="26"
                cy="26"
                r="21"
                fill="none"
                stroke={hexToRgba(accentColor, 0.2)}
                strokeWidth="3"
              />
              {/* Animated Progress Stroke */}
              <circle
                cx="26"
                cy="26"
                r="21"
                fill="none"
                stroke={accentColor}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (scrollProgress / 100) * circumference}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150 ease-out"
              />
            </svg>

            {/* Main Interactive Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollToTop}
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 8px 24px -3px ${hexToRgba(accentColor, 0.5)}, 0 3px 8px -2px rgba(0, 0, 0, 0.12)`,
              }}
              className="group relative w-10 h-10 rounded-full text-white flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm border border-white/25 overflow-hidden"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              {/* Subtle light reflection sheen */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/25 pointer-events-none" />

              <motion.div
                className="relative z-10 flex items-center justify-center"
                initial={false}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <ArrowUp size={19} className="stroke-[2.5]" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
