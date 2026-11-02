"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteData } from "@/context/SiteDataContext";
import { parseDriveImageUrl } from "@/lib/utils/drive";

export default function About() {
  const { siteData } = useSiteData();
  const about = siteData.about;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const headingColor = siteData.theme?.headingColor || "#45505b";
  const textColor = siteData.theme?.textColor || "#272829";
  const backgroundColor = siteData.theme?.backgroundColor || "#ffffff";
  const cardBgColor = siteData.theme?.cardBgColor || "#ffffff";

  const hasImg = !!about?.profileImg?.trim();
  const profileImgSrc = hasImg ? parseDriveImageUrl(about!.profileImg) : null;
  const activeInfoItems = about?.infoGrid?.filter((item) => (item.label && item.label.trim()) || (item.value && item.value.trim())) || [];

  const midIndex = Math.ceil(activeInfoItems.length / 2);
  const leftItems = activeInfoItems.slice(0, midIndex);
  const rightItems = activeInfoItems.slice(midIndex);

  // If entire About section is empty, hide it
  const hasContent = hasImg || about?.title || about?.italicText || about?.bioText || activeInfoItems.length > 0 || about?.sectionDesc;
  if (!hasContent) {
    return null;
  }

  return (
    <section id="about" className="section py-16">
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
            {about?.sectionTitle || "About"}
          </h2>
          {about?.sectionDesc && (
            <p style={{ color: textColor }} className="max-w-3xl mx-auto mt-4 leading-relaxed opacity-90">
              {about.sectionDesc}
            </p>
          )}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile Image (Only rendered if image link is provided) */}
          {hasImg && profileImgSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                style={{
                  borderColor: backgroundColor,
                  backgroundColor: `${backgroundColor}80`,
                }}
                className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-xl border-4 transition-colors"
              >
                <Image
                  src={profileImgSrc}
                  alt="Profile Photo"
                  fill
                  unoptimized
                  className="object-cover object-center w-full h-full"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Details Content */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${hasImg ? "lg:col-span-8" : "lg:col-span-12 max-w-4xl mx-auto"} space-y-6`}
          >
            {about?.title && (
              <h3 style={{ color: headingColor }} className="text-2xl font-bold">
                {about.title}
              </h3>
            )}
            {about?.italicText && (
              <p
                style={{
                  borderColor: accentColor,
                  color: textColor,
                  backgroundColor: `${backgroundColor}60`,
                }}
                className="italic leading-relaxed border-l-4 pl-4 py-2 rounded-r transition-colors"
              >
                {about.italicText}
              </p>
            )}

            {/* Dynamic Info Grid */}
            {activeInfoItems.length > 0 && (
              <div
                style={{
                  backgroundColor: `${backgroundColor}40`,
                  borderColor: `${cardBgColor}80`,
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl border transition-colors"
              >
                <ul className="space-y-3">
                  {leftItems.map((item, idx) => (
                    <motion.li
                      key={item.id || idx}
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * idx, duration: 0.4 }}
                      style={{ color: textColor }}
                      className="flex items-center"
                    >
                      <ChevronRight style={{ color: accentColor }} className="shrink-0 mr-2" size={18} />
                      {item.label && <strong style={{ color: headingColor }} className="font-semibold mr-2 min-w-[90px]">{item.label}:</strong>}
                      <span>{item.value}</span>
                    </motion.li>
                  ))}
                </ul>
                <ul className="space-y-3">
                  {rightItems.map((item, idx) => (
                    <motion.li
                      key={item.id || idx}
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * (idx + leftItems.length), duration: 0.4 }}
                      style={{ color: textColor }}
                      className="flex items-center"
                    >
                      <ChevronRight style={{ color: accentColor }} className="shrink-0 mr-2" size={18} />
                      {item.label && <strong style={{ color: headingColor }} className="font-semibold mr-2 min-w-[90px]">{item.label}:</strong>}
                      <span>{item.value}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {about?.bioText && (
              <p style={{ color: textColor }} className="leading-relaxed pt-2 opacity-95">
                {about.bioText}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
