require('dotenv').config();
const mongoose = require('mongoose');
const Leadership = require('./Models/Leadership');
const TechnicalResource = require('./Models/TechnicalResource');
const { Quiz } = require('./Models/Quiz');

const MONGODB_URI = process.env.MONGODB_URI;

// ============ MORE LEADERSHIP PROGRAMS ============
const leadershipData = [
  {
    title: "Public Speaking and Presentation Mastery",
    category: "Communication",
    description: "Overcome stage fright and become a confident public speaker. Learn techniques used by TED speakers including body language, vocal variety, storytelling structure, and audience engagement methods.",
    instructor: "Chris Anderson",
    duration: "5 hours 15 minutes",
    level: "Beginner",
    videos: [
      { title: "TED Talk - How to Speak So People Listen", url: "https://www.youtube.com/watch?v=eIho2S0ZahI" },
      { title: "Body Language Secrets for Presentations", url: "https://www.youtube.com/watch?v=cFLjudWTuGQ" },
      { title: "Structuring a Powerful Presentation", url: "https://www.youtube.com/watch?v=MnIPpUiTcRc" }
    ],
    isActive: true
  },
  {
    title: "Conflict Resolution and Negotiation Skills",
    category: "Soft Skills",
    description: "Master the art of resolving workplace conflicts and negotiating win-win outcomes. Covers mediation techniques, active listening in disputes, principled negotiation, and de-escalation strategies.",
    instructor: "William Ury",
    duration: "4 hours 45 minutes",
    level: "Intermediate",
    videos: [
      { title: "The Power of Listening in Negotiation", url: "https://www.youtube.com/watch?v=saXfavo1OQo" },
      { title: "Getting to Yes - Negotiation Principles", url: "https://www.youtube.com/watch?v=RfTalFEeKKE" },
      { title: "Conflict Resolution Strategies That Work", url: "https://www.youtube.com/watch?v=KY5TWVz5ZDU" }
    ],
    isActive: true
  },
  {
    title: "Innovation and Creative Thinking for Leaders",
    category: "Problem Solving",
    description: "Unlock creative problem-solving skills and drive innovation within your team. Covers lateral thinking, brainstorming frameworks, mind mapping, SCAMPER technique, and fostering a culture of innovation.",
    instructor: "Dr. Adam Grant",
    duration: "3 hours 30 minutes",
    level: "Advanced",
    videos: [
      { title: "How to Think Creatively", url: "https://www.youtube.com/watch?v=9TskeE43Q1M" },
      { title: "Innovation Framework for Teams", url: "https://www.youtube.com/watch?v=Mtjatz9r-Vc" },
      { title: "Design Thinking for Innovation", url: "https://www.youtube.com/watch?v=0V5BwTrQOCs" }
    ],
    isActive: true
  },
  {
    title: "Time Management and Productivity Hacks",
    category: "Soft Skills",
    description: "Learn battle-tested productivity strategies from top performers. Covers the Eisenhower Matrix, time blocking, deep work principles, Pareto principle, and eliminating common productivity killers.",
    instructor: "Ali Abdaal",
    duration: "4 hours",
    level: "Beginner",
    videos: [
      { title: "The Eisenhower Matrix Explained", url: "https://www.youtube.com/watch?v=tT89OZ7TNwc" },
      { title: "Deep Work - How to Focus Intensely", url: "https://www.youtube.com/watch?v=ZD7dXfdDPfg" },
      { title: "Morning Routine for Maximum Productivity", url: "https://www.youtube.com/watch?v=A2sS00egAzg" }
    ],
    isActive: true
  },
  {
    title: "Cross-Cultural Leadership in Global Teams",
    category: "Team Management",
    description: "Navigate the challenges of leading diverse, multicultural teams. Learn about cultural dimensions, inclusive leadership styles, overcoming language barriers, and leveraging diversity for innovation.",
    instructor: "Erin Meyer",
    duration: "5 hours 30 minutes",
    level: "Advanced",
    videos: [
      { title: "Leading Across Cultures", url: "https://www.youtube.com/watch?v=zQvqDv4vbEg" },
      { title: "The Culture Map - How to Lead Global Teams", url: "https://www.youtube.com/watch?v=MJR-EgHTL1E" },
      { title: "Inclusive Leadership Strategies", url: "https://www.youtube.com/watch?v=v0CLUH-bm18" }
    ],
    isActive: true
  },
  {
    title: "Decision Making Under Pressure",
    category: "Leadership",
    description: "Develop a framework for making sound decisions under uncertainty and time constraints. Covers cognitive biases, decision matrices, risk assessment, and rapid decision-making models used by military and business leaders.",
    instructor: "Dr. Daniel Kahneman",
    duration: "4 hours 20 minutes",
    level: "Intermediate",
    videos: [
      { title: "Thinking Fast and Slow - Key Lessons", url: "https://www.youtube.com/watch?v=uqXVAo7dVRU" },
      { title: "How to Make Better Decisions", url: "https://www.youtube.com/watch?v=d7Jnmi2BkS0" },
      { title: "Overcoming Cognitive Biases", url: "https://www.youtube.com/watch?v=wEwGBIr_RIw" }
    ],
    isActive: true
  }
];

// ============ MORE TECHNICAL RESOURCES ============
const technicalData = [
  {
    title: "Node.js and Express Backend Development",
    category: "Web Development",
    description: "Build scalable server-side applications with Node.js and Express. Covers RESTful API design, middleware, authentication with JWT, error handling, and deploying to production.",
    instructor: "Traversy Media",
    duration: "9 hours",
    level: "Intermediate",
    videos: [
      { title: "Node.js Crash Course", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4" },
      { title: "Express.js Full Tutorial", url: "https://www.youtube.com/watch?v=SccSCuHhOw0" },
      { title: "JWT Authentication Tutorial", url: "https://www.youtube.com/watch?v=mbsmsi7l3r4" }
    ],
    tags: ["Node.js", "Express", "Backend", "API"],
    isActive: true
  },
  {
    title: "Git and GitHub for Professional Developers",
    category: "Programming",
    description: "Master version control with Git and collaboration with GitHub. Covers branching strategies, pull requests, merge conflicts, Git workflows, and team collaboration best practices.",
    instructor: "Fireship",
    duration: "4 hours",
    level: "Beginner",
    videos: [
      { title: "Git Explained in 100 Seconds", url: "https://www.youtube.com/watch?v=hwP7WQkmECE" },
      { title: "Git Branching and Merging Tutorial", url: "https://www.youtube.com/watch?v=Q1kHG842HoI" },
      { title: "GitHub Pull Request Workflow", url: "https://www.youtube.com/watch?v=8lGpZkjnkt4" }
    ],
    tags: ["Git", "GitHub", "Version Control"],
    isActive: true
  },
  {
    title: "Flutter Mobile App Development",
    category: "Mobile Development",
    description: "Build beautiful cross-platform mobile applications with Flutter and Dart. Covers widgets, state management, navigation, API integration, and publishing to Google Play and App Store.",
    instructor: "The Net Ninja",
    duration: "11 hours",
    level: "Intermediate",
    videos: [
      { title: "Flutter Course for Beginners", url: "https://www.youtube.com/watch?v=1ukSR1GRtMU" },
      { title: "Flutter State Management Guide", url: "https://www.youtube.com/watch?v=3tm-R7ymwhc" },
      { title: "Building a Complete Flutter App", url: "https://www.youtube.com/watch?v=VPvVD8t02U8" }
    ],
    tags: ["Flutter", "Dart", "Mobile", "Cross-platform"],
    isActive: true
  },
  {
    title: "Cybersecurity Essentials for Developers",
    category: "Cybersecurity",
    description: "Understand common security vulnerabilities and how to prevent them. Covers OWASP Top 10, SQL injection, XSS, CSRF, secure authentication patterns, and security testing tools.",
    instructor: "NetworkChuck",
    duration: "6 hours 30 minutes",
    level: "Intermediate",
    videos: [
      { title: "OWASP Top 10 Explained", url: "https://www.youtube.com/watch?v=wq8uxAjLoZE" },
      { title: "Web Security for Developers", url: "https://www.youtube.com/watch?v=WlmKwIe9z1Q" },
      { title: "Ethical Hacking Full Course", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE" }
    ],
    tags: ["Security", "OWASP", "Ethical Hacking"],
    isActive: true
  },
  {
    title: "Docker and Kubernetes for Beginners",
    category: "Cloud & DevOps",
    description: "Learn containerization with Docker and orchestration with Kubernetes. Covers creating Dockerfiles, Docker Compose, Kubernetes pods, deployments, services, and CI/CD pipelines.",
    instructor: "TechWorld with Nana",
    duration: "8 hours",
    level: "Intermediate",
    videos: [
      { title: "Docker Tutorial for Beginners", url: "https://www.youtube.com/watch?v=3c-iBn73dDE" },
      { title: "Kubernetes Explained Simply", url: "https://www.youtube.com/watch?v=s_o8dwzRlu4" },
      { title: "Docker Compose Full Tutorial", url: "https://www.youtube.com/watch?v=HG6yIjZapSA" }
    ],
    tags: ["Docker", "Kubernetes", "DevOps", "Containers"],
    isActive: true
  },
  {
    title: "TypeScript for Modern Web Development",
    category: "Programming",
    description: "Level up your JavaScript skills with TypeScript. Covers types, interfaces, generics, decorators, and integrating TypeScript with React and Node.js for type-safe full-stack applications.",
    instructor: "Jack Herrington",
    duration: "7 hours",
    level: "Intermediate",
    videos: [
      { title: "TypeScript Full Course", url: "https://www.youtube.com/watch?v=BwuLxPH8IDs" },
      { title: "TypeScript with React Tutorial", url: "https://www.youtube.com/watch?v=jrKcJxF0lAU" },
      { title: "Advanced TypeScript Patterns", url: "https://www.youtube.com/watch?v=F5TDeFhx_CM" }
    ],
    tags: ["TypeScript", "JavaScript", "Type Safety"],
    isActive: true
  },
  {
    title: "SQL and Relational Database Design",
    category: "Database",
    description: "Master SQL queries and relational database design principles. Covers normalization, joins, subqueries, indexing, stored procedures, and database performance optimization techniques.",
    instructor: "Mosh Hamedani",
    duration: "6 hours",
    level: "Beginner",
    videos: [
      { title: "SQL Tutorial for Beginners", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
      { title: "Database Design Full Course", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc" },
      { title: "Advanced SQL Queries", url: "https://www.youtube.com/watch?v=M-55BmjOuXY" }
    ],
    tags: ["SQL", "MySQL", "PostgreSQL", "Database Design"],
    isActive: true
  }
];

// ============ MORE QUIZZES ============
const quizData = [
  {
    title: "React.js Developer Assessment",
    category: "Technical",
    description: "Test your React.js proficiency including components, hooks, state management, lifecycle methods, and modern React patterns.",
    timeLimit: 15,
    passingScore: 60,
    questions: [
      {
        questionText: "What is the purpose of the useEffect hook in React?",
        options: ["To create new components", "To perform side effects in functional components", "To style components", "To create routes"],
        correctAnswer: 1,
        explanation: "useEffect lets you perform side effects like data fetching, subscriptions, or DOM manipulation in functional components."
      },
      {
        questionText: "What is the Virtual DOM in React?",
        options: ["A direct copy of the browser DOM", "A lightweight JavaScript representation of the actual DOM for efficient updates", "A CSS framework", "A testing library"],
        correctAnswer: 1,
        explanation: "The Virtual DOM is a lightweight JavaScript object that React uses to determine what changes need to be made to the actual DOM, minimizing expensive DOM operations."
      },
      {
        questionText: "Which hook is used for state management in functional components?",
        options: ["useEffect", "useContext", "useState", "useRef"],
        correctAnswer: 2,
        explanation: "useState is the primary hook for managing local state in functional React components."
      },
      {
        questionText: "What is JSX in React?",
        options: ["A separate programming language", "A syntax extension for JavaScript that looks like HTML", "A CSS preprocessor", "A database query language"],
        correctAnswer: 1,
        explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like markup inside JavaScript files."
      },
      {
        questionText: "What is the correct way to pass data from parent to child component?",
        options: ["Using global variables", "Through props", "Using localStorage", "Through CSS classes"],
        correctAnswer: 1,
        explanation: "Props (properties) are the primary mechanism for passing data from parent components to child components in React."
      }
    ],
    isActive: true
  },
  {
    title: "Communication Skills Evaluation",
    category: "Soft Skills",
    description: "Evaluate your ability to communicate effectively in professional settings, including written communication, verbal skills, and non-verbal cues.",
    timeLimit: 10,
    passingScore: 60,
    questions: [
      {
        questionText: "What is the most important element of effective written communication in emails?",
        options: ["Using complex vocabulary to sound professional", "Being clear, concise, and having a specific subject line", "Writing as much detail as possible", "Using lots of emojis"],
        correctAnswer: 1,
        explanation: "Effective business emails are clear, concise, and have descriptive subject lines that help recipients prioritize and understand the content."
      },
      {
        questionText: "What percentage of communication is non-verbal according to research?",
        options: ["About 10%", "About 30%", "About 55%", "About 93%"],
        correctAnswer: 3,
        explanation: "Albert Mehrabian found that up to 93% of communication is non-verbal, including body language (55%) and tone of voice (38%)."
      },
      {
        questionText: "What is the best practice when giving feedback to a colleague?",
        options: ["Only give negative feedback so they improve", "Use the SBI model - Situation, Behavior, Impact", "Give feedback publicly so others can learn", "Wait until the annual review"],
        correctAnswer: 1,
        explanation: "The SBI (Situation-Behavior-Impact) model provides a structured, objective way to deliver feedback that is specific and actionable."
      },
      {
        questionText: "In a meeting, what does paraphrasing show?",
        options: ["That you want to argue", "That you were not paying attention", "That you understand and are actively engaged", "That you want to change the topic"],
        correctAnswer: 2,
        explanation: "Paraphrasing demonstrates active listening and confirms your understanding, making the speaker feel heard and valued."
      },
      {
        questionText: "What is the elevator pitch?",
        options: ["A presentation given in an elevator", "A brief 30-60 second summary of who you are and what value you offer", "A technique to sell products door-to-door", "A speech given at the end of a meeting"],
        correctAnswer: 1,
        explanation: "An elevator pitch is a concise, memorable introduction that quickly communicates your professional identity and value proposition."
      }
    ],
    isActive: true
  },
  {
    title: "General IT Knowledge Assessment",
    category: "General Knowledge",
    description: "Test your overall understanding of information technology concepts including networking, operating systems, hardware, and emerging technologies.",
    timeLimit: 12,
    passingScore: 50,
    questions: [
      {
        questionText: "What does API stand for?",
        options: ["Advanced Programming Interface", "Application Programming Interface", "Automated Process Integration", "Applied Program Interaction"],
        correctAnswer: 1,
        explanation: "API stands for Application Programming Interface, which allows different software applications to communicate with each other."
      },
      {
        questionText: "Which protocol is used for secure web browsing?",
        options: ["HTTP", "FTP", "HTTPS", "SMTP"],
        correctAnswer: 2,
        explanation: "HTTPS (HyperText Transfer Protocol Secure) encrypts data between the browser and server using TLS/SSL for secure communication."
      },
      {
        questionText: "What is the purpose of DNS in networking?",
        options: ["To encrypt data", "To translate domain names to IP addresses", "To block malicious websites", "To speed up internet connection"],
        correctAnswer: 1,
        explanation: "DNS (Domain Name System) translates human-readable domain names like google.com into machine-readable IP addresses."
      },
      {
        questionText: "What is cloud computing?",
        options: ["Storing data on weather satellites", "Delivering computing services like servers, storage, and databases over the internet", "A type of encryption", "A programming language"],
        correctAnswer: 1,
        explanation: "Cloud computing is the delivery of computing services including servers, storage, databases, networking, software, and analytics over the internet."
      },
      {
        questionText: "What is DevOps?",
        options: ["A programming language", "A set of practices that combines software development and IT operations", "A type of database", "A cloud service provider"],
        correctAnswer: 1,
        explanation: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and deliver high-quality software continuously."
      }
    ],
    isActive: true
  },
  {
    title: "Career Planning Strategy Quiz",
    category: "Career Development",
    description: "Assess your understanding of long-term career planning, personal branding, skill development strategies, and navigating career transitions.",
    timeLimit: 10,
    passingScore: 60,
    questions: [
      {
        questionText: "What is personal branding in the context of career development?",
        options: ["Creating a logo for yourself", "Strategically presenting your unique skills, experiences, and values to stand out professionally", "Only having a LinkedIn profile", "Wearing branded clothing to work"],
        correctAnswer: 1,
        explanation: "Personal branding is the practice of strategically managing how you present yourself professionally to create opportunities aligned with your career goals."
      },
      {
        questionText: "What is the 70-20-10 model for professional development?",
        options: ["70% salary, 20% benefits, 10% bonuses", "70% on-the-job learning, 20% learning from others, 10% formal education", "70% technical skills, 20% soft skills, 10% leadership", "70% work, 20% networking, 10% rest"],
        correctAnswer: 1,
        explanation: "The 70-20-10 model suggests that 70% of learning comes from job-related experiences, 20% from interactions with others, and 10% from formal education."
      },
      {
        questionText: "What is an informational interview?",
        options: ["A formal job interview", "A casual conversation to learn about someone career path, industry, or role", "An interview for an internship", "A performance review meeting"],
        correctAnswer: 1,
        explanation: "An informational interview is a meeting where you learn about someone career journey and industry insights, often used for networking and career exploration."
      },
      {
        questionText: "When is the best time to start building your professional network?",
        options: ["Only when you need a job", "During your final year of study", "As early as possible and continuously throughout your career", "After you get your first job"],
        correctAnswer: 2,
        explanation: "Building your professional network should start early and be ongoing. The best time to network is before you need anything, as genuine relationships take time to develop."
      },
      {
        questionText: "What is a transferable skill?",
        options: ["A skill that can only be used in one job", "A skill learned in one context that can be applied to another role or industry", "A skill that is certified by a university", "A skill that expires after a certain time"],
        correctAnswer: 1,
        explanation: "Transferable skills like communication, problem-solving, and project management are applicable across different roles and industries."
      }
    ],
    isActive: true
  }
];

// ============ SEED FUNCTION ============
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    const leadershipResult = await Leadership.insertMany(leadershipData);
    console.log(`Inserted ${leadershipResult.length} MORE Leadership Programs`);

    const techResult = await TechnicalResource.insertMany(technicalData);
    console.log(`Inserted ${techResult.length} MORE Technical Resources`);

    const quizResult = await Quiz.insertMany(quizData);
    console.log(`Inserted ${quizResult.length} MORE Quizzes`);

    console.log("\nAll additional data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
