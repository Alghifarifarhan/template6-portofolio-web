"use client";

import { useState, useEffect } from "react";
import { Home, User, FileText, Image as ImageIcon, Award, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "@/context/SiteDataContext";

const iconMap: Record<string, typeof Home> = {
  hero: Home,
  about: User,
  resume: FileText,
  portfolio: ImageIcon,
  certificate: Award,
  services: Award,
  contact: Mail,
};

export default function Header() {
  const { siteData } = useSiteData();
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rawNavItems = siteData.header?.navItems || [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "resume", label: "Resume" },
    { id: "portfolio", label: "Portfolio" },
    { id: "certificate", label: "Certificate" },
    { id: "contact", label: "Contact" },
  ];

  const navItems = rawNavItems.filter((item) => item.label && item.label.trim() !== "");

  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const cardBgColor = siteData.theme?.cardBgColor || "#ffffff";

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => {
        let el = document.getElementById(item.id);
        if (!el && item.id === "services") el = document.getElementById("certificate");
        if (!el && item.id === "certificate") el = document.getElementById("services");
        return el;
      });
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    let element = document.getElementById(id);
    if (!element && id === "services") element = document.getElementById("certificate");
    if (!element && id === "certificate") element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ backgroundColor: accentColor }}
        className="xl:hidden fixed top-4 right-4 z-[9999] w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transition-colors"
        aria-label="Toggle navigation menu"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mobileMenuOpen ? "close" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Header Container */}
      <header
        id="header"
        style={{
          "--header-card-bg": cardBgColor,
        } as React.CSSProperties}
        className={`header ${mobileMenuOpen ? "header-show" : ""}`}
      >
        <nav id="navmenu" className="navmenu">
          <ul>
            {navItems.map((item, idx) => {
              const Icon = iconMap[item.id] || Home;
              const isActive = activeSection === item.id;
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => scrollToSection(item.id)}
                    style={isActive ? { backgroundColor: accentColor } : {}}
                    className={`group relative flex items-center justify-center w-14 h-14 mb-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? "text-white shadow-md"
                        : "bg-[#f2f3f5] text-[#45505b] hover:text-white"
                    }`}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = accentColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    <Icon size={20} />
                    <span
                      style={{ backgroundColor: accentColor }}
                      className="hidden xl:block absolute left-full top-1/2 -translate-y-1/2 ml-3 text-white text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 shadow-md"
                    >
                      {item.label}
                    </span>
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </header>
    </>
  );
}
