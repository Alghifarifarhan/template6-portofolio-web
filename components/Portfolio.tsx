"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Link as LinkIcon, X, Calendar, User, ExternalLink, Globe } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { parseDriveImageUrl } from "@/lib/utils/drive";
import { PortfolioItem } from "@/types/siteData";

export default function Portfolio() {
  const { siteData } = useSiteData();
  const portfolio = siteData.portfolio;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const headingColor = siteData.theme?.headingColor || "#45505b";
  const textColor = siteData.theme?.textColor || "#272829";
  const cardBgColor = siteData.theme?.cardBgColor || "#ffffff";
  const cardTextColor = siteData.theme?.cardTextColor || "#45505b";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  const knownCategoryLabels: Record<string, string> = {
    app: "App",
    web: "Web",
    design: "Design",
    article: "Article",
    publication: "Publication",
    illustration: "Illustration",
    video_edit: "Video Edit",
    "video-edit": "Video Edit",
    service: "Service",
    competition: "Competition",
    research: "Research",
    record: "Record",
  };

  const items = portfolio?.items?.filter((item) => item.title && item.title.trim() !== "") || [];

  // Dynamically extract only categories that exist in active portfolio items
  const dynamicCategories = React.useMemo(() => {
    const categoryMap = new Map<string, string>();

    items.forEach((item) => {
      if (item.category) {
        const normalizedKey = item.category === "video-edit" ? "video_edit" : item.category;
        if (!categoryMap.has(normalizedKey)) {
          const label =
            item.categoryLabel?.trim() ||
            knownCategoryLabels[normalizedKey] ||
            normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
          categoryMap.set(normalizedKey, label);
        }
      }
    });

    const list = [{ key: "all", label: "All" }];
    categoryMap.forEach((label, key) => {
      list.push({ key, label });
    });
    return list;
  }, [items]);

  // Reset filter to 'all' if the selected category is no longer present
  useEffect(() => {
    if (activeFilter !== "all" && !dynamicCategories.some((c) => c.key === activeFilter)) {
      setActiveFilter("all");
    }
  }, [dynamicCategories, activeFilter]);

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter(
          (item) =>
            item.category === activeFilter ||
            (activeFilter === "video_edit" &&
              (item.category === "video_edit" || item.category === "video-edit"))
        );

  if (items.length === 0 && !portfolio?.sectionDesc) {
    return null;
  }

  return (
    <section id="portfolio" className="section py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 xl:pl-32">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="section-title text-center mb-8"
        >
          <h2 style={{ color: headingColor }} className="text-3xl font-bold tracking-wider uppercase inline-block relative pb-4">
            {portfolio?.sectionTitle || "Portfolio"}
          </h2>
          {portfolio?.sectionDesc && (
            <p style={{ color: textColor }} className="max-w-3xl mx-auto mt-4 leading-relaxed opacity-90">
              {portfolio.sectionDesc}
            </p>
          )}
        </motion.div>

        {/* Filter Navigation - Responsive Horizontal Slide Container (Only shown when multiple categories exist) */}
        {dynamicCategories.length > 1 && (
          <div className="relative w-full max-w-full mx-auto mb-10">
            <div className="overflow-x-auto no-scrollbar scrollbar-none py-2 px-1 flex items-center justify-start md:justify-center">
              <ul
                style={{ backgroundColor: cardBgColor, borderColor: cardBgColor }}
                className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full border shadow-md transition-colors flex-nowrap shrink-0"
              >
                {dynamicCategories.map((cat) => {
                  const isActive = activeFilter === cat.key;
                  return (
                    <li key={cat.key} className="shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter(cat.key)}
                        style={{
                          backgroundColor: isActive ? accentColor : "transparent",
                          color: isActive ? "#ffffff" : cardTextColor,
                        }}
                        className="px-4 sm:px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer whitespace-nowrap"
                      >
                        {cat.label}
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Portfolio Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item, idx) => {
              const hasImg = !!item.image?.trim();
              const parsedImg = hasImg ? parseDriveImageUrl(item.image!) : "";
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -8, boxShadow: "0 25px 30px -5px rgb(0 0 0 / 0.12)" }}
                  key={item.id || idx}
                  style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: cardBgColor }}
                  className="group relative rounded-2xl overflow-hidden shadow-lg border transition-colors flex flex-col cursor-pointer"
                >
                  {/* Standardized Aspect Ratio Container (4:3 ratio) */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    {hasImg ? (
                      <Image
                        src={parsedImg}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-slate-500 text-xs font-medium">{item.title}</span>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(item);
                        }}
                        style={{ backgroundColor: accentColor }}
                        className="p-3 text-white rounded-full shadow-lg cursor-pointer"
                        title="View Details"
                      >
                        <Plus size={20} />
                      </motion.button>
                      {item.projectUrl && (
                        <motion.a
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          href={item.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ backgroundColor: accentColor }}
                          className="p-3 text-white rounded-full shadow-lg"
                          title="Open External URL"
                        >
                          <LinkIcon size={20} />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Info Content Footer */}
                  <div style={{ borderColor: cardBgColor }} className="p-5 flex justify-between items-center border-t">
                    <div>
                      <h4 style={{ color: cardTextColor }} className="font-bold text-lg leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-xs text-slate-400 capitalize font-medium">
                        {item.categoryLabel || item.category}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProject(item)}
                      style={{ color: accentColor }}
                      className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Details &rarr;
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* PROJECT DETAILS POPUP MODAL (ANIMATED OPEN & EXIT CLOSE) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 25 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: `${accentColor}30` }}
              className="rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border p-6 sm:p-8 space-y-6 relative cursor-default"
            >
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProject(null)}
                style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: `${accentColor}30` }}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2.5 border shadow-md rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </motion.button>

              {/* Modal Image */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                <Image
                  src={parseDriveImageUrl(selectedProject.image)}
                  alt={selectedProject.title}
                  fill
                  unoptimized
                  className="object-cover object-center w-full h-full"
                />
              </div>

              {/* Title & Category */}
              <div>
                <span style={{ backgroundColor: `${accentColor}15`, color: accentColor }} className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {selectedProject.categoryLabel || selectedProject.category}
                </span>
                <h3 style={{ color: accentColor }} className="text-2xl font-extrabold mt-2">
                  {selectedProject.title}
                </h3>
              </div>

              {/* Project Meta Info */}
              <div
                style={{ backgroundColor: `${accentColor}08`, borderColor: `${accentColor}20` }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl border text-xs"
              >
                {selectedProject.client && (
                  <div className="flex items-center gap-2">
                    <User size={16} style={{ color: accentColor }} className="shrink-0" />
                    <div>
                      <span className="text-slate-400 block font-medium">Client</span>
                      <strong style={{ color: cardTextColor }} className="font-semibold">{selectedProject.client}</strong>
                    </div>
                  </div>
                )}
                {selectedProject.date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: accentColor }} className="shrink-0" />
                    <div>
                      <span className="text-slate-400 block font-medium">Date</span>
                      <strong style={{ color: cardTextColor }} className="font-semibold">{selectedProject.date}</strong>
                    </div>
                  </div>
                )}
                {selectedProject.projectUrl && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} style={{ color: accentColor }} className="shrink-0" />
                    <div>
                      <span className="text-slate-400 block font-medium">URL</span>
                      <a
                        href={selectedProject.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: accentColor }}
                        className="font-semibold hover:underline flex items-center gap-0.5"
                      >
                        Visit Site <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedProject.description && (
                <div className="space-y-2">
                  <h4 style={{ color: textColor }} className="font-bold text-sm">Project Overview</h4>
                  <p style={{ color: textColor }} className="text-sm leading-relaxed whitespace-pre-line opacity-90">
                    {selectedProject.description}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
