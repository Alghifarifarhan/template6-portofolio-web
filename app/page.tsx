"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useSiteData } from "@/context/SiteDataContext";
import { trackPageView } from "@/lib/analytics";

export default function Home() {
  const { isLoaded } = useSiteData();

  useEffect(() => {
    if (isLoaded) {
      trackPageView();
    }
  }, [isLoaded]);

  // Solid white blank screen while loading to prevent any split-second text/image/color flash on refresh
  if (!isLoaded) {
    return <div className="fixed inset-0 bg-white z-[99999]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--background-color,#ffffff)] text-[var(--text-color,#272829)] relative transition-colors duration-300">
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Stats />
        <Skills />
        <Resume />
        <Portfolio />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
