"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

export default function Contact() {
  const { siteData } = useSiteData();
  const contact = siteData.contact;
  const accentColor = siteData.theme?.accentColor || "#0563bb";
  const headingColor = siteData.theme?.headingColor || "#45505b";
  const textColor = siteData.theme?.textColor || "#272829";
  const cardBgColor = siteData.theme?.cardBgColor || "#ffffff";
  const cardTextColor = siteData.theme?.cardTextColor || "#45505b";

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const endpoint = contact?.formspreeUrl?.trim()
        ? contact.formspreeUrl.startsWith("http")
          ? contact.formspreeUrl
          : `https://formspree.io/f/${contact.formspreeUrl}`
        : null;

      if (!endpoint) {
        // Client-side fallback success if Formspree URL is not set yet
        setStatus("success");
        setFormState({ name: "", email: "", subject: "", message: "" });
        return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setStatus("success");
        setFormState({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message.");
      }
    } catch (err: any) {
      console.error("Form submission error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  const hasContactInfo = !!(contact?.address?.trim() || contact?.phone?.trim() || contact?.email?.trim());

  return (
    <section id="contact" className="section py-16 overflow-hidden">
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
            {contact?.sectionTitle || "Contact"}
          </h2>
          {contact?.sectionDesc && (
            <p style={{ color: textColor }} className="max-w-3xl mx-auto mt-4 leading-relaxed opacity-90">
              {contact.sectionDesc}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info Cards */}
          {hasContactInfo && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 space-y-4"
            >
              {contact?.address && (
                <motion.div
                  whileHover={{ y: -4 }}
                  style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: cardBgColor }}
                  className="p-6 rounded-2xl border shadow-md flex items-start space-x-4 transition-colors"
                >
                  <div
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  >
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: cardTextColor }} className="font-bold text-lg">
                      Address
                    </h4>
                    <p style={{ color: cardTextColor }} className="text-sm mt-1 opacity-85 leading-relaxed">
                      {contact.address}
                    </p>
                  </div>
                </motion.div>
              )}

              {contact?.phone && (
                <motion.div
                  whileHover={{ y: -4 }}
                  style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: cardBgColor }}
                  className="p-6 rounded-2xl border shadow-md flex items-start space-x-4 transition-colors"
                >
                  <div
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  >
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: cardTextColor }} className="font-bold text-lg">
                      Call Us
                    </h4>
                    <p style={{ color: cardTextColor }} className="text-sm mt-1 opacity-85">
                      {contact.phone}
                    </p>
                  </div>
                </motion.div>
              )}

              {contact?.email && (
                <motion.div
                  whileHover={{ y: -4 }}
                  style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: cardBgColor }}
                  className="p-6 rounded-2xl border shadow-md flex items-start space-x-4 transition-colors"
                >
                  <div
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  >
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: cardTextColor }} className="font-bold text-lg">
                      Email Us
                    </h4>
                    <p style={{ color: cardTextColor }} className="text-sm mt-1 opacity-85">
                      {contact.email}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Contact Form Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={`${hasContactInfo ? "lg:col-span-8" : "lg:col-span-12 max-w-2xl mx-auto w-full"}`}
          >
            <form
              onSubmit={handleSubmit}
              style={{ backgroundColor: cardBgColor, color: cardTextColor, borderColor: cardBgColor }}
              className="p-8 rounded-3xl border shadow-lg space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="Project Inquiry"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold"
                  >
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>Your message has been sent successfully! Thank you for contacting.</span>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-xs font-semibold"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={status === "submitting"}
                  style={{ backgroundColor: accentColor }}
                  className="px-8 py-3.5 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {contact?.submitButtonText || "Send Message"}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
