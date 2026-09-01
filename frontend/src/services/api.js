import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/resume';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends complete raw questionnaire data to Flask backend to generate AI enhanced resume.
 * Includes automatic client-side fallback in case Flask server is temporarily offline.
 */
export async function generateResumeApi(formData) {
  try {
    const response = await client.post('/generate', formData);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to generate resume.');
  } catch (err) {
    console.warn('Backend API request error, running local fallback synthesis:', err.message);
    // Safe client-side fallback synthesis
    return fallbackLocalResumeSynthesis(formData);
  }
}

/**
 * Enhances a specific section (summary, project bullet, experience) with requested tone.
 */
export async function enhanceSectionApi(sectionType, content, tone = 'professional', context = {}) {
  try {
    const response = await client.post('/enhance-section', {
      sectionType,
      content,
      tone,
      context
    });
    if (response.data && response.data.success) {
      return response.data.enhancedContent;
    }
    throw new Error('Failed to enhance section');
  } catch (err) {
    console.warn('Section enhancement fallback:', err.message);
    return fallbackSectionEnhancement(sectionType, content, tone, context);
  }
}

/**
 * Recalculates resume quality score.
 */
export async function calculateScoreApi(resumeData) {
  try {
    const response = await client.post('/score', resumeData);
    if (response.data && response.data.success) {
      return response.data.score;
    }
    throw new Error('Failed to calculate score');
  } catch (err) {
    return fallbackScoreCalculation(resumeData);
  }
}

// ----------------------------------------------------
// Safe Client-side Fallbacks (guarantees zero downtime)
// ----------------------------------------------------

function fallbackLocalResumeSynthesis(data) {
  const role = data.career?.targetRole || 'Software Professional';
  const goal = data.career?.goal || 'Opportunities';
  const topSkills = (data.skills || []).slice(0, 5).map(s => typeof s === 'string' ? s : s.name).join(', ');
  const skillStr = topSkills ? ` with expertise in ${topSkills}` : '';

  const summary = `Ambitious and solution-oriented ${role}${skillStr}. Demonstrated track record of architecting scalable applications, collaborating in agile environments, and translating complex requirements into reliable, user-friendly solutions. Actively seeking ${goal.toLowerCase()} to deliver immediate engineering impact.`;

  const enhancedProjects = (data.projects || []).map(p => {
    const tech = Array.isArray(p.technologies) ? p.technologies : (p.technologies || '').split(',').map(t => t.trim());
    let desc = p.description || '';
    if (desc.toLowerCase().startsWith('i built') || desc.toLowerCase().startsWith('i made')) {
      desc = 'Architected and developed ' + desc.replace(/^i (built|made|created) (a |an )?/i, '');
    } else if (!desc) {
      desc = `Engineered modern ${p.type || 'system'} with intuitive interface and optimized backend operations.`;
    }
    if (!desc.endsWith('.')) desc += '.';
    return {
      ...p,
      technologies: tech,
      description: desc
    };
  });

  const enhancedExp = (data.experience || []).map(e => {
    const bullets = [];
    if (e.responsibilities) {
      const items = e.responsibilities.split('.').map(s => s.trim()).filter(s => s.length > 5);
      items.forEach(item => {
        let b = item.replace(/^i\s+/i, 'Spearheaded ');
        if (!b.endsWith('.')) b += '.';
        bullets.push(b[0].toUpperCase() + b.slice(1));
      });
    }
    if (e.achievements) {
      bullets.push(`Key Achievement: ${e.achievements.trim()}`);
    }
    if (bullets.length === 0) {
      bullets.push(`Delivered key features and enhanced operational efficiency as ${e.jobTitle || 'Team Member'}.`);
    }
    return {
      ...e,
      bullets
    };
  });

  const enhancedAchievements = (data.achievements || []).map(a => {
    if (typeof a === 'string') return { title: a, category: 'General', description: a };
    return {
      ...a,
      title: a.title || a.name || 'Achievement',
      description: a.description || `Recognized for excellence in ${a.category || 'contribution'}.`
    };
  });

  const enhanced = {
    ...data,
    summary,
    projects: enhancedProjects,
    experience: enhancedExp,
    achievements: enhancedAchievements
  };

  enhanced.qualityScore = fallbackScoreCalculation(enhanced);
  return enhanced;
}

function fallbackSectionEnhancement(sectionType, content, tone, context) {
  const str = String(content || '').trim();
  if (tone === 'concise') {
    return str.replace(/\b(in order to|as well as|for the purpose of)\b/gi, 'to').replace(/\s+/g, ' ');
  }
  if (tone === 'technical') {
    return str.endsWith('.') ? str.slice(0, -1) + ' using robust architectural patterns and optimized workflows.' : str + ' using robust architectural patterns and optimized workflows.';
  }
  return str.replace(/^i (made|built|worked on)/i, 'Architected and engineered');
}

function fallbackScoreCalculation(resume) {
  let score = 50;
  const recs = [];
  
  if (resume.personal?.name && resume.personal?.email) score += 10;
  if (resume.personal?.linkedin) score += 5;
  else recs.push("Add a LinkedIn link to boost recruiter visibility.");

  if (resume.skills?.length >= 6) score += 15;
  else recs.push("Add at least 6 key skills to match automated ATS job filters.");

  if (resume.projects?.length >= 2) score += 10;
  else recs.push("Add 2 or more projects with GitHub or live URLs.");

  if (resume.summary && resume.summary.length > 40) score += 10;

  return {
    overallScore: Math.min(100, score),
    categoryScores: {
      content: 18,
      skills: Math.min(20, (resume.skills?.length || 0) * 2.5),
      projects: resume.projects?.length >= 2 ? 20 : 12,
      experience: resume.experience?.length > 0 ? 18 : 14,
      formatting: resume.personal?.linkedin ? 18 : 14
    },
    recommendations: recs.length > 0 ? recs : ["Great resume structure! All core sections are complete and professional."],
    rating: score >= 85 ? "Excellent" : "Good"
  };
}
