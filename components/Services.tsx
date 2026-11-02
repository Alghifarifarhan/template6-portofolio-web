"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X, ExternalLink, ZoomIn } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { parseDriveImageUrl } from "@/lib/utils/drive";
import { CertificateItem } from "@/types/siteData";

export default function Services() {
  const { siteData } = useSiteData();
  const services = siteData.services;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const headingColor = siteData.theme?.headingColor || "#45505b";
  const textColor = siteData.theme?.textColor || "#272829";
  const cardBgColor = siteData.theme?.cardBgColor || "#ffffff";
  const cardTextColor = siteData.theme?.cardTextColor || "#45505b";

  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const items = services?.items?.filter((s) => s.title && s.title.trim() !== "") || [];

  if (items.length === 0 && !services?.sectionDesc) {
    return null;
  }

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  return (
    <section id="certificate" className="section py-16 bg-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 xl:pl-32">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="section-title text-center mb-12"
        >
          <h2 style={{ color: headingColor }} className="text-3xl font-bold tracking-wider uppercase inline-block relative pb-4">
            {services?.sectionTitle || "Certificate"}
          </h2>
          {services?.sectionDesc && (
            <p style={{ color: textColor }} className="max-w-3xl mx-auto mt-4 leading-relaxed opacity-90">
              {services.sectionDesc}
            </p>
          )}
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const hasImg = !!item.image?.trim();
            const parsedImg = hasImg ? parseDriveImageUrl(item.image!) : "";

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -8, boxShadow: "0 25px 30px -5px rgb(0 0 0 / 0.12)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCert(item)}
                style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: cardBgColor }}
                className="group relative rounded-3xl border shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                <div>
                  {/* Foto Certificate (skala 4:3) */}
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
                      <div
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      >
                        <Award size={40} />
                      </div>
                    )}

                    {/* Hover Overlay with Zoom Icon */}
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div
                        style={{ backgroundColor: accentColor }}
                        className="p-3 text-white rounded-full shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <ZoomIn size={18} />
                        <span>View Certificate</span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={18} style={{ color: accentColor }} className="shrink-0" />
                      <h3 style={{ color: cardTextColor }} className="text-lg font-bold leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    {item.description && (
                      <p style={{ color: cardTextColor }} className="text-sm leading-relaxed opacity-85 line-clamp-3 mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ borderColor: `${accentColor}20`, color: accentColor }} className="px-6 py-4 border-t flex items-center justify-between text-xs font-bold transition-colors">
                  <span>Certificate Preview</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CERTIFICATE DETAILS POPUP MODAL (ANIMATED OPEN & EXIT CLOSE) */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md cursor-pointer"
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
                onClick={() => setSelectedCert(null)}
                style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: `${accentColor}30` }}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2.5 border shadow-md rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </motion.button>

              {/* Modal Image (skala 4:3) */}
              {selectedCert.image && selectedCert.image.trim() !== "" ? (
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <Image
                    src={parseDriveImageUrl(selectedCert.image)}
                    alt={selectedCert.title}
                    fill
                    unoptimized
                    className="object-contain object-center w-full h-full bg-slate-950"
                  />
                </div>
              ) : (
                <div
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  className="aspect-[4/3] w-full rounded-2xl flex items-center justify-center shadow-md"
                >
                  <Award size={64} />
                </div>
              )}

              {/* Certificate Header */}
              <div className="flex items-start gap-4">
                <div
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
                >
                  <Award size={24} />
                </div>
                <div>
                  <span style={{ backgroundColor: `${accentColor}15`, color: accentColor }} className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
                    Official Certificate
                  </span>
                  <h3 style={{ color: accentColor }} className="text-2xl font-extrabold mt-2">
                    {selectedCert.title}
                  </h3>
                </div>
              </div>

              {/* Deskripsi Ringkas */}
              {selectedCert.description && (
                <div style={{ borderColor: `${accentColor}20` }} className="space-y-2 pt-4 border-t">
                  <h4 style={{ color: textColor }} className="font-bold text-sm">Deskripsi Certificate</h4>
                  <p style={{ color: textColor }} className="text-sm leading-relaxed whitespace-pre-line opacity-90">
                    {selectedCert.description}
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

