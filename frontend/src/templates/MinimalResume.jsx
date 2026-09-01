import React from 'react';

export default function MinimalResume({ data }) {
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

  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.portfolio
  ].filter(Boolean);

  return (
    <div className="resume-a4-sheet p-10 text-neutral-900 font-sans leading-relaxed text-[13px] bg-white shadow-resume">
      {/* Header */}
      <header className="text-center pb-4 mb-5 border-b border-neutral-900">
        <h1 className="text-3xl font-serif tracking-tight font-normal text-neutral-950 uppercase">
          {personal.name || 'Your Full Name'}
        </h1>
        {career.targetRole && (
          <p className="text-xs uppercase tracking-widest text-neutral-600 mt-1 font-medium">
            {career.targetRole} {career.careerLevel ? `• ${career.careerLevel}` : ''}
          </p>
        )}

        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-neutral-700">
          {contactItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < contactItems.length - 1 && <span className="text-neutral-400">|</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-300 pb-1 mb-2">
            Summary
          </h2>
          <p className="text-neutral-800 text-xs leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-300 pb-1 mb-2">
            Core Competencies & Technologies
          </h2>
          <p className="text-xs text-neutral-800 leading-normal">
            {skills.map((skill, idx) => {
              const name = typeof skill === 'string' ? skill : skill.name;
              const level = typeof skill === 'object' && skill.level ? ` (${skill.level})` : '';
              return `${name}${level}${idx < skills.length - 1 ? ' • ' : ''}`;
            })}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-300 pb-1 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline flex-wrap">
                  <div className="font-bold text-neutral-950 text-xs">
                    {exp.company || 'Company'} — <span className="italic font-normal">{exp.jobTitle || 'Role'}</span>
                  </div>
                  <div className="text-[11px] text-neutral-600 uppercase tracking-wider">
                    {exp.startDate || ''} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? '–' : ''} {exp.currentlyWorking ? 'Present' : exp.endDate || ''}
                  </div>
                </div>
                {exp.location && <div className="text-[11px] text-neutral-500 italic mb-1">{exp.location}</div>}

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-800">
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
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-300 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline flex-wrap">
                  <div className="font-bold text-neutral-950 text-xs">
                    {proj.name || 'Project'}
                    {proj.type && <span className="font-normal text-neutral-600"> ({proj.type})</span>}
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    {[proj.url, proj.github].filter(Boolean).join(' | ')}
                  </div>
                </div>

                {proj.description && (
                  <p className="text-xs text-neutral-800 mt-0.5">
                    {proj.description}
                  </p>
                )}

                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    <span className="font-medium">Tools used:</span> {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline flex-wrap text-xs">
                <div>
                  <span className="font-bold text-neutral-950">{edu.institution || edu.school || 'University'}</span>
                  <div className="italic text-neutral-800">
                    {edu.degree || edu.qualification || 'Degree'}{edu.field ? `, ${edu.field}` : ''}
                  </div>
                </div>
                <div className="text-right text-[11px] text-neutral-600">
                  <div>{edu.startYear ? `${edu.startYear} – ` : ''}{edu.endYear || edu.year || ''}</div>
                  {edu.score && <div className="font-medium">{edu.score}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-300 pb-1 mb-2">
            Certifications & Honors
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-800">
            {certifications.map((cert, idx) => (
              <li key={`cert-${idx}`}>
                <span className="font-semibold">{cert.name}</span>
                {cert.organization && ` — ${cert.organization}`} {cert.date ? `(${cert.date})` : ''}
              </li>
            ))}
            {achievements.map((ach, idx) => (
              <li key={`ach-${idx}`}>
                <span className="font-semibold">{ach.title || ach}</span>
                {ach.description ? `: ${ach.description}` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional */}
      {additional && Object.keys(additional).some(k => Array.isArray(additional[k]) && additional[k].length > 0) && (
        <section className="pt-2 border-t border-neutral-300 text-xs text-neutral-800">
          <div className="space-y-1">
            {additional.languages && additional.languages.length > 0 && (
              <div><span className="font-bold">Languages:</span> {additional.languages.join(', ')}</div>
            )}
            {additional.leadership && additional.leadership.length > 0 && (
              <div><span className="font-bold">Leadership & Activities:</span> {additional.leadership.join('; ')}</div>
            )}
            {additional.interests && additional.interests.length > 0 && (
              <div><span className="font-bold">Interests:</span> {additional.interests.join(', ')}</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
