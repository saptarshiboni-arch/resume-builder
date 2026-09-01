import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, Award, BookOpen, Briefcase, Code, Sparkles, CheckCircle2 } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../components/SocialIcons';

export default function ModernResume({ data }) {
  if (!data) return null;

  const {
    personal = {},
    career = {},
    summary = '',
    skills = [],
    education = [],
    projects = [],
    experience = [],
    certifications = [],
    achievements = [],
    additional = {}
  } = data;

  return (
    <div className="resume-a4-sheet p-8 text-slate-800 font-sans leading-relaxed text-sm bg-white shadow-resume">
      {/* Header Accent Stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-t mb-6 -mt-2"></div>

      {/* Header Section */}
      <header className="border-b border-slate-200 pb-5 mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {personal.name || 'Your Full Name'}
            </h1>
            {career.targetRole && (
              <p className="text-base font-semibold text-indigo-600 mt-0.5 tracking-wide">
                {career.targetRole} {career.careerLevel ? `• ${career.careerLevel}` : ''}
              </p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>{personal.email}</span>
              </a>
            )}
            {personal.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
                <LinkedinIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>LinkedIn</span>
              </a>
            )}
            {personal.github && (
              <a href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
                <GithubIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>GitHub</span>
              </a>
            )}
            {personal.portfolio && (
              <a href={personal.portfolio.startsWith('http') ? personal.portfolio : `https://${personal.portfolio}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Professional Summary
            </h2>
          </div>
          <p className="text-slate-700 leading-normal text-xs text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Technical Skills & Proficiencies
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => {
              const skillName = typeof skill === 'string' ? skill : skill.name;
              const level = typeof skill === 'object' ? skill.level : null;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <span className="font-semibold text-slate-900">{skillName}</span>
                  {level && <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-normal">({level})</span>}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Professional Experience
            </h2>
          </div>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="border-l-2 border-indigo-200 pl-3 py-0.5">
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{exp.jobTitle || 'Role'}</span>
                    <span className="text-indigo-600 font-medium text-xs"> — {exp.company || 'Company'}</span>
                    {exp.employmentType && <span className="text-[10px] text-slate-500 ml-1.5">({exp.employmentType})</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {exp.startDate || ''} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? '–' : ''} {exp.currentlyWorking ? 'Present' : exp.endDate || ''}
                    {exp.location && ` | ${exp.location}`}
                  </div>
                </div>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-xs text-slate-700">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-0.5">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Featured Projects
            </h2>
          </div>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="border-l-2 border-indigo-200 pl-3 py-0.5">
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{proj.name || 'Project Name'}</span>
                    {proj.type && <span className="text-[10px] text-slate-500">[{proj.type}]</span>}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-indigo-600">
                    {proj.url && (
                      <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 hover:underline">
                        <span>Live Demo</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 hover:underline">
                        <span>GitHub</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {proj.description && (
                  <p className="mt-1 text-xs text-slate-700">
                    {proj.description}
                  </p>
                )}

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="text-slate-500 font-medium">Stack:</span>
                    {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).map((t, tIdx) => (
                      <span key={tIdx} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-mono font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Education & Academic Background
            </h2>
          </div>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline flex-wrap gap-1 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree || edu.qualification || 'Degree'}</span>
                  {edu.field && <span className="text-slate-600"> in {edu.field}</span>}
                  <div className="text-slate-600 font-medium">{edu.institution || edu.school || 'University / Institution'}</div>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span>{edu.startYear ? `${edu.startYear} – ` : ''}{edu.endYear || edu.year || ''}</span>
                  {edu.score && <div className="font-semibold text-indigo-700">{edu.score}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements in 2-column footer if present */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
                Certifications
              </h2>
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">{cert.name}</span>
                    {cert.organization && <span className="text-slate-500"> ({cert.organization}{cert.date ? `, ${cert.date}` : ''})</span>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
                Honors & Achievements
              </h2>
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {achievements.map((ach, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-indigo-600 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-slate-900">{ach.title || ach}</span>
                    {ach.description && <p className="text-[11px] text-slate-600">{ach.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Additional Sections (Languages, Leadership, Interests) */}
      {additional && Object.keys(additional).some(k => Array.isArray(additional[k]) && additional[k].length > 0) && (
        <section className="mt-4 pt-3 border-t border-slate-200 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-700">
            {additional.languages && additional.languages.length > 0 && (
              <div>
                <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">Languages:</span>
                <span>{additional.languages.join(', ')}</span>
              </div>
            )}
            {additional.leadership && additional.leadership.length > 0 && (
              <div>
                <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">Leadership:</span>
                <span>{additional.leadership.join('; ')}</span>
              </div>
            )}
            {additional.interests && additional.interests.length > 0 && (
              <div>
                <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">Interests:</span>
                <span>{additional.interests.join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
