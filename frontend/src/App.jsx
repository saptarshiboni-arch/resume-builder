import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import WizardPage from './pages/WizardPage';
import PreviewPage from './pages/PreviewPage';
import { DEMO_RESUME_DATA } from './data/demoData';
import { generateResumeApi } from './services/api';
import { AlertCircle, X, Sparkles } from 'lucide-react';

const INITIAL_FORM_DATA = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: ""
  },
  career: {
    goal: "Full-time Job",
    targetRole: "Software Developer",
    careerLevel: "Entry Level"
  },
  education: [
    {
      id: "edu-init",
      qualification: "Bachelor's Degree",
      degree: "",
      field: "",
      institution: "",
      startYear: "",
      endYear: "",
      score: ""
    }
  ],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
  additional: {
    languages: [],
    volunteering: [],
    leadership: [],
    publications: [],
    interests: []
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'wizard' | 'preview'
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [resumeData, setResumeData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);

  // Start fresh resume
  const handleStartNew = () => {
    setFormData(INITIAL_FORM_DATA);
    setResumeData(null);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load realistic demo data
  const handleLoadDemo = () => {
    setFormData(DEMO_RESUME_DATA);
    setCurrentView('wizard');
    setNotification({
      type: 'info',
      message: 'Demo profile (Alex Johnson) loaded! You can step through answers or review and generate directly.'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger AI generation
  const handleGenerateResume = async () => {
    try {
      setIsGenerating(true);
      const enhanced = await generateResumeApi(formData);
      setResumeData(enhanced);
      setCurrentView('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Resume generation error:", err);
      setNotification({
        type: 'error',
        message: 'AI generation failed. Your original information is safe.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLoadDemo={handleLoadDemo}
        onStartNew={handleStartNew}
      />

      {/* Global Notification Banner */}
      {notification && (
        <div className={`no-print py-2.5 px-4 text-xs font-medium border-b flex items-center justify-between ${
          notification.type === 'error'
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-indigo-50 text-indigo-900 border-indigo-200'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-700 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* View Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartResume={handleStartNew}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentView === 'wizard' && (
          <WizardPage
            formData={formData}
            setFormData={setFormData}
            onGenerateResume={handleGenerateResume}
            isGenerating={isGenerating}
          />
        )}

        {currentView === 'preview' && (
          <PreviewPage
            resumeData={resumeData || formData}
            setResumeData={setResumeData}
            onBackToWizard={() => setCurrentView('wizard')}
          />
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
