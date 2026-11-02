"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/context/SiteDataContext";

export default function Skills() {
  const { siteData } = useSiteData();
  const skills = siteData.skills;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const headingColor = siteData.theme?.headingColor || "#45505b";
  const textColor = siteData.theme?.textColor || "#272829";

  const allSkills = [
    ...(skills?.itemsLeft || []),
    ...(skills?.itemsRight || []),
  ].filter((s) => s.name && s.name.trim() !== "");

  if (allSkills.length === 0 && !skills?.sectionDesc) {
    return null;
  }

  const mid = Math.ceil(allSkills.length / 2);
  const leftSkills = allSkills.slice(0, mid);
  const rightSkills = allSkills.slice(mid);

  return (
    <section id="skills" className="section py-16 overflow-hidden">
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
            {skills?.sectionTitle || "Skills"}
          </h2>
          {skills?.sectionDesc && (
            <p style={{ color: textColor }} className="max-w-3xl mx-auto mt-4 leading-relaxed opacity-90">
              {skills.sectionDesc}
            </p>
          )}
        </motion.div>

        {/* Skills Grid - Balanced 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {leftSkills.map((skill, index) => (
              <motion.div
                key={skill.id || `l_${index}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div style={{ color: headingColor }} className="flex justify-between items-center text-sm font-semibold">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 + 0.2 }}
                    style={{ backgroundColor: accentColor }}
                    className="h-full rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {rightSkills.map((skill, index) => (
              <motion.div
                key={skill.id || `r_${index}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div style={{ color: headingColor }} className="flex justify-between items-center text-sm font-semibold">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 + 0.2 }}
                    style={{ backgroundColor: accentColor }}
                    className="h-full rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
