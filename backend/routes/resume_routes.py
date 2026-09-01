"""
API routes for AI Resume Generation, single section enhancement, and quality scoring.
"""

from flask import Blueprint, request, jsonify
from backend.services.resume_generator import resume_generator
from backend.services.ai_service import ai_service
import logging

logger = logging.getLogger(__name__)

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/generate", methods=["POST"])
def generate_resume():
    """Generates the full AI-enhanced resume from raw questionnaire data."""
    try:
        data = request.get_json() or {}
        if not data:
            return jsonify({"error": "No resume data provided."}), 400
        
        # Process and generate
        result = resume_generator.process_and_generate(data)
        return jsonify({
            "success": True,
            "data": result,
            "aiConfigured": ai_service.is_ai_configured()
        }), 200

    except Exception as e:
        logger.error(f"Error generating resume: {e}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to generate resume. Please try again.",
            "details": str(e)
        }), 500

@resume_bp.route("/enhance-section", methods=["POST"])
def enhance_section():
    """
    Enhances a specific resume section with custom tone.
    Expected payload: { sectionType: "summary" | "project_description" | "experience_bullet", content: "...", tone: "professional" | "concise" | "technical", context: {...} }
    """
    try:
        data = request.get_json() or {}
        section_type = data.get("sectionType", "summary")
        content = data.get("content", "")
        tone = data.get("tone", "professional")
        context = data.get("context", {})

        enhanced = ai_service.enhance_single_section(section_type, content, tone, context)
        return jsonify({
            "success": True,
            "enhancedContent": enhanced,
            "tone": tone
        }), 200

    except Exception as e:
        logger.error(f"Error enhancing section: {e}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to enhance section.",
            "details": str(e)
        }), 500

@resume_bp.route("/score", methods=["POST"])
def calculate_score():
    """Calculates or updates the Resume Quality Score for edited resume data."""
    try:
        data = request.get_json() or {}
        score_report = resume_generator.calculate_quality_score(data)
        return jsonify({
            "success": True,
            "score": score_report
        }), 200
    except Exception as e:
        logger.error(f"Error calculating score: {e}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to calculate quality score.",
            "details": str(e)
        }), 500

@resume_bp.route("/chat", methods=["POST"])
def chat_review():
    """
    Provides real-time interactive AI chat advice and review for resume queries.
    Expected payload: { message: str, history: list, resumeData: dict }
    """
    try:
        data = request.get_json() or {}
        message = data.get("message", "")
        history = data.get("history", [])
        resume_data = data.get("resumeData", {})

        if not message.strip():
            return jsonify({"success": False, "error": "Message is required."}), 400

        reply = ai_service.chat_with_resume(message, history, resume_data)
        return jsonify({
            "success": True,
            "reply": reply,
            "aiConfigured": ai_service.is_ai_configured()
        }), 200
    except Exception as e:
        logger.error(f"Error in chat review: {e}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to process chat query.",
            "details": str(e)
        }), 500

@resume_bp.route("/health", methods=["GET"])
def health_check():
    """Health status and configuration inspection."""
    return jsonify({
        "status": "healthy",
        "aiConfigured": ai_service.is_ai_configured(),
        "provider": ai_service.provider if ai_service.is_ai_configured() else "local-heuristic"
    }), 200
