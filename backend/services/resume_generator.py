"""
Resume Generator service orchestrating AI processing, data sanitization,
and Resume Quality Scoring with actionable recommendations.
"""

from typing import Dict, Any, List
from backend.services.ai_service import ai_service

class ResumeGenerator:
    def __init__(self):
        self.ai = ai_service

    def process_and_generate(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes raw questionnaire JSON, generates AI summary and refined bullets,
        and attaches quality scoring and recommendations.
        """
        # Clean and sanitize incoming data structure
        sanitized = self._sanitize_input_data(raw_data)
        
        # Run AI generation
        enhanced_resume = self.ai.generate_full_resume_ai(sanitized)
        
        # Calculate Resume Quality Score
        score_report = self.calculate_quality_score(enhanced_resume)
        enhanced_resume["qualityScore"] = score_report
        
        return enhanced_resume

    def _sanitize_input_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Ensures all standard keys exist with predictable defaults."""
        return {
            "personal": data.get("personal") or {
                "name": "", "email": "", "phone": "", "location": "",
                "linkedin": "", "github": "", "portfolio": ""
            },
            "career": data.get("career") or {
                "goal": "", "targetRole": "", "careerLevel": ""
            },
            "education": data.get("education") or [],
            "skills": data.get("skills") or [],
            "projects": data.get("projects") or [],
            "experience": data.get("experience") or [],
            "certifications": data.get("certifications") or [],
            "achievements": data.get("achievements") or [],
            "additional": data.get("additional") or {
                "languages": [], "volunteering": [], "leadership": [],
                "publications": [], "interests": []
            }
        }

    def calculate_quality_score(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates a transparent Resume Quality Score (0-100) across 5 categories
        and generates actionable, constructive recommendations.
        """
        scores = {
            "content": 0,      # Max 20
            "skills": 0,       # Max 20
            "projects": 0,     # Max 20
            "experience": 0,   # Max 20
            "formatting": 0    # Max 20
        }
        recommendations = []

        personal = resume_data.get("personal", {})
        skills = resume_data.get("skills", [])
        projects = resume_data.get("projects", [])
        experience = resume_data.get("experience", [])
        education = resume_data.get("education", [])
        summary = resume_data.get("summary", "")

        # 1. Formatting & Contact Information (Max 20)
        fmt_score = 0
        if personal.get("name"): fmt_score += 5
        if personal.get("email"): fmt_score += 5
        if personal.get("phone"): fmt_score += 3
        if personal.get("linkedin"): fmt_score += 4
        if personal.get("github") or personal.get("portfolio"): fmt_score += 3
        scores["formatting"] = min(20, fmt_score)
        
        if not personal.get("linkedin"):
            recommendations.append("Add a LinkedIn profile link to improve recruiter discoverability.")
        if not personal.get("github") and not personal.get("portfolio"):
            recommendations.append("Include a GitHub or Portfolio URL to showcase live code/work samples.")

        # 2. Content & Summary (Max 20)
        content_score = 0
        if summary and len(summary.split()) >= 15:
            content_score += 15
        elif summary:
            content_score += 8
        if education and len(education) > 0:
            content_score += 5
        scores["content"] = min(20, content_score)

        if not summary or len(summary.split()) < 15:
            recommendations.append("Expand your Professional Summary with 2-3 focused sentences summarizing your key strengths.")

        # 3. Skills Breadth & Depth (Max 20)
        skill_count = len(skills)
        if skill_count >= 8:
            scores["skills"] = 20
        elif skill_count >= 5:
            scores["skills"] = 16
        elif skill_count >= 2:
            scores["skills"] = 10
        else:
            scores["skills"] = 5
            recommendations.append("Add at least 5-8 relevant technical skills and tools to pass keyword filters.")

        # 4. Projects (Max 20)
        proj_score = 0
        if len(projects) >= 2:
            proj_score += 12
        elif len(projects) == 1:
            proj_score += 8
        
        has_tech = any(p.get("technologies") and len(p.get("technologies")) > 0 for p in projects)
        has_link = any(p.get("url") or p.get("github") for p in projects)
        if has_tech: proj_score += 5
        if has_link: proj_score += 3
        scores["projects"] = min(20, proj_score)

        if not projects:
            recommendations.append("Adding 1-2 portfolio projects will significantly boost recruiter engagement.")
        elif not has_link:
            recommendations.append("Include live project URLs or GitHub repository links for verification.")

        # 5. Experience / Impact (Max 20)
        exp_score = 0
        if len(experience) > 0:
            exp_score += 10
            bullet_count = sum(len(e.get("bullets", [])) for e in experience)
            if bullet_count >= 3:
                exp_score += 6
            # Check for action words / metrics
            text_blob = " ".join(" ".join(e.get("bullets", [])) for e in experience)
            if any(char.isdigit() or "%" in text_blob or "$" in text_blob for char in text_blob):
                exp_score += 4
            else:
                recommendations.append("Incorporate quantifiable metrics (e.g. 'reduced latency by 25%', 'served 500+ users') in experience bullets.")
        else:
            # If student/fresher with good projects, give partial credit so freshers aren't penalized unfairly
            if len(projects) >= 2:
                exp_score = 15
            else:
                exp_score = 10

        scores["experience"] = min(20, exp_score)

        overall_score = sum(scores.values())

        if not recommendations:
            recommendations.append("Great resume! All key sections are well-structured, clear, and comprehensive.")

        return {
            "overallScore": overall_score,
            "categoryScores": scores,
            "recommendations": recommendations[:4],
            "rating": "Excellent" if overall_score >= 85 else "Good" if overall_score >= 70 else "Needs Improvement"
        }

# Singleton
resume_generator = ResumeGenerator()
