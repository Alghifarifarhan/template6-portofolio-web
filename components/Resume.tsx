"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/context/SiteDataContext";

export default function Resume() {
  const { siteData } = useSiteData();
  const resume = siteData.resume;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const headingColor = siteData.theme?.headingColor || "#45505b";
  const textColor = siteData.theme?.textColor || "#272829";

  const summary = resume?.summary;
  const hasSummary = !!(summary && (summary.name?.trim() || summary.desc?.trim()));
  const education = resume?.education?.filter((e) => e.degree && e.degree.trim() !== "") || [];
  const experience = resume?.experience?.filter((e) => e.title && e.title.trim() !== "") || [];

  if (!hasSummary && education.length === 0 && experience.length === 0 && !resume?.sectionDesc) {
    return null;
  }

  return (
    <section id="resume" className="section py-16 overflow-hidden">
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
            {resume?.sectionTitle || "Resume"}
          </h2>
          {resume?.sectionDesc && (
            <p style={{ color: textColor }} className="max-w-3xl mx-auto mt-4 leading-relaxed opacity-90">
              {resume.sectionDesc}
            </p>
          )}
        </motion.div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Summary & Education */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {summary && (summary.name || summary.desc) && (
              <>
                <h3 style={{ color: headingColor }} className="resume-title">Summary</h3>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  style={{ borderLeftColor: accentColor }}
                  className="resume-item"
                >
                  {summary.name && <h4 style={{ color: accentColor }}>{summary.name}</h4>}
                  {summary.desc && <p style={{ color: textColor }} className="italic mb-4 opacity-90">{summary.desc}</p>}
                  <ul style={{ color: textColor }} className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {summary.location && <li>{summary.location}</li>}
                    {summary.phone && <li>{summary.phone}</li>}
                    {summary.email && <li>{summary.email}</li>}
                  </ul>
                </motion.div>
              </>
            )}

            {education.length > 0 && (
              <>
                <h3 style={{ color: headingColor }} className="resume-title">Education</h3>
                {education.map((edu, idx) => (
                  <motion.div
                    key={edu.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    style={{ borderLeftColor: accentColor }}
                    className="resume-item"
                  >
                    <h4 style={{ color: accentColor }}>{edu.degree}</h4>
                    {edu.period && <h5>{edu.period}</h5>}
                    {edu.institution && <p style={{ color: textColor }} className="italic mb-2 opacity-90">{edu.institution}</p>}
                    {edu.description && <p style={{ color: textColor }} className="text-sm opacity-90">{edu.description}</p>}
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>

          {/* Right Column: Professional Experience */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {experience.length > 0 && (
              <>
                <h3 style={{ color: headingColor }} className="resume-title">Professional Experience</h3>
                {experience.map((exp, idx) => (
                  <motion.div
                    key={exp.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    style={{ borderLeftColor: accentColor }}
                    className="resume-item"
                  >
                    <h4 style={{ color: accentColor }}>{exp.title}</h4>
                    {exp.period && <h5>{exp.period}</h5>}
                    {exp.company && <p style={{ color: textColor }} className="italic mb-4 opacity-90">{exp.company}</p>}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul style={{ color: textColor }} className="list-disc list-inside space-y-2 text-sm opacity-90">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
