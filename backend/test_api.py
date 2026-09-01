"""
End-to-end test script for AI Resume Builder Backend Endpoints.
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_all():
    print("========================================")
    print("Running Full Suite of API Endpoint Tests")
    print("========================================")

    # 1. Health Check
    res = requests.get(f"{BASE_URL}/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print(f"[PASS] Health check: {res.json()}")

    # 2. Complete Resume Generation Test
    payload = {
        "personal": {
            "name": "Alex Johnson",
            "email": "alex.johnson@example.com",
            "phone": "+1 (555) 234-5678",
            "location": "Seattle, WA",
            "linkedin": "https://linkedin.com/in/alexjohnson-dev",
            "github": "https://github.com/alexjohnson"
        },
        "career": {
            "goal": "Full-time Job",
            "targetRole": "Full Stack Developer",
            "careerLevel": "Entry Level"
        },
        "education": [
            {
                "qualification": "Bachelor's Degree",
                "degree": "B.S. in Computer Science",
                "institution": "University of Washington",
                "endYear": "2025",
                "score": "3.85 / 4.0"
            }
        ],
        "skills": [
            {"name": "React", "category": "Frontend", "level": "Advanced"},
            {"name": "Python", "category": "Programming Languages", "level": "Intermediate"},
            {"name": "Flask", "category": "Backend", "level": "Intermediate"},
            {"name": "PostgreSQL", "category": "Database", "level": "Intermediate"}
        ],
        "projects": [
            {
                "name": "AI Resume Builder",
                "type": "Web Application",
                "technologies": ["React", "Flask", "Tailwind CSS"],
                "description": "I made a website where users answer guided questions and AI generates resumes."
            }
        ],
        "experience": [
            {
                "company": "InnovateTech",
                "jobTitle": "Software Engineering Intern",
                "responsibilities": "I worked on the customer dashboard and improved page load times.",
                "achievements": "Decreased load times by 25%."
            }
        ]
    }

    res = requests.post(f"{BASE_URL}/resume/generate", json=payload)
    assert res.status_code == 200, f"Resume generate failed: {res.status_code}"
    data = res.json()["data"]
    print(f"[PASS] Generate Resume API:")
    print(f"       -> Summary: {data['summary'][:90]}...")
    print(f"       -> Project Description: {data['projects'][0]['description']}")
    print(f"       -> Experience Bullets: {data['experience'][0]['bullets']}")
    print(f"       -> Overall Quality Score: {data['qualityScore']['overallScore']}/100")
    print(f"       -> Score Breakdown: {data['qualityScore']['categoryScores']}")

    # 3. Section Enhancement Tones Test
    for tone in ["professional", "concise", "technical"]:
        sec_res = requests.post(f"{BASE_URL}/resume/enhance-section", json={
            "sectionType": "project_description",
            "content": "I made a website where students find lost things",
            "tone": tone,
            "context": {"projectName": "Lost & Found"}
        })
        assert sec_res.status_code == 200
        print(f"[PASS] Tone '{tone}': {sec_res.json()['enhancedContent']}")

    # 4. Quality Score Recalculation Test
    score_res = requests.post(f"{BASE_URL}/resume/score", json=data)
    assert score_res.status_code == 200
    print(f"[PASS] Score recalculation: {score_res.json()['score']['overallScore']}/100")

    # 5. Vite Frontend Dev Server Check
    vite_res = requests.get("http://localhost:5173/")
    assert vite_res.status_code == 200
    print(f"[PASS] Frontend Vite server running on http://localhost:5173/ (HTTP 200)")

    print("========================================")
    print("ALL TESTS PASSED SUCCESSFULLY! (100% OK)")
    print("========================================")

if __name__ == "__main__":
    test_all()
