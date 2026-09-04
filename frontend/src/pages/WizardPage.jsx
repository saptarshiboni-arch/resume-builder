import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Building,
  Award,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  X,
  AlertCircle,
  FileCheck2,
  Wand2,
  Loader2
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import {
  CAREER_GOALS,
  TARGET_ROLES,
  CAREER_LEVELS,
  QUALIFICATION_TYPES,
  SKILL_CATEGORIES,
  PROJECT_TYPES,
  EMPLOYMENT_TYPES,
  ACHIEVEMENT_CATEGORIES,
  ADDITIONAL_SECTIONS_CONFIG
} from '../data/predefinedOptions';

export default function WizardPage({
  formData,
  setFormData,
  onGenerateResume,
  isGenerating
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [customRole, setCustomRole] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('Programming Languages');

  const [hasProjects, setHasProjects] = useState(formData.projects && formData.projects.length > 0);
  const [hasExperience, setHasExperience] = useState(formData.experience && formData.experience.length > 0);
  const [hasCertifications, setHasCertifications] = useState(formData.certifications && formData.certifications.length > 0);
  const [hasAchievements, setHasAchievements] = useState(formData.achievements && formData.achievements.length > 0);

  // Validation
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.personal.name || formData.personal.name.trim().length < 2) {
        newErrors.name = "Full Name is required.";
      }
      if (!formData.personal.email || !formData.personal.email.includes('@')) {
        newErrors.email = "A valid email address is required.";
      }
    } else if (step === 2) {
      if (!formData.career.targetRole) {
        newErrors.targetRole = "Please select or enter your target role.";
      }
      if (!formData.career.goal) {
        newErrors.goal = "Please select what you are looking for.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 9));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToStep = (stepNumber) => {
    setErrors({});
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper updater
  const updatePersonal = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateCareer = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      career: { ...prev.career, [field]: value }
    }));
  };

  // Education Helpers
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          qualification: "Bachelor's Degree",
          degree: "",
          field: "",
          institution: "",
          startYear: "",
          endYear: "",
          score: ""
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    const list = [...formData.education];
    list[index] = { ...list[index], [field]: value };
    setFormData((prev) => ({ ...prev, education: list }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Skills Helpers
  const toggleSkill = (skillName, category) => {
    const exists = formData.skills.find(
      (s) => (typeof s === 'string' ? s : s.name).toLowerCase() === skillName.toLowerCase()
    );
    if (exists) {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter(
          (s) => (typeof s === 'string' ? s : s.name).toLowerCase() !== skillName.toLowerCase()
        )
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: skillName, category, level: "Intermediate" }]
      }));
    }
  };

  const updateSkillLevel = (skillName, level) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => {
        const name = typeof s === 'string' ? s : s.name;
        if (name.toLowerCase() === skillName.toLowerCase()) {
          return { name, category: s.category || 'General', level };
        }
        return s;
      })
    }));
  };

  const addCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const trimmed = customSkillInput.trim();
    toggleSkill(trimmed, customSkillCategory);
    setCustomSkillInput('');
  };

  // Projects Helpers
  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj-${Date.now()}`,
          name: "",
          type: "Web Application",
          technologies: [],
          description: "",
          url: "",
          github: ""
        }
      ]
    }));
    setHasProjects(true);
  };

  const updateProject = (index, field, value) => {
    const list = [...formData.projects];
    list[index] = { ...list[index], [field]: value };
    setFormData((prev) => ({ ...prev, projects: list }));
  };

  const removeProject = (index) => {
    const list = formData.projects.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, projects: list }));
    if (list.length === 0) setHasProjects(false);
  };

  // Experience Helpers
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          company: "",
          jobTitle: "",
          employmentType: "Full-time",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          responsibilities: "",
          achievements: ""
        }
      ]
    }));
    setHasExperience(true);
  };

  const updateExperience = (index, field, value) => {
    const list = [...formData.experience];
    list[index] = { ...list[index], [field]: value };
    setFormData((prev) => ({ ...prev, experience: list }));
  };

  const removeExperience = (index) => {
    const list = formData.experience.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, experience: list }));
    if (list.length === 0) setHasExperience(false);
  };

  // Certifications Helpers
  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: `cert-${Date.now()}`,
          name: "",
          organization: "",
          date: "",
          url: ""
        }
      ]
    }));
    setHasCertifications(true);
  };

  const updateCertification = (index, field, value) => {
    const list = [...formData.certifications];
    list[index] = { ...list[index], [field]: value };
    setFormData((prev) => ({ ...prev, certifications: list }));
  };

  const removeCertification = (index) => {
    const list = formData.certifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, certifications: list }));
    if (list.length === 0) setHasCertifications(false);
  };

  // Achievements Helpers
  const addAchievement = (category = "Hackathon") => {
    setFormData((prev) => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        {
          id: `ach-${Date.now()}`,
          category,
          title: "",
          description: ""
        }
      ]
    }));
    setHasAchievements(true);
  };

  const updateAchievement = (index, field, value) => {
    const list = [...formData.achievements];
    list[index] = { ...list[index], [field]: value };
    setFormData((prev) => ({ ...prev, achievements: list }));
  };

  const removeAchievement = (index) => {
    const list = formData.achievements.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, achievements: list }));
    if (list.length === 0) setHasAchievements(false);
  };

  // Additional sections helpers
  const updateAdditionalText = (sectionKey, text) => {
    const items = text.split('\n').map(s => s.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        [sectionKey]: items
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20 transition-colors duration-200">
      {/* Top Multi-step progress bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={8}
        onJumpToStep={jumpToStep}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                  <User className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Step 1 of 8</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Personal Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Let recruiters know who you are and how to reach you.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personal.name || ''}
                    onChange={(e) => updatePersonal('name', e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      errors.name ? 'border-red-500 bg-red-50/30 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-700'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.personal.email || ''}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      errors.email ? 'border-red-500 bg-red-50/30 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-700'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.personal.phone || ''}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personal.location || ''}
                    onChange={(e) => updatePersonal('location', e.target.value)}
                    placeholder="e.g. Seattle, WA or Remote"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn URL <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.personal.linkedin || ''}
                    onChange={(e) => updatePersonal('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub URL <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.personal.github || ''}
                    onChange={(e) => updatePersonal('github', e.target.value)}
                    placeholder="github.com/username"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Portfolio / Website URL <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.personal.portfolio || ''}
                    onChange={(e) => updatePersonal('portfolio', e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Career Goal */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Step 2 of 8</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Career Goal & Target Role</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This helps the AI tailor the executive summary and tone for your exact goal.</p>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  What are you currently looking for?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CAREER_GOALS.map((goal) => {
                    const isSelected = formData.career.goal === goal.label;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => updateCareer('goal', goal.label)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-950 shadow-md'
                            : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{goal.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.goal && <p className="text-xs text-red-500 mt-1">{errors.goal}</p>}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  What type of role are you interested in?
                </label>
                <div className="flex flex-wrap gap-2">
                  {TARGET_ROLES.map((role) => {
                    const isSelected = formData.career.targetRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          updateCareer('targetRole', role);
                          if (role !== 'Other') setCustomRole('');
                        }}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white shadow-sm'
                            : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-xs'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>

                {formData.career.targetRole === 'Other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => {
                        setCustomRole(e.target.value);
                        updateCareer('targetRole', e.target.value || 'Other');
                      }}
                      placeholder="Type custom role title (e.g. Embedded Systems Engineer)..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-500 outline-none"
                    />
                  </div>
                )}
                {errors.targetRole && <p className="text-xs text-red-500 mt-1">{errors.targetRole}</p>}
              </div>

              {/* Career Level */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  How would you describe your career level?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CAREER_LEVELS.map((lvl) => {
                    const isSelected = formData.career.careerLevel === lvl.label;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => updateCareer('careerLevel', lvl.label)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-950 shadow-md'
                            : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{lvl.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Education */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 3 of 8</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Education</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Add your highest degree and schooling credentials.</p>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another</span>
                </button>
              </div>

              {formData.education.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <GraduationCap className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">No education entries added yet.</p>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    + Add Education Details
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.education.map((edu, idx) => {
                    const isSchool = edu.qualification === 'Class 10' || edu.qualification === 'Class 12';

                    return (
                      <div
                        key={edu.id || idx}
                        className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 relative space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                            Education #{idx + 1}
                          </span>
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducation(idx)}
                              className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Qualification Level
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {QUALIFICATION_TYPES.map((q) => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => updateEducation(idx, 'qualification', q)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                  edu.qualification === q
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {isSchool ? (
                            <>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">School Name</label>
                                <input
                                  type="text"
                                  value={edu.school || edu.institution || ''}
                                  onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                                  placeholder="e.g. St. Xavier's High School"
                                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Stream / Board</label>
                                <input
                                  type="text"
                                  value={edu.field || ''}
                                  onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                                  placeholder="e.g. Science / CBSE"
                                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree Title</label>
                                <input
                                  type="text"
                                  value={edu.degree || ''}
                                  onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                                  placeholder="e.g. B.S. in Computer Science"
                                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Field / Major</label>
                                <input
                                  type="text"
                                  value={edu.field || ''}
                                  onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                                  placeholder="e.g. Software Engineering"
                                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">University / Institution</label>
                                <input
                                  type="text"
                                  value={edu.institution || ''}
                                  onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                                  placeholder="e.g. University of Washington"
                                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                              </div>
                            </>
                          )}

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                            <input
                              type="text"
                              value={edu.endYear || edu.year || ''}
                              onChange={(e) => updateEducation(idx, 'endYear', e.target.value)}
                              placeholder="e.g. 2025"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GPA / Percentage</label>
                            <input
                              type="text"
                              value={edu.score || ''}
                              onChange={(e) => updateEducation(idx, 'score', e.target.value)}
                              placeholder="e.g. 3.85 / 4.0 or 88%"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: Skills */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                  <Code className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Step 4 of 8</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Technical Skills & Tools</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click skills to select. Selected skills: <span className="font-bold text-indigo-600 dark:text-indigo-400">{formData.skills.length}</span>
                </p>
              </div>

              {/* Categorized Skills Pills */}
              <div className="space-y-5">
                {Object.entries(SKILL_CATEGORIES).map(([category, skillList]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skillList.map((skill) => {
                        const isSelected = formData.skills.some(
                          (s) => (typeof s === 'string' ? s : s.name).toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill, category)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                          >
                            {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Skill Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Add Custom Skill</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    placeholder="e.g. WebRTC, Solr, Figma..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Skill Badges with optional proficiency tag */}
              {formData.skills.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Selected Skills ({formData.skills.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((s, idx) => {
                      const name = typeof s === 'string' ? s : s.name;
                      const level = typeof s === 'object' ? s.level || 'Intermediate' : 'Intermediate';
                      return (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-medium"
                        >
                          <span>{name}</span>
                          <select
                            value={level}
                            onChange={(e) => updateSkillLevel(name, e.target.value)}
                            className="text-[10px] bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded px-1 py-0.5 text-indigo-700 dark:text-indigo-300 outline-none"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => toggleSkill(name, s.category)}
                            className="text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 5: Projects */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                    <FolderGit2 className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 5 of 8</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Projects</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Describe what you built. Simple casual notes are converted by AI into bullet points.</p>
                </div>
                {hasProjects && (
                  <button
                    type="button"
                    onClick={addProject}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              {/* Yes / No Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Have you built any projects?</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setHasProjects(true);
                      if (formData.projects.length === 0) addProject();
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      hasProjects
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasProjects(false);
                      setFormData((prev) => ({ ...prev, projects: [] }));
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      !hasProjects
                        ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {hasProjects && (
                <div className="space-y-6">
                  {formData.projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                          Project #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                          <input
                            type="text"
                            value={proj.name || ''}
                            onChange={(e) => updateProject(idx, 'name', e.target.value)}
                            placeholder="e.g. AI Resume Builder"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Type</label>
                          <select
                            value={proj.type || 'Web Application'}
                            onChange={(e) => updateProject(idx, 'type', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            {PROJECT_TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Technologies Used <span className="text-slate-400 dark:text-slate-500 font-normal">(comma-separated)</span>
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''}
                            onChange={(e) => updateProject(idx, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            placeholder="e.g. React, Python, Flask, Tailwind CSS"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Project Description
                            </label>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">✨ Plain language welcome</span>
                          </div>
                          <textarea
                            value={proj.description || ''}
                            onChange={(e) => updateProject(idx, 'description', e.target.value)}
                            rows={3}
                            placeholder="e.g. I made a website where students can find lost things."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Live Demo URL</label>
                          <input
                            type="url"
                            value={proj.url || ''}
                            onChange={(e) => updateProject(idx, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                          <input
                            type="url"
                            value={proj.github || ''}
                            onChange={(e) => updateProject(idx, 'github', e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 6: Experience */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                    <Building className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 6 of 8</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Work Experience</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Internships, full-time, freelance, or contract roles.</p>
                </div>
                {hasExperience && (
                  <button
                    type="button"
                    onClick={addExperience}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                )}
              </div>

              {/* Yes / No Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Do you have professional experience?</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setHasExperience(true);
                      if (formData.experience.length === 0) addExperience();
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      hasExperience
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasExperience(false);
                      setFormData((prev) => ({ ...prev, experience: [] }));
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      !hasExperience
                        ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {hasExperience && (
                <div className="space-y-6">
                  {formData.experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                          Experience #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                          <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                            placeholder="e.g. Acme Corp"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.jobTitle || ''}
                            onChange={(e) => updateExperience(idx, 'jobTitle', e.target.value)}
                            placeholder="e.g. Software Engineer Intern"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employment Type</label>
                          <select
                            value={exp.employmentType || 'Full-time'}
                            onChange={(e) => updateExperience(idx, 'employmentType', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            {EMPLOYMENT_TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location || ''}
                            onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                            placeholder="e.g. San Francisco, CA (or Remote)"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate || ''}
                            onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                            placeholder="e.g. Jun 2023"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                            <label className="flex items-center gap-1 text-[11px] text-indigo-700 dark:text-indigo-400 font-medium cursor-pointer">
                              <input
                                type="checkbox"
                                checked={exp.currentlyWorking || false}
                                onChange={(e) => updateExperience(idx, 'currentlyWorking', e.target.checked)}
                                className="rounded text-indigo-600"
                              />
                              <span>Present</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            disabled={exp.currentlyWorking}
                            value={exp.currentlyWorking ? 'Present' : exp.endDate || ''}
                            onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                            placeholder="e.g. Dec 2023"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-60"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Key Responsibilities & Tasks
                          </label>
                          <textarea
                            value={exp.responsibilities || ''}
                            onChange={(e) => updateExperience(idx, 'responsibilities', e.target.value)}
                            rows={3}
                            placeholder="e.g. Built frontend UI with React. Fixed API latency issues and wrote unit tests."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Achievements & Impact <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                          </label>
                          <textarea
                            value={exp.achievements || ''}
                            onChange={(e) => updateExperience(idx, 'achievements', e.target.value)}
                            rows={2}
                            placeholder="e.g. Improved site load time by 30% and received intern recognition award."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 7: Certifications */}
          {currentStep === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                    <Award className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 7 of 8</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Certifications</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AWS, Google Cloud, Meta, Cisco, or course certificates.</p>
                </div>
                {hasCertifications && (
                  <button
                    type="button"
                    onClick={addCertification}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another</span>
                  </button>
                )}
              </div>

              {/* Yes / No Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Do you have any certifications?</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setHasCertifications(true);
                      if (formData.certifications.length === 0) addCertification();
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      hasCertifications
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasCertifications(false);
                      setFormData((prev) => ({ ...prev, certifications: [] }));
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      !hasCertifications
                        ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {hasCertifications && (
                <div className="space-y-4">
                  {formData.certifications.map((cert, idx) => (
                    <div
                      key={cert.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                          Certification #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCertification(idx)}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Certification Name</label>
                          <input
                            type="text"
                            value={cert.name || ''}
                            onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                            placeholder="e.g. AWS Certified Developer"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Issuing Organization</label>
                          <input
                            type="text"
                            value={cert.organization || ''}
                            onChange={(e) => updateCertification(idx, 'organization', e.target.value)}
                            placeholder="e.g. Amazon Web Services"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                          <input
                            type="text"
                            value={cert.date || ''}
                            onChange={(e) => updateCertification(idx, 'date', e.target.value)}
                            placeholder="e.g. 2024"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Credential URL</label>
                          <input
                            type="url"
                            value={cert.url || ''}
                            onChange={(e) => updateCertification(idx, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 8: Achievements & Additional Information */}
          {currentStep === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Step 8 of 8</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Achievements & Extras</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Showcase awards, hackathons, languages, and leadership.</p>
              </div>

              {/* Achievements Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Honors & Achievements</h3>
                  <div className="flex flex-wrap gap-1">
                    {ACHIEVEMENT_CATEGORIES.slice(0, 4).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => addAchievement(cat)}
                        className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                      >
                        + {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.achievements && formData.achievements.length > 0 ? (
                  <div className="space-y-3">
                    {formData.achievements.map((ach, idx) => (
                      <div key={ach.id || idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                            {ach.category || 'Achievement'} #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAchievement(idx)}
                            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={ach.title || ''}
                          onChange={(e) => updateAchievement(idx, 'title', e.target.value)}
                          placeholder="Achievement Title (e.g. 1st Place Regional Hackathon 2024)"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <textarea
                          value={ach.description || ''}
                          onChange={(e) => updateAchievement(idx, 'description', e.target.value)}
                          rows={2}
                          placeholder="Brief description / impact..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    No achievements added. Click the category buttons above to add awards or honors.
                  </p>
                )}
              </div>

              {/* Optional Sections Config */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Optional Profile Sections</h3>
                <div className="space-y-3">
                  {ADDITIONAL_SECTIONS_CONFIG.map((sec) => (
                    <div key={sec.id} className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {sec.label} <span className="text-slate-400 dark:text-slate-500 font-normal">(1 item per line)</span>
                      </label>
                      <textarea
                        value={(formData.additional?.[sec.id] || []).join('\n')}
                        onChange={(e) => updateAdditionalText(sec.id, e.target.value)}
                        rows={2}
                        placeholder={sec.placeholder}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 9: Review Page */}
          {currentStep === 9 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
                  <FileCheck2 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Final Verification</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Review Your Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review all your entries before AI generates your professional resume.</p>
              </div>

              {/* Review Section Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Personal */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Personal Information</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpToStep(1)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        [Edit]
                      </button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">{formData.personal.name || 'Not specified'}</p>
                    <p className="text-slate-500 dark:text-slate-400">{formData.personal.email}</p>
                    <p className="text-slate-500 dark:text-slate-400">{formData.personal.location}</p>
                  </div>
                </div>

                {/* Career */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Career Goal & Level</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpToStep(2)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        [Edit]
                      </button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">{formData.career.targetRole || 'Not set'}</p>
                    <p className="text-slate-500 dark:text-slate-400">{formData.career.goal} • {formData.career.careerLevel}</p>
                  </div>
                </div>

                {/* Education */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Education ({formData.education.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpToStep(3)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        [Edit]
                      </button>
                    </div>
                    {formData.education.map((e, i) => (
                      <p key={i} className="text-slate-600 dark:text-slate-300 truncate">{e.degree || e.qualification} — {e.institution}</p>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Skills ({formData.skills.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpToStep(4)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        [Edit]
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 truncate">
                      {formData.skills.map(s => typeof s === 'string' ? s : s.name).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Projects */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Projects ({formData.projects.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpToStep(5)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        [Edit]
                      </button>
                    </div>
                    {formData.projects.length > 0 ? (
                      formData.projects.map((p, i) => (
                        <p key={i} className="text-slate-600 dark:text-slate-300 truncate">• {p.name}</p>
                      ))
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 italic">None</p>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Experience ({formData.experience.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpToStep(6)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        [Edit]
                      </button>
                    </div>
                    {formData.experience.length > 0 ? (
                      formData.experience.map((e, i) => (
                        <p key={i} className="text-slate-600 dark:text-slate-300 truncate">• {e.jobTitle} at {e.company}</p>
                      ))
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 italic">None</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Generate CTA */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
                <button
                  id="btn-generate-resume"
                  type="button"
                  disabled={isGenerating}
                  onClick={onGenerateResume}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 shadow-xl active:scale-98 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI is crafting your resume...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate My Resume ✨</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  AI transforms your descriptions into professional bullet points and summary.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Navigation Footer */}
        {currentStep <= 8 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-100 hover:text-neutral-950 dark:hover:text-white bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-xl shadow-md transition-all active:scale-98"
              >
                <span>{currentStep === 8 ? 'Review Answers' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
