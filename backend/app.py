"""
Main Flask entry point for AI Resume Builder backend.
"""

import os
import sys
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

# Add root directory to sys.path to allow clean package imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

def create_app():
    app = Flask(__name__)

    # Enable CORS for all frontend requests
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from backend.routes.resume_routes import resume_bp
    app.register_blueprint(resume_bp, url_prefix="/api/resume")

    @app.route("/api/health", methods=["GET"])
    def root_health():
        return jsonify({
            "service": "AI Resume Builder Backend",
            "status": "online",
            "version": "1.0.0"
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    print(f">> AI Resume Builder Backend running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
