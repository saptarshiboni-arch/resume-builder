import React from 'react';

/**
 * ModernResume — Print-optimized template
 * Font sizes: body 14px (≈10.5pt), contact 13px (≈9.5pt)
 * Line heights: 1.4–1.45 throughout for comfortable, non-cramped reading.
 */
export default function ModernResume({ data }) {
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

  // Base body style — 14px ≈ 10.5pt, line-height 1.4
  const body = {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    fontSize: '14px',
    lineHeight: 1.4,
    color: '#1e293b',
  };

  return (
    <div
      className="resume-a4-sheet bg-white"
      style={body}
    >
      {/* ── Top Accent Bar ─────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
          height: '6px',
          width: '100%',
        }}
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{ padding: '20px 30px 14px', borderBottom: '1.5px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          {/* Name & Title */}
          <div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {personal.name || 'Your Full Name'}
            </h1>
            {career.targetRole && (
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4f46e5',
                  marginTop: '4px',
                  marginBottom: 0,
                  letterSpacing: '0.2px',
                  lineHeight: 1.3,
                }}
              >
                {career.targetRole}
                {career.careerLevel ? ` · ${career.careerLevel}` : ''}
              </p>
            )}
          </div>

          {/* Contact Info — 13px ≈ 9.5pt */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px 20px',
              textAlign: 'right',
              fontSize: '13px',
              lineHeight: 1.35,
              color: '#475569',
              flexShrink: 0,
            }}
          >
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.phone && <span>📞 {personal.phone}</span>}
            {personal.location && <span>📍 {personal.location}</span>}
            {personal.linkedin && (
              <span>in {personal.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</span>
            )}
            {personal.github && (
              <span>⌥ {personal.github.replace(/https?:\/\/(www\.)?github\.com\//, 'github.com/')}</span>
            )}
            {personal.portfolio && <span>🌐 Portfolio</span>}
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div style={{ padding: '16px 30px 22px' }}>

        {/* Professional Summary */}
        {summary && (
          <section style={{ marginBottom: '14px' }}>
            <SectionHeading label="Professional Summary" color="#4f46e5" />
            <p style={{ color: '#334155', lineHeight: 1.45, textAlign: 'justify', margin: 0, fontSize: '14px' }}>
              {summary}
            </p>
          </section>
        )}

        {/* Skills — grouped categories (ATS-optimized) or flat fallback */}
        {(skillCategories?.length > 0 || skills?.length > 0) && (
          <section style={{ marginBottom: '14px' }}>
            <SectionHeading label="Technical Skills & Proficiencies" color="#4f46e5" />
            {skillCategories && skillCategories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '13px', color: '#1e293b' }}>
                {skillCategories.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: '700', color: '#0f172a', flexShrink: 0, minWidth: '145px' }}>
                      {cat.category}:
                    </span>
                    <span style={{ color: '#334155' }}>
                      {(cat.items || []).join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#334155', fontSize: '13px', lineHeight: 1.4, margin: 0 }}>
                {skills.map((s, i) => {
                  const name = typeof s === 'string' ? s : s.name;
                  return name + (i < skills.length - 1 ? ' · ' : '');
                }).join('')}
              </p>
            )}
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section style={{ marginBottom: '14px' }}>
            <SectionHeading label="Professional Experience" color="#4f46e5" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  style={{
                    borderLeft: '2.5px solid #c7d2fe',
                    paddingLeft: '11px',
                    pageBreakInside: 'avoid',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                    <div>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                        {exp.jobTitle || 'Role'}
                      </span>
                      <span style={{ color: '#4f46e5', fontWeight: '600', fontSize: '13.5px' }}>
                        {' — '}{exp.company || 'Company'}
                      </span>
                      {exp.employmentType && (
                        <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>
                          ({exp.employmentType})
                        </span>
                      )}
                    </div>
                    <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap' }}>
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
            <SectionHeading label="Featured Projects" color="#4f46e5" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  style={{
                    borderLeft: '2.5px solid #c7d2fe',
                    paddingLeft: '11px',
                    pageBreakInside: 'avoid',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                    <div>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                        {proj.name || 'Project'}
                      </span>
                      {proj.type && (
                        <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>
                          [{proj.type}]
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#4f46e5', display: 'flex', gap: '10px' }}>
                      {proj.url && <span>Live Demo</span>}
                      {proj.github && <span>GitHub</span>}
                    </div>
                  </div>

                  {proj.description && (
                    <p style={{ margin: '4px 0 0', color: '#334155', lineHeight: 1.45, fontSize: '14px' }}>
                      {proj.description}
                    </p>
                  )}

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '12px', alignSelf: 'center' }}>Stack:</span>
                      {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            background: '#eef2ff',
                            color: '#4338ca',
                            borderRadius: '4px',
                            padding: '1px 6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            fontFamily: 'monospace',
                          }}
                        >
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

        {/* Education */}
        {education && education.length > 0 && (
          <section style={{ marginBottom: '14px' }}>
            <SectionHeading label="Education" color="#4f46e5" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}
                >
                  <div>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                      {edu.degree || edu.qualification || 'Degree'}
                    </span>
                    {edu.field && <span style={{ color: '#475569', fontSize: '14px' }}> in {edu.field}</span>}
                    <div style={{ color: '#64748b', fontWeight: '500', fontSize: '13px', lineHeight: 1.4 }}>
                      {edu.institution || edu.school || 'Institution'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#64748b', lineHeight: 1.35 }}>
                    <div>{edu.startYear ? `${edu.startYear} – ` : ''}{edu.endYear || edu.year || ''}</div>
                    {edu.score && (
                      <div style={{ fontWeight: '700', color: '#4f46e5' }}>{edu.score}</div>
                    )}
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
                <SectionHeading label="Certifications" color="#4f46e5" size="small" />
                <ul style={{ margin: '4px 0 0 14px', padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {certifications.map((cert, idx) => (
                    <li key={idx} style={{ color: '#334155', fontSize: '13.5px', lineHeight: 1.4 }}>
                      <strong style={{ color: '#0f172a' }}>{cert.name}</strong>
                      {cert.organization && (
                        <span style={{ color: '#64748b' }}> — {cert.organization}{cert.date ? `, ${cert.date}` : ''}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {achievements && achievements.length > 0 && (
              <section>
                <SectionHeading label="Honors & Achievements" color="#4f46e5" size="small" />
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

        {/* Additional Info */}
        {hasAdditional && (
          <section style={{ paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', fontSize: '13px', lineHeight: 1.4, color: '#475569' }}>
              {additional.languages && additional.languages.length > 0 && (
                <span>
                  <strong style={{ color: '#0f172a' }}>Languages: </strong>
                  {additional.languages.join(', ')}
                </span>
              )}
              {additional.leadership && additional.leadership.length > 0 && (
                <span>
                  <strong style={{ color: '#0f172a' }}>Leadership: </strong>
                  {additional.leadership.join('; ')}
                </span>
              )}
              {additional.interests && additional.interests.length > 0 && (
                <span>
                  <strong style={{ color: '#0f172a' }}>Interests: </strong>
                  {additional.interests.join(', ')}
                </span>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/** Section heading with a colored left accent line */
function SectionHeading({ label, color = '#4f46e5', size = 'normal' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: size === 'small' ? '4px' : '7px',
      }}
    >
      <div style={{ width: '3px', height: size === 'small' ? '13px' : '15px', background: color, borderRadius: '2px', flexShrink: 0 }} />
      <h2
        style={{
          margin: 0,
          fontSize: size === 'small' ? '10px' : '10.5px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          color: '#0f172a',
        }}
      >
        {label}
      </h2>
      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
    </div>
  );
}
