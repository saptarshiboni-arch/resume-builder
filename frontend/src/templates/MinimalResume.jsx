import React from 'react';

/**
 * MinimalResume — ATS-optimized print template
 * Monochromatic, hairline rules, generous whitespace.
 * Font sizes: body 14px (≈10.5pt), contact 13px (≈9.5pt-10pt).
 * Line heights: 1.4-1.45 throughout for optimal legibility.
 */
export default function MinimalResume({ data }) {
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

  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin ? `LinkedIn` : null,
    personal.github ? personal.github.replace(/https?:\/\/(www\.)?github\.com\//, 'github.com/') : null,
    personal.portfolio ? 'Portfolio' : null,
  ].filter(Boolean);

  return (
    <div
      className="resume-a4-sheet bg-white"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: '14px',
        lineHeight: 1.4,
        color: '#111827',
        padding: '30px 36px 28px',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        style={{
          textAlign: 'center',
          paddingBottom: '14px',
          marginBottom: '16px',
          borderBottom: '2px solid #111827',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '26px',
            fontWeight: '400',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: '#030712',
            fontFamily: "'Georgia', serif",
            lineHeight: 1.1,
          }}
        >
          {personal.name || 'Your Full Name'}
        </h1>

        {career.targetRole && (
          <p
            style={{
              margin: '5px 0 0',
              fontSize: '12.5px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#4b5563',
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: '500',
              lineHeight: 1.3,
            }}
          >
            {career.targetRole}{career.careerLevel ? ` · ${career.careerLevel}` : ''}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0',
            marginTop: '8px',
            fontSize: '13px',
            lineHeight: 1.35,
            color: '#374151',
            fontFamily: "'Inter', Arial, sans-serif",
          }}
        >
          {contactItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < contactItems.length - 1 && (
                <span style={{ margin: '0 8px', color: '#9ca3af' }}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* ── Summary ─────────────────────────────────────────────── */}
      {summary && (
        <section style={{ marginBottom: '14px' }}>
          <MinSection label="Summary" />
          <p style={{ margin: 0, color: '#1f2937', fontSize: '14px', lineHeight: 1.45, textAlign: 'justify' }}>
            {summary}
          </p>
        </section>
      )}

      {/* ── Skills — grouped categories (ATS-optimized) or flat fallback ── */}
      {(skillCategories?.length > 0 || skills?.length > 0) && (
        <section style={{ marginBottom: '14px' }}>
          <MinSection label="Core Competencies & Technologies" />
          {skillCategories && skillCategories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', color: '#1f2937', fontSize: '13px', lineHeight: 1.4, fontFamily: "'Inter', Arial, sans-serif" }}>
              {skillCategories.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontWeight: '700', color: '#030712', flexShrink: 0, minWidth: '145px' }}>
                    {cat.category}:
                  </span>
                  <span style={{ color: '#374151' }}>
                    {(cat.items || []).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: '#1f2937', fontSize: '13px', lineHeight: 1.4 }}>
              {skills.map((skill, idx) => {
                const name = typeof skill === 'string' ? skill : skill.name;
                return (
                  <React.Fragment key={idx}>
                    <span style={{ fontWeight: '600' }}>{name}</span>
                    {idx < skills.length - 1 ? ' · ' : ''}
                  </React.Fragment>
                );
              })}
            </p>
          )}
        </section>
      )}

      {/* ── Experience ─────────────────────────────────────────── */}
      {experience && experience.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <MinSection label="Professional Experience" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: '#030712', fontSize: '14px' }}>
                      {exp.company || 'Company'}
                    </span>
                    <span style={{ color: '#374151', fontSize: '13.5px' }}>
                      {' — '}
                      <em>{exp.jobTitle || 'Role'}</em>
                    </span>
                    {exp.employmentType && (
                      <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '5px' }}>
                        ({exp.employmentType})
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12.5px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'sans-serif' }}>
                    {exp.startDate || ''}{exp.startDate && (exp.endDate || exp.currentlyWorking) ? ' – ' : ''}
                    {exp.currentlyWorking ? 'Present' : exp.endDate || ''}
                  </span>
                </div>
                {exp.location && (
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', marginBottom: '3px' }}>
                    {exp.location}
                  </div>
                )}

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: '4px 0 0 18px', padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} style={{ color: '#1f2937', fontSize: '14px', lineHeight: 1.4 }}>
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

      {/* ── Projects ─────────────────────────────────────────────── */}
      {projects && projects.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <MinSection label="Projects" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: '#030712', fontSize: '14px' }}>{proj.name || 'Project'}</span>
                    {proj.type && <span style={{ color: '#9ca3af', fontWeight: '400', marginLeft: '5px', fontSize: '12px' }}>({proj.type})</span>}
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'sans-serif' }}>
                    {[proj.url ? 'Live' : null, proj.github ? 'GitHub' : null].filter(Boolean).join(' | ')}
                  </span>
                </div>

                {proj.description && (
                  <p style={{ margin: '3px 0 0', color: '#1f2937', fontSize: '14px', lineHeight: 1.45 }}>
                    {proj.description}
                  </p>
                )}

                {proj.technologies && proj.technologies.length > 0 && (
                  <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6b7280', fontFamily: 'sans-serif' }}>
                    <strong style={{ color: '#374151' }}>Tools: </strong>
                    {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Education ─────────────────────────────────────────── */}
      {education && education.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <MinSection label="Education" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                <div>
                  <span style={{ fontWeight: '700', color: '#030712', fontSize: '14px' }}>
                    {edu.institution || edu.school || 'University'}
                  </span>
                  <div style={{ fontStyle: 'italic', color: '#374151', fontSize: '13px', lineHeight: 1.4 }}>
                    {edu.degree || edu.qualification || 'Degree'}
                    {edu.field ? `, ${edu.field}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '13px', color: '#6b7280', fontFamily: 'sans-serif', lineHeight: 1.35 }}>
                  <div>{edu.startYear ? `${edu.startYear} – ` : ''}{edu.endYear || edu.year || ''}</div>
                  {edu.score && <div style={{ fontWeight: '600', color: '#374151' }}>{edu.score}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Certifications & Achievements ─────────────────────── */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <section style={{ marginBottom: '14px' }}>
          <MinSection label="Certifications & Honors" />
          <ul style={{ margin: '0 0 0 18px', padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {certifications.map((cert, idx) => (
              <li key={`c-${idx}`} style={{ color: '#1f2937', fontSize: '13.5px', lineHeight: 1.4 }}>
                <strong>{cert.name}</strong>
                {cert.organization && ` — ${cert.organization}`}
                {cert.date ? ` (${cert.date})` : ''}
              </li>
            ))}
            {achievements.map((ach, idx) => (
              <li key={`a-${idx}`} style={{ color: '#1f2937', fontSize: '13.5px', lineHeight: 1.4 }}>
                <strong>{ach.title || ach}</strong>
                {ach.description ? `: ${ach.description}` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Additional ─────────────────────────────────────────── */}
      {hasAdditional && (
        <section style={{ paddingTop: '10px', borderTop: '1px solid #d1d5db', fontSize: '13px', lineHeight: 1.4, color: '#4b5563', fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {additional.languages && additional.languages.length > 0 && (
              <div><strong style={{ color: '#111827' }}>Languages: </strong>{additional.languages.join(', ')}</div>
            )}
            {additional.leadership && additional.leadership.length > 0 && (
              <div><strong style={{ color: '#111827' }}>Leadership & Activities: </strong>{additional.leadership.join('; ')}</div>
            )}
            {additional.interests && additional.interests.length > 0 && (
              <div><strong style={{ color: '#111827' }}>Interests: </strong>{additional.interests.join(', ')}</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function MinSection({ label }) {
  return (
    <div style={{ marginBottom: '6px' }}>
      <h2
        style={{
          margin: '0 0 4px 0',
          fontSize: '10.5px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: '#030712',
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {label}
      </h2>
      <div style={{ height: '1px', background: '#d1d5db' }} />
    </div>
  );
}
