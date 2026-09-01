import React from 'react';

/**
 * ProfessionalResume — Print-optimized Executive template
 * Deep navy header, clean body with indigo underline section headings.
 * Font sizes: body 14px (≈10.5pt), contact 13px (≈9.5pt-10pt).
 * Line heights: 1.35-1.4 throughout for crisp readability without cramping.
 */
export default function ProfessionalResume({ data }) {
  if (!data) return null;

  const {
    personal = {},
    career = {},
    summary = '',
    skills = [],
    skillCategories = null,
    education = [],
    projects = [],
    experience = [],
    certifications = [],
    achievements = [],
    additional = {},
  } = data;

  const hasAdditional =
    additional &&
    Object.keys(additional).some(
      (k) => Array.isArray(additional[k]) && additional[k].length > 0
    );

  return (
    <div
      className="resume-a4-sheet bg-white"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '14px',
        lineHeight: 1.4,
        color: '#1e293b',
      }}
    >
      {/* ── Navy Header ─────────────────────────────────────────── */}
      <header
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          color: '#f8fafc',
          padding: '24px 30px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          {/* Name + Title */}
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '26px',
                fontWeight: '800',
                letterSpacing: '-0.3px',
                color: '#ffffff',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}
            >
              {personal.name || 'Your Full Name'}
            </h1>
            {career.targetRole && (
              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#93c5fd',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  lineHeight: 1.3,
                }}
              >
                {career.targetRole}
                {career.careerLevel ? ` | ${career.careerLevel}` : ''}
              </p>
            )}
          </div>

          {/* Contact grid — 2 columns, approx 9.5pt - 10pt (13px) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px 20px',
              fontSize: '13px',
              lineHeight: 1.35,
              color: '#cbd5e1',
              textAlign: 'right',
              flexShrink: 0,
            }}
          >
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.phone && <span>☎ {personal.phone}</span>}
            {personal.location && <span>⌖ {personal.location}</span>}
            {personal.linkedin && (
              <span>in {personal.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</span>
            )}
            {personal.github && (
              <span>⌥ {personal.github.replace(/https?:\/\/(www\.)?github\.com\//, 'github.com/')}</span>
            )}
            {personal.portfolio && <span>⊕ Portfolio</span>}
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div style={{ padding: '18px 30px 24px' }}>

        {/* Executive Summary */}
        {summary && (
          <section style={{ marginBottom: '14px' }}>
            <ProfSectionHead label="Executive Profile" />
            <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: 1.45, textAlign: 'justify' }}>
              {summary}
            </p>
          </section>
        )}

        {/* Core Skills — grouped categories (ATS-optimized) or flat fallback */}
        {(skillCategories?.length > 0 || skills?.length > 0) && (
          <section style={{ marginBottom: '14px' }}>
            <ProfSectionHead label="Core Competencies & Technical Skills" />
            {skillCategories && skillCategories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '13px', color: '#1e293b' }}>
                {skillCategories.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: '700', color: '#0f172a', flexShrink: 0, minWidth: '145px' }}>
                      {cat.category}:
                    </span>
                    <span style={{ color: '#334155' }}>
                      {(cat.items || []).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 16px' }}>
                {skills.map((skill, idx) => {
                  const name = typeof skill === 'string' ? skill : skill.name;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1d4ed8', flexShrink: 0, display: 'inline-block' }} />
                      <span style={{ fontWeight: '500', color: '#1e293b', fontSize: '13px' }}>{name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section style={{ marginBottom: '14px' }}>
            <ProfSectionHead label="Professional Work History" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                    <div>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                        {exp.jobTitle || 'Role'}
                      </span>
                      <span style={{ color: '#1d4ed8', fontWeight: '600', fontSize: '13.5px' }}>
                        {' — '}{exp.company || 'Company'}
                      </span>
                      {exp.employmentType && (
                        <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>
                          ({exp.employmentType})
                        </span>
                      )}
                    </div>
                    <span style={{ color: '#475569', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      {exp.startDate || ''}{exp.startDate && (exp.endDate || exp.currentlyWorking) ? ' – ' : ''}
                      {exp.currentlyWorking ? 'Present' : exp.endDate || ''}
                      {exp.location ? ` | ${exp.location}` : ''}
                    </span>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ margin: '5px 0 0 16px', padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} style={{ color: '#334155', lineHeight: 1.4, fontSize: '14px' }}>
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section style={{ marginBottom: '14px' }}>
            <ProfSectionHead label="Key Projects & Implementations" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '9px 12px',
                    pageBreakInside: 'avoid',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                      {proj.name || 'Project'}
                      {proj.type && (
                        <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>
                          [{proj.type}]
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: '12px', color: '#1d4ed8' }}>
                      {proj.url && 'Live Demo  '}
                      {proj.github && 'Repository'}
                    </span>
                  </div>

                  {proj.description && (
                    <p style={{ margin: '4px 0 0', color: '#334155', fontSize: '14px', lineHeight: 1.45 }}>
                      {proj.description}
                    </p>
                  )}

                  {proj.technologies && proj.technologies.length > 0 && (
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#475569' }}>
                      <strong style={{ color: '#1e293b' }}>Stack: </strong>
                      {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section style={{ marginBottom: '14px' }}>
            <ProfSectionHead label="Education & Credentials" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                      {edu.degree || edu.qualification || 'Degree'}
                    </span>
                    {edu.field && <span style={{ color: '#475569', fontSize: '14px' }}> — {edu.field}</span>}
                    <div style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.4 }}>
                      {edu.institution || edu.school || 'Institution'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#64748b', lineHeight: 1.35 }}>
                    <div>{edu.startYear ? `${edu.startYear} – ` : ''}{edu.endYear || edu.year || ''}</div>
                    {edu.score && <div style={{ fontWeight: '700', color: '#1d4ed8' }}>{edu.score}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications + Achievements */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '14px' }}>
            {certifications && certifications.length > 0 && (
              <section>
                <ProfSectionHead label="Certifications" small />
                <ul style={{ margin: '4px 0 0 14px', padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {certifications.map((cert, idx) => (
                    <li key={idx} style={{ color: '#334155', fontSize: '13.5px', lineHeight: 1.4 }}>
                      <strong style={{ color: '#0f172a' }}>{cert.name}</strong>
                      {cert.organization && <span style={{ color: '#64748b' }}> ({cert.organization})</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {achievements && achievements.length > 0 && (
              <section>
                <ProfSectionHead label="Key Accomplishments" small />
                <ul style={{ margin: '4px 0 0 14px', padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {achievements.map((ach, idx) => (
                    <li key={idx} style={{ color: '#334155', fontSize: '13.5px', lineHeight: 1.4 }}>
                      <strong style={{ color: '#0f172a' }}>{ach.title || ach}</strong>
                      {ach.description && <span style={{ color: '#64748b' }}>: {ach.description}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {/* Additional */}
        {hasAdditional && (
          <section style={{ paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '13px', lineHeight: 1.4, color: '#475569' }}>
            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              {additional.languages && additional.languages.length > 0 && (
                <span><strong style={{ color: '#0f172a' }}>Languages: </strong>{additional.languages.join(', ')}</span>
              )}
              {additional.leadership && additional.leadership.length > 0 && (
                <span><strong style={{ color: '#0f172a' }}>Leadership: </strong>{additional.leadership.join('; ')}</span>
              )}
              {additional.interests && additional.interests.length > 0 && (
                <span><strong style={{ color: '#0f172a' }}>Interests: </strong>{additional.interests.join(', ')}</span>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProfSectionHead({ label, small }) {
  return (
    <div style={{ marginBottom: small ? '4px' : '7px' }}>
      <h2
        style={{
          margin: '0 0 3px 0',
          fontSize: small ? '10px' : '10.5px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.9px',
          color: '#0f172a',
        }}
      >
        {label}
      </h2>
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, #1d4ed8 0%, transparent 100%)',
          borderRadius: '2px',
        }}
      />
    </div>
  );
}
