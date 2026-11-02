"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Smile,
  BookOpen,
  Headset,
  Users,
  Award,
  Coffee,
  Briefcase,
  Zap,
  Star,
  Heart,
  Trophy,
  Globe,
  Code,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSiteData } from "@/context/SiteDataContext";

const iconMap: Record<string, any> = {
  Smile,
  BookOpen,
  Headset,
  Users,
  Award,
  Coffee,
  Briefcase,
  Zap,
  Star,
  Heart,
  Trophy,
  Globe,
  Code,
  CheckCircle,
};

function CountUpNumber({ target, isVisible }: { target: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const numTarget = Number(target) || 0;
    if (numTarget === 0) {
      setCount(0);
      return;
    }
    const duration = 2000; // 2s duration
    const steps = 60;
    const increment = numTarget / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numTarget) {
        setCount(numTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span>{count}</span>;
}

export default function Stats() {
  const { siteData } = useSiteData();
  const stats = siteData.stats;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const cardBgColor = siteData.theme?.cardBgColor || "#ffffff";
  const cardTextColor = siteData.theme?.cardTextColor || "#45505b";

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Section is optional: Hide if explicitly disabled
  if (stats?.enabled === false) {
    return null;
  }

  // Filter only items that have a label and target filled
  const activeItems =
    stats?.items?.filter(
      (item) =>
        item.label &&
        item.label.trim() !== "" &&
        item.target !== undefined &&
        item.target !== null &&
        String(item.target).trim() !== ""
    ) || [];

  // Hide the entire section if no items are filled
  if (activeItems.length === 0) {
    return null;
  }

  // Responsive grid based on active item count
  const getGridClass = (count: number) => {
    if (count === 1) return "grid grid-cols-1 max-w-sm mx-auto";
    if (count === 2) return "grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6";
    if (count === 3) return "grid grid-cols-1 sm:grid-cols-3 gap-6";
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
  };

  return (
    <section ref={sectionRef} className="py-12 bg-slate-50/60 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-6 xl:pl-32">
        <div className={getGridClass(activeItems.length)}>
          {activeItems.map((item, index) => {
            const IconComponent = iconMap[item.iconName] || Smile;
            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
                style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: cardBgColor }}
                className="p-6 rounded-2xl shadow-md border flex items-center space-x-4 transition-colors cursor-pointer"
              >
                <div
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                >
                  <IconComponent size={28} />
                </div>
                <div>
                  <span style={{ color: accentColor }} className="text-3xl font-extrabold block tracking-tight">
                    <CountUpNumber target={Number(item.target) || 0} isVisible={isVisible} />
                  </span>
                  <p style={{ color: cardTextColor }} className="text-sm font-medium mt-0.5 opacity-90">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
