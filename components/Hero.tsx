"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { parseDriveImageUrl } from "@/lib/utils/drive";

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
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
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

export default function Hero() {
  const { siteData } = useSiteData();
  const hero = siteData.hero;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const headingColor = siteData.theme?.headingColor || "#45505b";
  const textColor = siteData.theme?.textColor || "#272829";
  const cardBgColor = siteData.theme?.cardBgColor || "#ffffff";
  const backgroundColor = siteData.theme?.backgroundColor || "#ffffff";

  const roles =
    (hero?.roles || [])
      .map((r) =>
        typeof r === "string" ? r.replace(/\./g, " ").trim().replace(/\s+/g, " ") : ""
      )
      .filter((r) => r && r !== "");
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (roles.length === 0) {
      setDisplayText("");
      return;
    }
    const currentRole = roles[roleIndex % roles.length];
    const typingSpeed = isDeleting ? 60 : 120;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setDisplayText((prev) =>
          isDeleting
            ? currentRole.substring(0, prev.length - 1)
            : currentRole.substring(0, prev.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles]);

  const bgImageSrc = hero?.bgImage?.trim() ? parseDriveImageUrl(hero.bgImage) : null;
  const activeSocialLinks = hero?.socialLinks?.filter((s) => s.url && s.url.trim() !== "") || [];

  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      {bgImageSrc ? (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={bgImageSrc}
            alt="Hero Background"
            fill
            priority
            unoptimized
            className="object-cover object-center filter brightness-95"
          />
          {/* Dynamic Overlay using Website Background Color */}
          <div
            className="absolute inset-0 transition-colors duration-500 hidden xl:block"
            style={{
              background: `linear-gradient(to right, ${hexToRgba(backgroundColor, 0.96)} 0%, ${hexToRgba(backgroundColor, 0.85)} 40%, ${hexToRgba(backgroundColor, 0.4)} 75%, ${hexToRgba(backgroundColor, 0.15)} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 transition-colors duration-500 xl:hidden"
            style={{
              background: `linear-gradient(to bottom, ${hexToRgba(backgroundColor, 0.94)} 0%, ${hexToRgba(backgroundColor, 0.82)} 50%, ${hexToRgba(backgroundColor, 0.6)} 100%)`,
            }}
          />
        </motion.div>
      ) : (
        <div
          className="absolute inset-0 z-0 transition-colors duration-500"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(backgroundColor, 0.95)} 0%, ${backgroundColor} 100%)`,
          }}
        />
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full text-center xl:text-left xl:pl-28">
        {hero?.name && (
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: headingColor }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4"
          >
            {hero.name}
          </motion.h1>
        )}

        {roles.length > 0 && displayText && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ color: textColor }}
            className="text-xl sm:text-3xl font-light mb-8"
          >
            I&apos;m{" "}
            <span
              style={{ borderColor: accentColor, color: accentColor }}
              className="font-semibold border-b-2"
            >
              {displayText}
            </span>
            <span style={{ color: accentColor }} className="typed-cursor">|</span>
          </motion.p>
        )}

        {/* Social Media Links */}
        {activeSocialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center xl:justify-start gap-4 flex-wrap"
          >
            {activeSocialLinks.map((social, idx) => {
              const Icon = platformIconMap[social.platform.toLowerCase()] || Globe;
              return (
                <motion.a
                  key={social.id || idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="group w-10 h-10 rounded-full bg-[#f2f3f5] text-[#45505b] hover:text-white flex items-center justify-center transition-colors shadow-sm hover:shadow-md cursor-pointer"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                  aria-label={social.label || social.platform}
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
