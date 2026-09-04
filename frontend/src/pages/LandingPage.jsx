import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Zap,
  Layout,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import HowItWorksModal from '../components/HowItWorksModal';

export default function LandingPage({ onStartResume, onLoadDemo }) {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const features = [
    {
      title: "Impact-Driven Bullets",
      desc: "Turn rough bullet notes into recruiter-grade STAR-format action achievements with verified power verbs.",
      icon: Award,
      color: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700"
    },
    {
      title: "Editorial Typography & Layouts",
      desc: "Designed according to real-world recruiter typography standards across Modern, Minimal, and Executive styles.",
      icon: Layout,
      color: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700"
    },
    {
      title: "1-Click Section Polishing",
      desc: "Make summaries more concise, executive, or technical instantly without losing your authentic experience.",
      icon: Zap,
      color: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700"
    },
    {
      title: "ATS-Score Guaranteed",
      desc: "Zero empty buzzwords or unparseable columns. Standardized structure passes Greenhouse, Lever & Workday filters.",
      icon: FileCheck,
      color: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700"
    }
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-20">
      {/* Subtle Warm Architectural Ambient Glow (No electric AI blobs) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-[radial-gradient(ellipse_at_top,rgba(215,196,170,0.18),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-16 pb-14">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Crafted for Engineers, Product & Business Leaders</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-[1.1] font-display"
        >
          Resumes that look <br className="hidden sm:block" />
          <span className="text-neutral-900 dark:text-neutral-100 underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-8">
            human & professional.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Input your raw experience naturally. We refine your achievements into clean, high-impact bullet points and beautiful A4 layouts.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
        >
          <button
            id="hero-create-btn"
            onClick={onStartResume}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 active:scale-98 shadow-sm transition-all group"
          >
            <span>Start Building</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-how-it-works-btn"
            onClick={() => setIsHowItWorksOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm sm:text-base text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all"
          >
            <PlayCircle className="w-4 h-4 text-neutral-500" />
            <span>How It Works</span>
          </button>
        </motion.div>

        {/* Quick Demo Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400"
        >
          <span>Want a 10-second test?</span>
          <button
            id="hero-try-demo-btn"
            onClick={onLoadDemo}
            className="text-neutral-800 dark:text-neutral-200 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Try Demo Profile</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-10">
        <div className="text-center mb-8">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-neutral-500 dark:text-neutral-400">Design Standards</h2>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1 font-display">Engineered for real recruiter reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border mb-3.5 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Flow Visualizer Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
        <div className="bg-neutral-900 dark:bg-neutral-900/90 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-neutral-800">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                Zero Hallucinations
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-white">
                Your actual experience, elevated.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Describe your work in plain words. Our engine selects concise, action-oriented framing without inventing fake companies, metrics, or degrees.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive skill categorization & taxonomy</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3 distinct typographic styles tuned for A4 print</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant high-fidelity vector PDF download</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onStartResume}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm text-neutral-950 bg-white hover:bg-neutral-100 shadow-sm transition-all active:scale-98"
                >
                  <span>Build My Resume</span>
                  <ArrowRight className="w-4 h-4 text-neutral-950" />
                </button>
              </div>
            </div>

            {/* Teaser Preview Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-neutral-950 rounded-xl p-5 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 shadow-lg text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white text-sm">Alex Johnson</span>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">Software Engineer • Seattle, WA</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                    ATS Score: 94/100
                  </span>
                </div>

                <div>
                  <span className="font-bold text-[10px] uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">Professional Summary</span>
                  <p className="text-[11px] text-neutral-700 dark:text-neutral-300 mt-0.5 leading-relaxed bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded border border-neutral-200/80 dark:border-neutral-800">
                    "Software Engineer with hands-on experience designing RESTful services, scalable data pipelines, and responsive web apps using React and Python."
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[10px] uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">Core Technologies</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'].map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStart={onStartResume}
      />
    </div>
  );
}
