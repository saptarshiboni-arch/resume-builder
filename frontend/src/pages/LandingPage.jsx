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
} from 'lucide-react';
import HowItWorksModal from '../components/HowItWorksModal';

export default function LandingPage({ onStartResume, onLoadDemo }) {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const features = [
    {
      title: "AI-Powered Writing",
      desc: "Transform casual descriptions into bulletproof STAR-format action bullets and impactful summaries.",
      icon: Sparkles,
      color: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800"
    },
    {
      title: "Professional Templates",
      desc: "Select between Modern, Minimal, and Executive templates designed for maximum readability and visual punch.",
      icon: Layout,
      color: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800"
    },
    {
      title: "Easy Customization",
      desc: "Answer structured multi-choice prompts, then tweak individual sections with 1-click tone presets.",
      icon: Zap,
      color: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800"
    },
    {
      title: "ATS-Friendly Resumes",
      desc: "Clean typography, structured metadata, and standardized headings ensure seamless parsing by recruiter filters.",
      icon: FileCheck,
      color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
    }
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-16">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/60 via-purple-50/40 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent pointer-events-none -z-10 blur-3xl" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-12">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Next-Generation Autonomous Resume Creation</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] font-display"
        >
          Build Your Resume <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            with AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Answer a few simple questions and let AI turn your experience into a professional resume.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto"
        >
          <button
            id="hero-create-btn"
            onClick={onStartResume}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-lg shadow-indigo-600/30 transition-all group"
          >
            <span>Create My Resume</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-how-it-works-btn"
            onClick={() => setIsHowItWorksOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
          >
            <PlayCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>See How It Works</span>
          </button>
        </motion.div>

        {/* Quick Demo Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400"
        >
          <span>Short on time?</span>
          <button
            id="hero-try-demo-btn"
            onClick={onLoadDemo}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Try with pre-filled demo data</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-12">
        <div className="text-center mb-8">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400">Built for Modern Job Seekers</h2>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-display">Everything you need to stand out</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-4 ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Flow Visualizer Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Interactive Guided Experience
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                Say goodbye to writer's block.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Describe your work in your own words. Our AI parses your raw input, selects high-impact power verbs, formats achievements, and delivers recruiter-approved bullet points.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Predefined skill categories & instant pickers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3 distinct template styles with real-time preview</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Resume Quality Score with targeted improvement tips</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onStartResume}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-indigo-900 bg-white hover:bg-slate-100 shadow-md transition-all active:scale-98"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            {/* Teaser Preview Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-5 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-2xl text-xs space-y-3 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Alex Johnson</span>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Full Stack Developer</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                    Quality: 92/100
                  </span>
                </div>

                <div>
                  <span className="font-bold text-[10px] uppercase text-indigo-900 dark:text-indigo-400 tracking-wider">AI Polished Summary</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed italic bg-indigo-50/50 dark:bg-indigo-950/40 p-2 rounded border border-indigo-100 dark:border-indigo-900/60">
                    "Driven Full Stack Developer experienced in architecting resilient web applications, collaborating in agile environments, and deploying scalable solutions..."
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[10px] uppercase text-indigo-900 dark:text-indigo-400 tracking-wider">Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['React', 'Python', 'Flask', 'PostgreSQL', 'Docker', 'Tailwind'].map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">
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
