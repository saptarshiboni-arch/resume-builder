export const DEMO_RESUME_DATA = {
  personal: {
    name: "Saptarshi Chowdhury",
    email: "saptarshiboni@gmail.com",
    phone: "",
    location: "City, State",
    linkedin: "https://linkedin.com/in/saptarshi-chowdhury",
    github: "https://github.com/saptarshiboni",
    portfolio: ""
  },
  career: {
    goal: "Full-time Job",
    targetRole: "Software Engineer",
    careerLevel: "Entry Level"
  },
  education: [
    {
      id: "edu-1",
      qualification: "Bachelor's Degree",
      degree: "B.Tech in Computer Science",
      field: "Computer Science & Engineering",
      institution: "Your University Name",
      startYear: "2021",
      endYear: "2025",
      score: "CGPA / Percentage"
    }
  ],
  // Flat skills list kept for wizard compatibility
  skills: [
    { name: "Kotlin" },
    { name: "C++" },
    { name: "Swift" },
    { name: "TypeScript" },
    { name: "Python" },
    { name: "JavaScript" },
    { name: "Spring Boot" },
    { name: "Vue" },
    { name: "Node.js" },
    { name: "Django" },
    { name: "ASP.NET" },
    { name: "Ruby on Rails" },
    { name: "PostgreSQL" },
    { name: "MongoDB" },
    { name: "Redis" },
    { name: "DynamoDB" },
    { name: "AWS" },
    { name: "Docker" },
    { name: "Kubernetes" },
    { name: "Git" },
    { name: "GitHub" },
    { name: "Linux" },
    { name: "Jira" },
    { name: "Postman" },
    { name: "Scikit-Learn" },
    { name: "Machine Learning" },
    { name: "Deep Learning" },
    { name: "LLMs" },
    { name: "Computer Vision" }
  ],
  // Grouped categories for the resume templates (ATS-optimized plain-text layout)
  skillCategories: [
    {
      category: "Languages",
      items: ["Kotlin", "C++", "Swift", "TypeScript", "Python", "JavaScript"]
    },
    {
      category: "Frameworks & Web",
      items: ["Spring Boot", "Vue", "Node.js", "Django", "ASP.NET", "Ruby on Rails"]
    },
    {
      category: "Databases & Cloud",
      items: ["PostgreSQL", "MongoDB", "Redis", "DynamoDB", "AWS", "Docker", "Kubernetes"]
    },
    {
      category: "Developer Tools",
      items: ["Git", "GitHub", "Linux", "Jira", "Postman"]
    },
    {
      category: "AI & Machine Learning",
      items: ["Scikit-Learn", "Machine Learning", "Deep Learning", "LLMs", "Computer Vision"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "AI Resume Builder",
      type: "Web Application",
      technologies: ["React", "Flask", "Tailwind CSS", "OpenAI API", "MongoDB"],
      description: "Engineered a full-stack AI-powered resume platform where users answer guided questions and the system generates ATS-optimized, PDF-downloadable resumes with live preview and section-level AI enhancement.",
      url: "",
      github: "https://github.com/saptarshiboni/ai-resume-builder"
    },
    {
      id: "proj-2",
      name: "Cloud TaskFlow",
      type: "Web Application",
      technologies: ["Vue", "Node.js", "PostgreSQL", "Docker", "WebSockets"],
      description: "Built a real-time collaborative Kanban board with WebSocket-driven live updates, automated team performance analytics, and Docker-containerized deployment pipeline.",
      url: "",
      github: "https://github.com/saptarshiboni/taskflow"
    }
  ],
  experience: [],
  certifications: [],
  achievements: [],
  additional: {
    languages: [],
    volunteering: [],
    leadership: [],
    publications: [],
    interests: []
  }
};
