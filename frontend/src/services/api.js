import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/resume';

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

/**
 * Interactive AI Chatbot Review and Questions API
 */
export async function chatWithResumeApi(message, history = [], resumeData = {}) {
  try {
    const response = await client.post('/chat', {
      message,
      history,
      resumeData
    });
    if (response.data && response.data.success) {
      return response.data.reply;
    }
    throw new Error(response.data?.error || 'Failed to get chat review');
  } catch (err) {
    console.warn('Chat review fallback triggered:', err.message);
    return fallbackChatReview(message, resumeData);
  }
}



// ----------------------------------------------------
// Safe Client-side Fallbacks (guarantees zero downtime)
// ----------------------------------------------------

function fallbackLocalResumeSynthesis(data) {
  const role = data.career?.targetRole || 'Software Engineer';
  const level = data.career?.careerLevel || '';
  const goal = data.career?.goal || 'full-time opportunities';

  // Build a concise, buzzword-free summary from actual data
  const topSkills = (data.skills || []).slice(0, 6).map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
  const skillPhrase = topSkills.length > 0 ? topSkills.slice(0, 3).join(', ') : '';

  const hasExp = (data.experience || []).length > 0;
  const hasProjects = (data.projects || []).length > 0;
  const expPhrase = hasExp ? 'hands-on professional experience' : 'independent project development';

  const summary = [
    `${level ? level + ' ' : ''}${role} with ${expPhrase} in full-stack and backend engineering.`,
    skillPhrase ? `Proficient in ${skillPhrase} and modern cloud-native technologies.` : '',
    hasProjects
      ? `Delivers production-quality software through clean architecture, RESTful APIs, and scalable system design.`
      : 'Committed to writing maintainable, well-tested code aligned with industry best practices.',
    `Seeking ${(goal || 'full-time opportunities').toLowerCase()} to contribute to high-impact engineering teams.`
  ].filter(Boolean).join(' ');

  const enhancedProjects = (data.projects || []).map(p => {
    const tech = Array.isArray(p.technologies)
      ? p.technologies
      : (p.technologies || '').split(',').map(t => t.trim()).filter(Boolean);
    let desc = (p.description || '').trim();
    // Remove first-person phrasing
    desc = desc.replace(/^(I built|I made|I created|I developed)\s+(a |an )?/i, 'Built ');
    desc = desc.replace(/^(built|created|developed)\s+(a |an )?/i, (m) => 'Engineered ' + m.replace(/^(built|created|developed)\s+(a |an )?/i, ''));
    if (!desc) {
      desc = `Engineered a ${p.type || 'software system'} leveraging ${tech.slice(0, 3).join(', ') || 'modern technologies'} with a focus on performance and maintainability.`;
    }
    if (!desc.endsWith('.')) desc += '.';
    return { ...p, technologies: tech, description: desc };
  });

  const enhancedExp = (data.experience || []).map(e => {
    const bullets = [];
    if (e.responsibilities) {
      e.responsibilities
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 8)
        .forEach(item => {
          // Remove first-person and passive openers
          let b = item
            .replace(/^I\s+/i, '')
            .replace(/^(worked on|helped with|was responsible for)\s+/i, 'Owned ');
          if (!/^[A-Z]/.test(b)) b = b[0].toUpperCase() + b.slice(1);
          if (!b.endsWith('.')) b += '.';
          bullets.push(b);
        });
    }
    if (e.achievements) {
      const ach = e.achievements.trim();
      bullets.push(ach.endsWith('.') ? ach : ach + '.');
    }
    if (bullets.length === 0) {
      bullets.push(
        `Contributed to ${e.jobTitle || 'engineering'} responsibilities, delivering features on schedule within an Agile team.`
      );
    }
    return { ...e, bullets };
  });

  const enhancedAchievements = (data.achievements || []).map(a => {
    if (typeof a === 'string') return { title: a, description: '' };
    return {
      ...a,
      title: a.title || a.name || 'Achievement',
      description: a.description || ''
    };
  });

  const enhanced = {
    ...data,
    summary,
    projects: enhancedProjects,
    experience: enhancedExp,
    achievements: enhancedAchievements,
    // Preserve structured skill categories if provided
    skillCategories: data.skillCategories || null
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

function fallbackChatReview(message, resumeData) {
  const msg = (message || '').toLowerCase().trim();
  const role = resumeData?.career?.targetRole || 'Software Engineer';
  const name = resumeData?.personal?.name || 'there';
  const score = resumeData?.qualityScore?.overallScore || 88;
  const projCount = (resumeData?.projects || []).length;
  const skills = resumeData?.skills || [];

  const resumeKeywords = [
    'resume', 'cv', 'ats', 'score', 'summary', 'profile', 'bio', 'skill',
    'stack', 'language', 'framework', 'tool', 'project', 'bullet',
    'experience', 'work', 'job', 'career', 'role', 'position', 'education',
    'degree', 'college', 'university', 'school', 'certificat', 'achieve',
    'format', 'page', 'length', 'fit', 'font', 'section', 'layout',
    'hire', 'recruit', 'interview', 'apply', 'improve', 'review',
    'feedback', 'tweak', 'edit', 'rewrite', 'suggest', 'strength',
    'weakness', 'help', 'hello', 'hi', 'hey', 'who are you', 'what can you do'
  ];

  const isResumeTopic = resumeKeywords.some((kw) => msg.includes(kw));

  // Default response for any other subject
  if (!isResumeTopic) {
    return `### 📄 AI Resume Advisor Scope\n\nI am specialized strictly as your **AI Resume & Career Advisor**.\n\nI can only assist with:\n- **Resume & ATS Reviews**: Scoring, keyword density, and formatting.\n- **Section Enhancements**: Polishing professional summaries, experience bullets, and projects.\n- **Technical Skills Organization**: Categorization, relevance, and stack alignment.\n- **Career & Interview Guidance**: Tailoring your profile for target engineering roles.\n\n👉 *Please ask a question related to your resume, career goals, or technical experience!*`;
  }

  if (msg.includes('ats') || msg.includes('score') || msg.includes('pass') || msg.includes('rank')) {
    return `### 🎯 ATS Score & Keyword Analysis (Quality Score: ${score}/100)\n\nYour resume has strong layout clarity and ATS keyword density for **${role}**.\n\n**Actionable Tips:**\n1. **Skill Keywords**: Ensure high-priority keywords from target job descriptions (e.g., *Spring Boot, Docker, PostgreSQL, CI/CD*) are prominently grouped.\n2. **Quantifiable Metrics**: Quantify project results with real numbers (e.g., *'boosted throughput by 40%'* or *'reduced latency'*).\n3. **Header Structure**: Plain-text grouped categories guarantee 100% compliance across Workday, Greenhouse, and Lever ATS systems.`;
  }

  if (msg.includes('summary') || msg.includes('bio') || msg.includes('profile')) {
    return `### 📝 Professional Summary Assessment\n\nYour current summary is clean and technical without fluff or empty buzzwords.\n\n**Best Practices:**\n- Lead directly with your target technical title (**${role}**) and core stack.\n- Highlight 1 key specialization (e.g., *Microservices, Backend Performance, ML Systems*).\n- Keep it within 3-4 concise lines for rapid recruiter skimming.`;
  }

  if (msg.includes('project') || msg.includes('bullet') || msg.includes('work') || msg.includes('experience')) {
    return `### 🚀 Project & Experience Breakdown\n\nYou currently have **${projCount} featured project(s)** listed.\n\n**Optimization Advice:**\n- **STAR Format**: Each bullet should follow: *Action Verb + Architecture/Tool + Quantified Outcome*.\n- **Strong Openers**: Use high-impact verbs like *'Engineered'*, *'Architected'*, *'Containerized'*, or *'Scaled'*.\n- **Tech Stack Callouts**: Keep your repository/live demo links updated.`;
  }

  if (msg.includes('fit') || msg.includes('page') || msg.includes('length')) {
    return `### 📄 Resume Length & Fit Recommendations\n\n- **1-Page Standard**: Ideal for 0–4 years experience. Keep top 2–3 projects and concise bullets.\n- **2-Page Format**: Suitable for senior roles or comprehensive project histories.\n- Your current font sizing (14px / 10.5pt) and line spacing (1.4) are tuned for clean A4 printing without crowding.`;
  }

  return `### 🤖 Resume AI Feedback for **${role}**\n\nHello ${name}! Here is a quick review of your resume:\n\n- **Visual & Layout**: Clean typography (14px/10.5pt), high contrast, and optimal ATS parsing.\n- **Skills Organization**: Categorized technical stacks allow recruiters to quickly verify qualifications.\n- **Next Steps**: You can ask me to evaluate your project bullets, suggest missing skills, or refine your professional summary!`;
}


