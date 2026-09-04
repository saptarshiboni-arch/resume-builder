import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import WizardPage from './pages/WizardPage';
import PreviewPage from './pages/PreviewPage';
import { DEMO_RESUME_DATA } from './data/demoData';
import { generateResumeApi } from './services/api';
import { useAuth } from './context/AuthContext';
import { X, Sparkles } from 'lucide-react';

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
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'wizard' | 'preview'
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [resumeData, setResumeData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);

  // Route protection: If unauthenticated, redirect from wizard/preview to landing
  useEffect(() => {
    if (!isAuthenticated && currentView !== 'landing') {
      setCurrentView('landing');
    }
  }, [isAuthenticated, currentView]);

  // Auto pre-fill user info if logged in and form is empty
  useEffect(() => {
    if (user && !formData.personal.name && !formData.personal.email) {
      setFormData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          name: user.name || prev.personal.name,
          email: user.email || prev.personal.email,
        },
        career: {
          ...prev.career,
          targetRole: user.targetRole || prev.career.targetRole,
          careerLevel: user.careerLevel || prev.career.careerLevel,
        }
      }));
    }
  }, [user]);

  // Start fresh resume - requires authentication
  const handleStartNew = () => {
    if (!isAuthenticated) {
      setNotification({
        type: 'info',
        message: 'Please sign in or create an account to start creating your resume.'
      });
      openAuthModal('register');
      return;
    }

    setFormData({
      ...INITIAL_FORM_DATA,
      personal: {
        ...INITIAL_FORM_DATA.personal,
        name: user?.name || "",
        email: user?.email || ""
      },
      career: {
        ...INITIAL_FORM_DATA.career,
        targetRole: user?.targetRole || "Software Developer",
        careerLevel: user?.careerLevel || "Entry Level"
      }
    });
    setResumeData(null);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load realistic demo data - requires authentication
  const handleLoadDemo = () => {
    if (!isAuthenticated) {
      setNotification({
        type: 'info',
        message: 'Please sign in or create an account to test with demo data.'
      });
      openAuthModal('login');
      return;
    }

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
    if (!isAuthenticated) {
      setNotification({
        type: 'error',
        message: 'Please sign in to generate and save your resume.'
      });
      openAuthModal('login');
      return;
    }

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
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] dark:bg-[#0c0d0e] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLoadDemo={handleLoadDemo}
        onStartNew={handleStartNew}
      />

      {/* Global Notification Banner */}
      {notification && (
        <div className={`no-print py-2.5 px-4 text-xs font-medium border-b flex items-center justify-between transition-colors ${
          notification.type === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-900/60'
            : 'bg-neutral-900 dark:bg-neutral-800 text-white dark:text-neutral-100 border-neutral-800'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-neutral-400 hover:text-white ml-2 transition-colors"
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

      {/* MERN Authentication Modal */}
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}
