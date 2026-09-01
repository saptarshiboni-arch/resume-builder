# AI Resume Builder — MVP Prototype

An end-to-end AI-powered Resume Builder web application built with **React, Vite, Tailwind CSS, Framer Motion, and Python Flask**.

Users answer interactive, multi-step questions with guided selection pills, and AI synthesizes their raw input into recruiter-approved action bullet points, executive summaries, and formatted ATS-friendly resumes across 3 printable A4 templates with live in-place editing and instant PDF export.

---

## Key Features

1. **Guided Multi-Step Questionnaire**:
   - 8-step wizard with visual progress bar, back/next navigation, and review page.
   - Dynamic form fields for education (Bachelor's/Master's vs Schooling).
   - Categorized interactive skills taxonomy with optional proficiency tags.
   - Add/Remove multiple items for Education, Projects, Experience, Certifications, and Achievements.
   - Allows simple casual descriptions (e.g. *"I made a website for students to find lost things"*) which AI elevates into STAR-format achievements.

2. **AI Resume Synthesis Engine**:
   - Generates 2-3 sentence executive summary tailored to target role and experience level.
   - Synthesizes impactful project descriptions with strong action verbs and technology context.
   - Crafts professional experience bullet points.
   - Strict **Zero-Hallucination Guardrail**: only refines wording without inventing fake degrees, companies, or credentials.
   - Intelligent Local Heuristic Fallback Engine ensures 100% functionality even without an external API key.
   - Supports Google Gemini and OpenAI-compatible API providers via `.env`.

3. **3 Resume Templates**:
   - **Modern**: Sleek header stripe, pill badges, and structured sections.
   - **Minimal**: Monochromatic, clean hairline rules, ATS high-readability.
   - **Professional**: Executive dark banner header, structured cards, strong corporate presence.
   - All templates adapt to A4 print dimensions (`210mm x 297mm`) and omit empty sections gracefully.

4. **In-Place Section Editor & AI Rewrites**:
   - Edit any summary, project description, or bullet point directly.
   - 1-Click AI Tone Refinements:
     - *"Make More Professional ✨"*
     - *"Make Concise ✨"*
     - *"Make More Technical ✨"*
     - *"Regenerate with AI ✨"*

5. **Resume Quality Score (0-100)**:
   - Transparent category breakdown: Content, Skills, Projects, Experience, Formatting.
   - Actionable recommendations to improve recruiter discoverability.

6. **High-Fidelity PDF Download**:
   - 1-Click client-side PDF export matching the exact A4 layout.

7. **1-Click Demo Data**:
   - "Try Demo" preloads rich realistic data (Alex Johnson profile) for immediate testing.

---

## Technology Stack

### Frontend
- **Framework**: React 18+ (Vite)
- **Language**: JavaScript (ESNext)
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **API Client**: Axios
- **PDF Export**: html2pdf.js / jsPDF + html2canvas
- **Effects**: Canvas Confetti

### Backend
- **Framework**: Python 3.10+ / Flask
- **CORS**: Flask-CORS
- **Environment**: python-dotenv
- **HTTP**: requests

---

## Project Structure

```
AI-Resume-Builder/
│
├── backend/
│   ├── app.py                      # Flask entrypoint & CORS config
│   ├── routes/
│   │   ├── __init__.py
│   │   └── resume_routes.py        # /api/resume/generate, /enhance-section, /score, /health
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py           # Gemini/OpenAI connector + Fallback engine
│   │   └── resume_generator.py     # Resume processor & Quality scoring
│   ├── utils/
│   │   ├── __init__.py
│   │   └── text_helpers.py         # Bullet point parser, action verbs & tone adjusters
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Sample environment file
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header & demo trigger
│   │   │   ├── Footer.jsx          # SaaS footer
│   │   │   ├── ProgressBar.jsx     # Wizard progress tracker
│   │   │   ├── SectionEditModal.jsx# In-place AI tone editor
│   │   │   ├── QualityScoreWidget.jsx # Resume quality score & recommendations
│   │   │   ├── PdfExportButton.jsx # A4 PDF download handler
│   │   │   └── HowItWorksModal.jsx # Visual workflow guide
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Hero, features, demo CTA
│   │   │   ├── WizardPage.jsx      # 8-step questionnaire + review page
│   │   │   └── PreviewPage.jsx     # Template switcher, live preview & editor
│   │   ├── templates/
│   │   │   ├── ModernResume.jsx    # Modern template
│   │   │   ├── MinimalResume.jsx   # Minimalist ATS template
│   │   │   └── ProfessionalResume.jsx # Executive template
│   │   ├── services/
│   │   │   └── api.js              # Axios API service + client-side safe fallback
│   │   ├── data/
│   │   │   ├── predefinedOptions.js# Taxonomy & questionnaire choices
│   │   │   └── demoData.js         # Realistic sample profile
│   │   ├── App.jsx                 # App routing & state
│   │   ├── index.css               # Tailwind & A4 print CSS
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── ...
│
├── README.md
└── .gitignore
```

---

## Setup & Running Locally

### 1. Prerequisites
- **Node.js**: v18 or higher (`node -v`)
- **Python**: v3.10 or higher (`python --version`)

---

### 2. Backend Setup (Flask)

Open a terminal and navigate to the `backend/` directory:

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Setup environment variables
cp .env.example .env

# Run Flask backend server
python app.py
```

The Flask server will start at: `http://localhost:5000`

---

### 3. Frontend Setup (React / Vite)

Open a second terminal and navigate to the `frontend/` directory:

```bash
cd frontend

# Install dependencies
npm install

# Run Vite development server
npm run dev
```

The React frontend will be accessible at: `http://localhost:5173`

---

## AI API Configuration (Optional)

The application includes an **intelligent built-in heuristic transformer** that works immediately without any external API key.

If you wish to use Google Gemini or OpenAI:

1. Create a `backend/.env` file (copied from `backend/.env.example`):
```env
PORT=5000
FLASK_ENV=development
DEBUG=True

# Google Gemini:
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash

# OR OpenAI:
# AI_PROVIDER=openai
# AI_API_KEY=your_openai_api_key_here
# AI_MODEL=gpt-4o-mini
```
2. Restart `python app.py`.

---

## Architecture & Data Flow

```
[User Answers Questions / Loads Demo]
                 ↓
        [React State (JSON)]
                 ↓
    [POST /api/resume/generate]
                 ↓
     [Flask: resume_generator]
                 ↓
        [ai_service.py]
      ↙                 ↘
[LLM (Gemini/OpenAI)]    [Local Heuristic Engine]
      ↘                 ↙
 [Structured Resume JSON + Quality Score]
                 ↓
[Live A4 Preview / 3 Template Switcher]
                 ↓
[In-Place AI Section Tweaks / Download PDF]
```

---

## Future Improvements & Roadmap
- [ ] User authentication (OAuth / JWT)
- [ ] Database persistence (PostgreSQL / Supabase)
- [ ] Multiple saved resumes per user account
- [ ] Job Description matching & ATS keyword density optimizer
- [ ] Cover letter & LinkedIn bio generator
- [ ] Custom accent color palettes & additional premium templates
