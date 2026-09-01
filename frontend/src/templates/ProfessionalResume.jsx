import React from 'react';
import { Mail, Phone, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../components/SocialIcons';

export default function ProfessionalResume({ data }) {
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
    <div className="resume-a4-sheet text-slate-800 font-sans leading-relaxed text-xs bg-white shadow-resume">
      {/* Top Navy Header Block */}
      <header className="bg-slate-900 text-white p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide uppercase text-white font-display">
              {personal.name || 'Your Full Name'}
            </h1>
            {career.targetRole && (
              <p className="text-indigo-300 font-semibold tracking-wider text-xs uppercase mt-0.5">
                {career.targetRole} {career.careerLevel ? `| ${career.careerLevel}` : ''}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-300">
            {personal.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-indigo-400" />
                <span>{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-indigo-400" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-400" />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-1.5">
                <LinkedinIcon className="w-3 h-3 text-indigo-400" />
                <span>LinkedIn</span>
              </div>
            )}
            {personal.github && (
              <div className="flex items-center gap-1.5">
                <GithubIcon className="w-3 h-3 text-indigo-400" />
                <span>GitHub</span>
              </div>
            )}
            {personal.portfolio && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-indigo-400" />
                <span>Portfolio</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Clean Margins */}
      <div className="p-7 space-y-4">
        {/* Executive Summary */}
        {summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2">
              Executive Profile
            </h2>
            <p className="text-slate-700 text-xs leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Technical & Core Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2">
              Key Competencies & Technical Skills
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 text-xs text-slate-800">
              {skills.map((skill, idx) => {
                const name = typeof skill === 'string' ? skill : skill.name;
                const level = typeof skill === 'object' && skill.level ? ` (${skill.level})` : '';
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span className="font-medium">{name}</span>
                    {level && <span className="text-[10px] text-slate-500">{level}</span>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2">
              Professional Work History
            </h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <div>
                      <span className="font-bold text-slate-950 text-xs">{exp.jobTitle || 'Role'}</span>
                      <span className="text-indigo-700 font-semibold text-xs"> — {exp.company || 'Company'}</span>
                      {exp.employmentType && <span className="text-[10px] text-slate-500 ml-1">({exp.employmentType})</span>}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600">
                      {exp.startDate || ''} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? '–' : ''} {exp.currentlyWorking ? 'Present' : exp.endDate || ''}
                      {exp.location ? ` | ${exp.location}` : ''}
                    </div>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-slate-700">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2">
              Key Projects & Implementations
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <div className="font-bold text-slate-950 text-xs">
                      {proj.name} {proj.type ? <span className="font-normal text-slate-500 text-[10px]">[{proj.type}]</span> : ''}
                    </div>
                    <div className="text-[10px] text-indigo-600 space-x-2">
                      {proj.url && <span>Live Demo: {proj.url}</span>}
                      {proj.github && <span>Repo: {proj.github}</span>}
                    </div>
                  </div>

                  {proj.description && (
                    <p className="text-slate-700 text-xs mt-1">
                      {proj.description}
                    </p>
                  )}

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="mt-1 text-[10px] text-slate-600">
                      <strong className="text-slate-800">Stack:</strong> {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2">
              Education & Credentials
            </h2>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-950">{edu.degree || edu.qualification}</span>
                    {edu.field ? <span className="text-slate-600"> — {edu.field}</span> : ''}
                    <div className="text-slate-600">{edu.institution || edu.school}</div>
                  </div>
                  <div className="text-right text-[11px] text-slate-600">
                    <div>{edu.startYear ? `${edu.startYear} – ` : ''}{edu.endYear || edu.year || ''}</div>
                    {edu.score && <div className="font-bold text-indigo-700">{edu.score}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {certifications && certifications.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                Certifications
              </h3>
              <ul className="space-y-1 text-slate-700 text-xs">
                {certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span><strong>{cert.name}</strong> {cert.organization ? `(${cert.organization})` : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements && achievements.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                Key Accomplishments
              </h3>
              <ul className="space-y-1 text-slate-700 text-xs">
                {achievements.map((ach, idx) => (
                  <li key={idx}>
                    <strong>{ach.title || ach}:</strong> {ach.description || ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
