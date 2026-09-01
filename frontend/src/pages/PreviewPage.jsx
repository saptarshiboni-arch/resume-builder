import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Layout,
  Download,
  Edit3,
  Sparkles,
  ArrowLeft,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  Palette
} from 'lucide-react';
import ModernResume from '../templates/ModernResume';
import MinimalResume from '../templates/MinimalResume';
import ProfessionalResume from '../templates/ProfessionalResume';
import QualityScoreWidget from '../components/QualityScoreWidget';
import SectionEditModal from '../components/SectionEditModal';
import PdfExportButton from '../components/PdfExportButton';
import ResumeChatbot from '../components/ResumeChatbot';
import { calculateScoreApi } from '../services/api';

export default function PreviewPage({
  resumeData,
  setResumeData,
  onBackToWizard
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern' | 'minimal' | 'professional'
  const resumePrintRef = useRef(null);

  // Edit Modal State
  const [editModal, setEditModal] = useState({
    isOpen: false,
    title: '',
    sectionType: 'summary',
    content: '',
    targetPath: null, // e.g., 'summary', ['projects', 0, 'description'], ['experience', 0, 'bullets', 1]
    context: {}
  });

  const templatesList = [
    {
      id: 'modern',
      name: 'Modern',
      tag: 'Tech & Product',
      desc: 'Indigo accents, pill skill tags, clean modern typography.',
      accent: 'border-indigo-500 bg-indigo-50/50'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      tag: 'ATS High-Score',
      desc: 'Monochromatic, clean hairline rules, maximum ATS readability.',
      accent: 'border-neutral-800 bg-neutral-50/50'
    },
    {
      id: 'professional',
      name: 'Professional',
      tag: 'Corporate & Senior',
      desc: 'Deep navy header banner, structured cards, executive presence.',
      accent: 'border-slate-800 bg-slate-50/50'
    }
  ];

  // Helper to open modal for editing
  const handleOpenEdit = (title, sectionType, content, targetPath, context = {}) => {
    setEditModal({
      isOpen: true,
      title,
      sectionType,
      content,
      targetPath,
      context
    });
  };

  // Helper to save edited content back to resumeData
  const handleSaveEditedContent = async (newContent) => {
    const { targetPath } = editModal;
    if (!targetPath) return;

    const updated = JSON.parse(JSON.stringify(resumeData));

    if (typeof targetPath === 'string') {
      updated[targetPath] = newContent;
    } else if (Array.isArray(targetPath)) {
      let curr = updated;
      for (let i = 0; i < targetPath.length - 1; i++) {
        curr = curr[targetPath[i]];
      }
      curr[targetPath[targetPath.length - 1]] = newContent;
    }

    // Recalculate score with updated content
    try {
      const newScore = await calculateScoreApi(updated);
      updated.qualityScore = newScore;
    } catch (e) {
      // Keep existing score
    }

    setResumeData(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 pb-24 transition-colors duration-200">
      {/* Top sticky controls bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Back button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWizard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Answers</span>
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-display">
              Resume Preview & Customization
            </h1>
          </div>

          {/* Action buttons (PDF download) */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <PdfExportButton
              resumeRef={resumePrintRef}
              fileName={resumeData?.personal?.name || 'Resume'}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR: Template Selection & Quick Section Editors (5 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Template Selector Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm font-display">Choose Resume Style</h2>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 px-2 py-0.5 rounded-full">
                  3 Templates
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {templatesList.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-2 ring-indigo-600/30 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{tpl.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {tpl.tag}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{tpl.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resume Quality Score Breakdown */}
            <QualityScoreWidget scoreData={resumeData?.qualityScore} />

            {/* Quick AI Refinement Actions Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display">Quick Section Tweaks</h3>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Click to refine</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Summary quick edit */}
                {resumeData?.summary && (
                  <button
                    onClick={() =>
                      handleOpenEdit(
                        'Edit Professional Summary',
                        'summary',
                        resumeData.summary,
                        'summary',
                        { targetRole: resumeData.career?.targetRole }
                      )
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all text-left group"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">Professional Summary</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{resumeData.summary}</span>
                    </div>
                    <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 ml-2" />
                  </button>
                )}

                {/* Projects quick edit list */}
                {resumeData?.projects && resumeData.projects.map((proj, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleOpenEdit(
                        `Edit Project: ${proj.name}`,
                        'project_description',
                        proj.description,
                        ['projects', idx, 'description'],
                        { projectName: proj.name, tech: proj.technologies }
                      )
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all text-left group"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">Project: {proj.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{proj.description}</span>
                    </div>
                    <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 ml-2" />
                  </button>
                ))}

                {/* Experience quick edit list */}
                {resumeData?.experience && resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-1">{exp.company} — {exp.jobTitle}</span>
                    {exp.bullets && exp.bullets.map((b, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() =>
                          handleOpenEdit(
                            `Edit Bullet Point #${bIdx + 1}`,
                            'experience_bullet',
                            b,
                            ['experience', idx, 'bullets', bIdx],
                            { role: exp.jobTitle, company: exp.company }
                          )
                        }
                        className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all text-left group"
                      >
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-1">{b}</span>
                        <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CANVAS: Live A4 Resume Preview (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="bg-slate-200/80 dark:bg-slate-900/80 p-3 sm:p-6 rounded-3xl border border-slate-300 dark:border-slate-800 shadow-inner overflow-x-auto">
              <div className="min-w-[210mm] flex justify-center">
                {/* Printable container DOM reference */}
                <div ref={resumePrintRef} className="w-full flex justify-center">
                  {selectedTemplate === 'modern' && <ModernResume data={resumeData} />}
                  {selectedTemplate === 'minimal' && <MinimalResume data={resumeData} />}
                  {selectedTemplate === 'professional' && <ProfessionalResume data={resumeData} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Edit & AI Tone Modal */}
      <SectionEditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal((m) => ({ ...m, isOpen: false }))}
        title={editModal.title}
        sectionType={editModal.sectionType}
        initialContent={editModal.content}
        onSave={handleSaveEditedContent}
        context={editModal.context}
      />

      {/* Floating AI Resume Review Chatbot */}
      <ResumeChatbot resumeData={resumeData} />
    </div>
  );
}
