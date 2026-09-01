export const DEMO_RESUME_DATA = {
  personal: {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 234-5678",
    location: "Seattle, WA",
    linkedin: "https://linkedin.com/in/alexjohnson-dev",
    github: "https://github.com/alexjohnson",
    portfolio: "https://alexjohnson.dev"
  },
  career: {
    goal: "Full-time Job",
    targetRole: "Full Stack Developer",
    careerLevel: "Entry Level"
  },
  education: [
    {
      id: "edu-1",
      qualification: "Bachelor's Degree",
      degree: "B.S. in Computer Science",
      field: "Computer Science & Engineering",
      institution: "University of Washington",
      startYear: "2021",
      endYear: "2025",
      score: "3.85 / 4.0 CGPA"
    }
  ],
  skills: [
    { name: "React", category: "Frontend", level: "Advanced" },
    { name: "JavaScript", category: "Programming Languages", level: "Advanced" },
    { name: "TypeScript", category: "Programming Languages", level: "Intermediate" },
    { name: "Python", category: "Programming Languages", level: "Intermediate" },
    { name: "Flask", category: "Backend", level: "Intermediate" },
    { name: "Node.js", category: "Backend", level: "Intermediate" },
    { name: "PostgreSQL", category: "Database", level: "Intermediate" },
    { name: "Tailwind CSS", category: "Frontend", level: "Advanced" },
    { name: "Docker", category: "Tools & DevOps", level: "Beginner" },
    { name: "Git", category: "Tools & DevOps", level: "Advanced" }
  ],
  projects: [
    {
      id: "proj-1",
      name: "AI Resume Builder",
      type: "Web Application",
      technologies: ["React", "Flask", "Tailwind CSS", "OpenAI API"],
      description: "I built a website where job seekers answer guided questions and AI generates formatted ATS resumes with live previews and PDF export.",
      url: "https://ai-resume-builder-demo.com",
      github: "https://github.com/alexjohnson/ai-resume-builder"
    },
    {
      id: "proj-2",
      name: "Cloud TaskFlow",
      type: "Web Application",
      technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
      description: "A collaborative Kanban board tool with real-time updates via WebSockets and automated team performance metrics.",
      url: "https://taskflow-app.io",
      github: "https://github.com/alexjohnson/taskflow"
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "InnovateTech Labs",
      jobTitle: "Software Engineering Intern",
      employmentType: "Internship",
      location: "Seattle, WA",
      startDate: "Jun 2024",
      endDate: "Sep 2024",
      currentlyWorking: false,
      responsibilities: "Worked with React and Node.js on customer dashboard. Fixed critical bugs and improved load speeds. Wrote unit tests and collaborated in daily Agile standups.",
      achievements: "Improved dashboard render speed by 28% and received recognition for highest pull request throughput among interns."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Cloud Practitioner",
      organization: "Amazon Web Services",
      date: "2024",
      url: "https://aws.amazon.com/verification"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      category: "Hackathon",
      title: "1st Place Winner — Pacific Northwest Hackathon 2024",
      description: "Built an AI-driven accessibility tool for visually impaired students in 36 hours competing against 45 teams."
    },
    {
      id: "ach-2",
      category: "Leadership",
      title: "President — University ACM Student Chapter",
      description: "Organized weekly tech talks, coding bootcamps, and career mentoring sessions for over 180 student members."
    }
  ],
  additional: {
    languages: ["English (Native)", "Spanish (Conversational)"],
    volunteering: ["Mentored 15+ underrepresented high school students in introductory Python programming."],
    leadership: ["President of ACM Student Chapter (2023-2024)"],
    publications: [],
    interests: ["Open-Source Software", "Cloud Architecture", "Competitive Programming"]
  }
};
