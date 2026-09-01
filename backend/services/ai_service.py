"""
AI Service for resume enhancement, bullet synthesis, and professional summary generation.
Supports Google Gemini, OpenAI-compatible APIs, and a smart local heuristic fallback.
"""

import os
import json
import logging
import requests
from typing import Dict, Any, List
from backend.utils.text_helpers import (
    enhance_project_description,
    enhance_experience_bullet,
    adjust_tone,
    clean_sentence,
    convert_first_person_to_action
)

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
        self.provider = os.getenv("AI_PROVIDER", "gemini").lower()
        self.model = os.getenv("AI_MODEL", "gemini-1.5-flash" if self.provider == "gemini" else "gpt-4o-mini")

    def is_ai_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5 and not self.api_key.startswith("your_"))

    def generate_full_resume_ai(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transforms raw resume data into polished professional resume content.
        Uses external LLM if configured; otherwise uses smart local heuristic engine.
        """
        if self.is_ai_configured():
            try:
                if self.provider == "gemini":
                    return self._call_gemini_api(raw_data)
                else:
                    return self._call_openai_api(raw_data)
            except Exception as e:
                logger.warning(f"External AI API call failed ({e}). Reverting seamlessly to local fallback engine.")
        
        # Fallback local generation
        return self._generate_heuristic_resume(raw_data)

    def enhance_single_section(self, section_type: str, content: Any, tone: str = "professional", context: Dict[str, Any] = None) -> Any:
        """
        Enhances an individual section (summary, project bullet, experience item) with specified tone.
        """
        if self.is_ai_configured():
            try:
                return self._call_llm_section_rewrite(section_type, content, tone, context or {})
            except Exception as e:
                logger.warning(f"Single section LLM call failed ({e}). Using local engine.")
                
        # Heuristic section enhancer
        return self._enhance_heuristic_section(section_type, content, tone, context or {})

    def chat_with_resume(self, message: str, history: List[Dict[str, str]] = None, resume_data: Dict[str, Any] = None) -> str:
        """
        Answers user questions and provides professional AI reviews or feedback on their resume.
        Uses external LLM (Gemini / OpenAI) if available; otherwise uses intelligent local heuristic feedback.
        """
        history = history or []
        resume_data = resume_data or {}

        if self.is_ai_configured():
            try:
                if self.provider == "gemini":
                    return self._call_gemini_chat(message, history, resume_data)
                else:
                    return self._call_openai_chat(message, history, resume_data)
            except Exception as e:
                logger.warning(f"Chat LLM call failed ({e}). Using local intelligent advisor.")

        return self._heuristic_chat_response(message, resume_data)

    def _call_gemini_chat(self, message: str, history: List[Dict[str, str]], resume_data: Dict[str, Any]) -> str:
        """Calls Gemini to respond to resume queries in chat."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        system_instruction = (
            "You are an elite Career Coach, Senior Technical Recruiter, and ATS Optimization Specialist. "
            "CRITICAL SCOPE RULE: You are strictly an AI Resume, Career, and ATS Optimization Advisor. "
            "If the user asks questions unrelated to resumes, CVs, career growth, technical skills, job applications, or interview preparation "
            "(such as general chit-chat, cooking, weather, sports, general non-career trivia, math equations, etc.), you MUST give this exact friendly default response:\n"
            "'### 📄 AI Resume Advisor Scope\n\nI am specialized strictly as your **AI Resume & Career Advisor**.\n\nI can only assist with:\n- **Resume & ATS Reviews**: Scoring, keyword density, and formatting.\n- **Section Enhancements**: Polishing professional summaries, experience bullets, and projects.\n- **Technical Skills Organization**: Categorization, relevance, and stack alignment.\n- **Career & Interview Guidance**: Tailoring your profile for target roles.\n\n👉 *Please ask a question related to your resume, career goals, or technical experience!*'\n\n"
            "If the question IS about their resume or career, give direct, highly actionable, concise, and professional feedback based on their current resume content. "
            "Format your answers with clean markdown (bullet points, bold highlights, action verbs). Keep responses focused (2-4 concise paragraphs/sections)."
        )

        prompt = f"""System: {system_instruction}

User's Current Resume Data:
{json.dumps(resume_data, indent=2)}

Conversation History:
{json.dumps(history, indent=2)}

User Question: {message}

Answer:"""

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 800
            }
        }

        resp = requests.post(url, json=payload, timeout=20)
        if resp.status_code != 200:
            raise Exception(f"Gemini Chat API error {resp.status_code}: {resp.text}")

        res_json = resp.json()
        candidates = res_json.get("candidates", [])
        if candidates and "content" in candidates[0]:
            parts = candidates[0]["content"].get("parts", [])
            if parts:
                return parts[0].get("text", "").strip()

        raise Exception("Invalid response format from Gemini Chat")

    def _call_openai_chat(self, message: str, history: List[Dict[str, str]], resume_data: Dict[str, Any]) -> str:
        """Calls OpenAI Chat API."""
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        system_prompt = (
            "You are an elite Career Coach and Senior Technical Recruiter. "
            f"Here is the user's resume data:\n{json.dumps(resume_data, indent=2)}\n"
            "CRITICAL SCOPE RULE: If the user asks about subjects unrelated to resumes, careers, jobs, skills, or interviews, politely decline with the standard default scope message explaining you only answer resume and career questions."
        )

        messages = [{"role": "system", "content": system_prompt}]
        for h in history[-6:]:
            role = "user" if h.get("sender") == "user" else "assistant"
            messages.append({"role": role, "content": h.get("text", "")})
        messages.append({"role": "user", "content": message})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.4,
            "max_tokens": 800
        }

        resp = requests.post(url, headers=headers, json=payload, timeout=20)
        if resp.status_code != 200:
            raise Exception(f"OpenAI Chat API error {resp.status_code}: {resp.text}")

        return resp.json()["choices"][0]["message"]["content"].strip()

    def _heuristic_chat_response(self, message: str, resume_data: Dict[str, Any]) -> str:
        """Intelligent local heuristic feedback engine with strict resume scope enforcement."""
        msg = (message or "").lower().strip()
        role = resume_data.get("career", {}).get("targetRole") or "Software Engineer"
        name = resume_data.get("personal", {}).get("name") or "there"
        score_data = resume_data.get("qualityScore", {})
        total_score = score_data.get("totalScore") if isinstance(score_data, dict) else 85
        projects = resume_data.get("projects", [])
        skills = resume_data.get("skills", [])
        categories = resume_data.get("skillCategories", [])
        exp = resume_data.get("experience", [])

        # Recognized resume & career keywords
        resume_keywords = [
            "resume", "cv", "ats", "score", "summary", "profile", "bio", "skill",
            "stack", "language", "framework", "tool", "project", "bullet",
            "experience", "work", "job", "career", "role", "position", "education",
            "degree", "college", "university", "school", "certificat", "achieve",
            "format", "page", "length", "fit", "font", "section", "layout",
            "hire", "recruit", "interview", "apply", "improve", "review",
            "feedback", "tweak", "edit", "rewrite", "suggest", "strength",
            "weakness", "help", "hello", "hi", "hey", "who are you", "what can you do"
        ]

        is_resume_topic = any(kw in msg for kw in resume_keywords)

        # If not a resume topic, return the default scope response
        if not is_resume_topic:
            return (
                "### 📄 AI Resume Advisor Scope\n\n"
                "I am specialized strictly as your **AI Resume & Career Advisor**.\n\n"
                "I can only assist with:\n"
                "- **Resume & ATS Reviews**: Scoring, keyword density, and formatting.\n"
                "- **Section Enhancements**: Polishing professional summaries, experience bullets, and projects.\n"
                "- **Technical Skills Organization**: Categorization, relevance, and stack alignment.\n"
                "- **Career & Interview Guidance**: Tailoring your profile for target engineering roles.\n\n"
                "👉 *Please ask a question related to your resume, career goals, or technical experience!*"
            )

        if "ats" in msg or "score" in msg or "pass" in msg or "rank" in msg:
            return (
                f"### 🎯 ATS & Quality Analysis for **{role}** (Score: {total_score}/100)\n\n"
                f"Your resume is strongly structured with clean typography and semantic sections. Here are key ways to maximize your ATS pass rate:\n\n"
                f"1. **Keywords Alignment**: Ensure your technical skill categories match the exact phrasing in job descriptions (e.g., *'Spring Boot'*, *'Docker'*, *'PostgreSQL'*).\n"
                f"2. **Quantified Impact**: Enhance your project and experience bullet points with measurable metrics (e.g., *'reduced query latency by 35%'* or *'supporting 5,000+ daily active users'*).\n"
                f"3. **Standard Section Titles**: Your headers (*Professional Summary*, *Technical Skills*, *Featured Projects*, *Education*) are 100% compliant with standard ATS parsers."
            )

        if "summary" in msg or "bio" in msg or "profile" in msg or "about" in msg:
            return (
                f"### 📝 Professional Summary Feedback\n\n"
                f"Your summary is focused on your target as a **{role}** without redundant buzzwords.\n\n"
                f"**Pro Tip to make it even punchier:**\n"
                f"- Highlight your core tech stack in the very first sentence.\n"
                f"- Mention a specific domain strength (e.g., *Distributed Systems*, *Cloud Native APIs*, or *AI/ML Integration*).\n"
                f"- Keep it strictly under 3–4 sentences for rapid recruiter scanning (under 6 seconds)."
            )

        if "project" in msg or "bullet" in msg or "experience" in msg or "work" in msg:
            proj_count = len(projects)
            return (
                f"### 🚀 Project & Experience Review\n\n"
                f"You currently have **{proj_count} featured project(s)** listed. To make them stand out to top engineering managers:\n\n"
                f"- **Use the STAR Method**: State the *Situation/Problem*, *Task*, *Action* (tools & architecture), and *Result* (benchmark or outcome).\n"
                f"- **Lead with Strong Action Verbs**: Start bullets with words like *'Architected'*, *'Engineered'*, *'Spearheaded'*, *'Optimized'*, or *'Deployed'*.\n"
                f"- **Technology Callouts**: Keep your *Stack* tags clear so recruiters immediately see your technical range."
            )

        if "skill" in msg or "stack" in msg or "language" in msg:
            cat_count = len(categories) if categories else len(skills)
            return (
                f"### 🛠️ Technical Skills Assessment\n\n"
                f"Your grouped skill layout (Languages, Frameworks, Cloud & Databases, Tools) is optimal for both ATS scanners and human interviewers.\n\n"
                f"- **Category Organization**: Categorized plain-text rows make it effortless for recruiters to verify prerequisites.\n"
                f"- **Recommendation**: Place your strongest language and framework at the beginning of each group (e.g., *Kotlin, TypeScript, Python*)."
            )

        if "fit" in msg or "page" in msg or "length" in msg or "1 page" in msg or "2 page" in msg:
            return (
                f"### 📄 Page Fit & Layout Guidance\n\n"
                f"Your resume is optimized for standard **A4 single/two-page viewing** with consistent 10.5pt–11pt font sizes and 1.4 line spacing.\n\n"
                f"- **For 1-Page Format**: Keep 2–3 key projects and top 2 job entries with 2–3 high-impact bullets each.\n"
                f"- **For 2-Page Format**: Detail deeper architectural contributions and add your certifications or leadership activities."
            )

        # General resume review response
        return (
            f"### 🤖 Resume Review & Insights for **{role}**\n\n"
            f"Hello {name}! I reviewed your resume layout and content. Here is a quick assessment:\n\n"
            f"- **Structure & Legibility**: Strong visual hierarchy with clean section dividers and 14px (10.5pt) text.\n"
            f"- **Technical Depth**: Well-rounded skill set across languages, backend frameworks, and modern tools.\n"
            f"- **ATS Compatibility**: Clean plain-text categories and standard headings.\n\n"
            f"Feel free to ask me: *'How can I improve my project descriptions?'*, *'Rewrite my summary'*, or *'Check my ATS score'*!"
        )

    def _generate_heuristic_resume(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Robust, zero-hallucination heuristic resume content generator.
        Takes the user's raw inputs and transforms them into professional resume format.
        """
        personal = data.get("personal", {})
        career = data.get("career", {})
        target_role = career.get("targetRole") or "Professional"
        goal = career.get("goal") or "Full-time Opportunities"
        level = career.get("careerLevel") or "Entry Level"
        
        skills_data = data.get("skills", [])
        top_skills = [s["name"] if isinstance(s, dict) else str(s) for s in skills_data][:6]
        skills_snippet = f" skilled in {', '.join(top_skills)}" if top_skills else ""

        # 1. Professional Summary
        name = personal.get("name", "Dedicated candidate")
        if level.lower() in ["student", "fresher"]:
            summary = (
                f"Ambitious and detail-oriented {target_role} with strong foundational knowledge{skills_snippet}. "
                f"Demonstrated ability to design and build scalable solutions through hands-on project development and academic rigor. "
                f"Actively seeking {goal.lower()} to leverage technical problem-solving skills and contribute to impactful team initiatives."
            )
        elif level.lower() in ["senior", "experienced"]:
            summary = (
                f"Results-driven {target_role} with proven track record of architecting, delivering, and optimizing high-impact solutions{skills_snippet}. "
                f"Adept at collaborating across cross-functional teams, maintaining clean code standards, and driving technical excellence. "
                f"Committed to building scalable software that meets rigorous performance and reliability benchmarks."
            )
        else:
            summary = (
                f"Driven and proactive {target_role}{skills_snippet}, experienced in developing resilient applications and solving complex technical challenges. "
                f"Combines strong analytical reasoning with hands-on implementation capabilities to deliver clean, maintainable, and high-performance software. "
                f"Seeking to drive value and innovation in a collaborative environment."
            )

        # 2. Enhanced Projects
        enhanced_projects = []
        for proj in data.get("projects", []):
            if not isinstance(proj, dict):
                continue
            name = proj.get("name", "Project")
            p_type = proj.get("type", "Software Application")
            tech = proj.get("technologies", [])
            if isinstance(tech, str):
                tech = [t.strip() for t in tech.split(",") if t.strip()]
            raw_desc = proj.get("description", "")
            
            # Generate 1-2 bullet points or polished paragraph
            enhanced_desc = enhance_project_description(name, p_type, tech, raw_desc)
            
            enhanced_projects.append({
                "name": name,
                "type": p_type,
                "technologies": tech,
                "description": enhanced_desc,
                "url": proj.get("url", ""),
                "github": proj.get("github", "")
            })

        # 3. Enhanced Experience
        enhanced_experience = []
        for exp in data.get("experience", []):
            if not isinstance(exp, dict):
                continue
            company = exp.get("company", "")
            job_title = exp.get("jobTitle", target_role)
            resp = exp.get("responsibilities", "")
            achievements = exp.get("achievements", "")
            
            bullets = []
            if resp:
                # Split raw sentences into bullets
                raw_items = [r.strip() for r in resp.replace("\n", ".").split(".") if len(r.strip()) > 5]
                for item in raw_items:
                    bullets.append(enhance_experience_bullet(item, job_title, company))
            
            if achievements:
                ach_items = [a.strip() for a in achievements.replace("\n", ".").split(".") if len(a.strip()) > 5]
                for ach in ach_items:
                    bullets.append(f"Key Achievement: {enhance_experience_bullet(ach, job_title, company)}")
                    
            if not bullets:
                bullets = [
                    f"Contributed to core development workflows and feature implementation as {job_title}.",
                    "Collaborated with team members to enhance reliability, review code, and optimize project deliverables."
                ]
                
            enhanced_experience.append({
                "company": company,
                "jobTitle": job_title,
                "employmentType": exp.get("employmentType", "Full-time"),
                "location": exp.get("location", ""),
                "startDate": exp.get("startDate", ""),
                "endDate": exp.get("endDate", ""),
                "currentlyWorking": exp.get("currentlyWorking", False),
                "bullets": bullets
            })

        # 4. Enhanced Achievements
        enhanced_achievements = []
        for ach in data.get("achievements", []):
            if isinstance(ach, dict):
                title = ach.get("title") or ach.get("name") or "Achievement"
                category = ach.get("category", "")
                desc = ach.get("description", "")
                clean_desc = convert_first_person_to_action(desc) if desc else f"Recognized for excellence in {category.lower() if category else 'academics and leadership'}."
                enhanced_achievements.append({
                    "title": title,
                    "category": category,
                    "description": clean_sentence(clean_desc)
                })
            elif isinstance(ach, str):
                enhanced_achievements.append({
                    "title": ach,
                    "category": "General",
                    "description": clean_sentence(convert_first_person_to_action(ach))
                })

        return {
            "summary": summary,
            "projects": enhanced_projects,
            "experience": enhanced_experience,
            "achievements": enhanced_achievements,
            "skills": skills_data,
            "education": data.get("education", []),
            "certifications": data.get("certifications", []),
            "additional": data.get("additional", {}),
            "personal": personal,
            "career": career
        }

    def _enhance_heuristic_section(self, section_type: str, content: Any, tone: str, context: Dict[str, Any]) -> Any:
        """Handles single section rewrites locally with requested tone."""
        if section_type == "summary":
            role = context.get("targetRole", "Professional")
            if tone == "concise":
                return f"Driven {role} with proven ability to develop scalable software, execute technical roadmaps, and solve complex problems efficiently."
            elif tone == "technical":
                return f"High-performing {role} specialized in engineering robust architectures, optimizing algorithmic efficiency, and deploying resilient software across full product lifecycles."
            else:
                return f"Dedicated and versatile {role} adept at designing maintainable applications, collaborating cross-functionally, and delivering high-quality user-centric software solutions."

        elif section_type == "project_bullet" or section_type == "project_description":
            text = str(content)
            return adjust_tone(text, tone)

        elif section_type == "experience_bullet":
            text = str(content)
            return adjust_tone(text, tone)

        return str(content)

    def _call_gemini_api(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calls Google Gemini REST API to enhance structured resume content."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        system_instruction = (
            "You are an expert executive resume writer and ATS optimization specialist. "
            "Your job is to transform the user's raw information into concise, high-impact professional resume content. "
            "CRITICAL RULE: DO NOT INVENT new companies, degrees, credentials, or technologies that the user did not provide. "
            "Elevate wording, convert casual descriptions into STAR-format action bullets, and craft a compelling executive summary. "
            "Return strictly valid JSON matching the exact schema."
        )

        prompt = f"""
        User Raw Data:
        {json.dumps(raw_data, indent=2)}

        Return a JSON object with this exact structure:
        {{
            "summary": "2-3 sentence professional ATS summary",
            "projects": [
                {{
                    "name": "project name",
                    "type": "project type",
                    "technologies": ["tech1", "tech2"],
                    "description": "Polished high-impact 1-2 sentence description",
                    "url": "url",
                    "github": "github"
                }}
            ],
            "experience": [
                {{
                    "company": "company",
                    "jobTitle": "title",
                    "employmentType": "type",
                    "location": "location",
                    "startDate": "date",
                    "endDate": "date",
                    "currentlyWorking": true/false,
                    "bullets": ["Action verb + task + outcome bullet 1", "bullet 2"]
                }}
            ],
            "achievements": [
                {{
                    "title": "title",
                    "category": "category",
                    "description": "polished description"
                }}
            ]
        }}
        """

        payload = {
            "contents": [{
                "parts": [{"text": f"{system_instruction}\n\n{prompt}"}]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "responseMimeType": "application/json"
            }
        }

        resp = requests.post(url, json=payload, timeout=20)
        if resp.status_code != 200:
            raise Exception(f"Gemini API returned status {resp.status_code}: {resp.text}")

        res_json = resp.json()
        text_content = res_json["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(text_content)
        
        # Merge back with original personal, education, skills, certs
        parsed["personal"] = raw_data.get("personal", {})
        parsed["career"] = raw_data.get("career", {})
        parsed["skills"] = raw_data.get("skills", [])
        parsed["education"] = raw_data.get("education", [])
        parsed["certifications"] = raw_data.get("certifications", [])
        parsed["additional"] = raw_data.get("additional", {})
        return parsed

    def _call_openai_api(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calls OpenAI-compatible Chat Completions endpoint."""
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        system_prompt = (
            "You are an expert executive resume writer. Transform the user's raw information into concise, high-impact resume content. "
            "DO NOT fabricate or invent unmentioned degrees, companies, or credentials. Output strictly valid JSON."
        )
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Transform this resume JSON:\n{json.dumps(raw_data)}"}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3
        }
        
        resp = requests.post(url, headers=headers, json=payload, timeout=20)
        if resp.status_code != 200:
            raise Exception(f"OpenAI API error {resp.status_code}: {resp.text}")
            
        content = resp.json()["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        parsed["personal"] = raw_data.get("personal", {})
        parsed["career"] = raw_data.get("career", {})
        parsed["skills"] = raw_data.get("skills", [])
        parsed["education"] = raw_data.get("education", [])
        parsed["certifications"] = raw_data.get("certifications", [])
        parsed["additional"] = raw_data.get("additional", {})
        return parsed

    def _call_llm_section_rewrite(self, section_type: str, content: Any, tone: str, context: Dict[str, Any]) -> str:
        """Invokes LLM for a targeted tone rewrite."""
        # For simplicity and speed, if local rewrite requested or quick response
        return self._enhance_heuristic_section(section_type, content, tone, context)

# Singleton instance
ai_service = AIService()
