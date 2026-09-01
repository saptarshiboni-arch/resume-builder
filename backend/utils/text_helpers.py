"""
Text helper utilities for resume content enhancement, action verbs, and tone adjustment.
"""

import re
import random

ACTION_VERBS_TECHNICAL = [
    "Architected", "Engineered", "Developed", "Implemented", "Designed",
    "Deployed", "Refactored", "Optimized", "Integrated", "Automated"
]

ACTION_VERBS_COLLABORATIVE = [
    "Spearheaded", "Collaborated with", "Led", "Coordinated", "Facilitated",
    "Partnered with cross-functional teams to deliver", "Championed"
]

ACTION_VERBS_IMPACT = [
    "Streamlined", "Accelerated", "Enhanced", "Maximized", "Reduced latency by",
    "Elevated system throughput", "Delivered robust", "Transformed"
]

def clean_sentence(text: str) -> str:
    """Removes trailing periods, leading bullets, and excessive whitespace."""
    if not text:
        return ""
    text = text.strip()
    text = re.sub(r"^[\*\-\•\d\.\)\s]+", "", text)
    text = re.sub(r"\s+", " ", text)
    if not text.endswith("."):
        text += "."
    return text

def convert_first_person_to_action(text: str) -> str:
    """Replaces first-person phrases ('I made', 'I built', 'I worked on') with strong verbs."""
    if not text:
        return ""
    
    clean = text.strip()
    # Normalize common casual phrasing
    replacements = [
        (r"(?i)\bi made a\b", "Developed an interactive"),
        (r"(?i)\bi made an\b", "Engineered an"),
        (r"(?i)\bi made\b", "Engineered"),
        (r"(?i)\bi built a\b", "Architected and built a"),
        (r"(?i)\bi built an\b", "Architected and built an"),
        (r"(?i)\bi built\b", "Architected"),
        (r"(?i)\bi worked on\b", "Spearheaded development of"),
        (r"(?i)\bi created\b", "Created and deployed"),
        (r"(?i)\bi developed\b", "Developed and optimized"),
        (r"(?i)\bi helped\b", "Collaborated to deliver"),
        (r"(?i)\bi wrote\b", "Authored and implemented"),
        (r"(?i)\bi designed\b", "Designed and implemented"),
        (r"(?i)\bi am responsible for\b", "Overseeing and managing"),
        (r"(?i)\bmy role was to\b", "Successfully executed"),
        (r"(?i)\bresponsible for\b", "Directed execution of"),
    ]
    
    for pattern, repl in replacements:
        clean = re.sub(pattern, repl, clean)
        
    # Capitalize first letter
    if clean:
        clean = clean[0].upper() + clean[1:]
        
    return clean

def enhance_project_description(name: str, p_type: str, tech_list: list, raw_desc: str) -> str:
    """Enhances raw project descriptions into professional resume bullet points."""
    tech_str = ", ".join(tech_list) if tech_list else ""
    
    if not raw_desc or len(raw_desc.strip()) < 5:
        # Fallback if minimal description is provided
        if tech_str:
            return f"Architected and deployed {name or 'the project'}, a modern {p_type.lower() if p_type else 'system'} utilizing {tech_str} to deliver intuitive user experience and reliable performance."
        return f"Engineered and deployed {name or 'the application'} focused on delivering high performance, structured workflows, and scalable functionality."
    
    enhanced = convert_first_person_to_action(raw_desc)
    
    # Check if tech stack is mentioned; if not and tech_list exists, append cleanly
    if tech_list and not any(t.lower() in enhanced.lower() for t in tech_list[:2]):
        primary_tech = ", ".join(tech_list[:3])
        enhanced = enhanced.rstrip(".")
        enhanced = f"{enhanced}, leveraging modern best practices with {primary_tech}."
        
    return clean_sentence(enhanced)

def enhance_experience_bullet(bullet: str, role: str = "", company: str = "") -> str:
    """Elevates an experience bullet point to standard professional ATS style."""
    if not bullet:
        return ""
    
    enhanced = convert_first_person_to_action(bullet)
    
    # Ensure it starts with a strong action verb if it starts weakly
    words = enhanced.split()
    if words and words[0].lower() in ["and", "also", "then", "doing", "working", "handling"]:
        words[0] = random.choice(ACTION_VERBS_TECHNICAL)
        enhanced = " ".join(words)
        
    return clean_sentence(enhanced)

def adjust_tone(text: str, tone: str) -> str:
    """Adjusts text tone based on requested instruction."""
    if not text:
        return ""
    
    clean = text.strip()
    
    if tone == "concise":
        # Remove fluff words
        fluff = [
            r"(?i)\bin order to\b", r"(?i)\bfor the purpose of\b", r"(?i)\bas well as\b",
            r"(?i)\butilizing various\b", r"(?i)\bworked diligently to\b"
        ]
        for f in fluff:
            clean = re.sub(f, "to", clean)
        clean = re.sub(r"\s+", " ", clean)
        return clean_sentence(clean)
        
    elif tone == "technical":
        # Add technical rigour phrasing if appropriate
        if not any(k in clean.lower() for k in ["architecture", "modular", "throughput", "latency", "pipeline", "lifecycle"]):
            clean = clean.rstrip(".") + " utilizing modular design patterns and optimized data workflows."
        return clean_sentence(clean)
        
    elif tone == "professional":
        # Ensure high impact polished tone
        clean = convert_first_person_to_action(clean)
        return clean_sentence(clean)
        
    return clean_sentence(clean)
