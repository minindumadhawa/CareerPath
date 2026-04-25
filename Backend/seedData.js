require('dotenv').config();
const mongoose = require('mongoose');
const Leadership = require('./Models/Leadership');
const TechnicalResource = require('./Models/TechnicalResource');
const { Quiz } = require('./Models/Quiz');

const MONGODB_URI = process.env.MONGODB_URI;

// ============ LEADERSHIP PROGRAMS ============
const leadershipData = [
  {
    title: "Effective Team Leadership Fundamentals",
    category: "Leadership",
    description: "Learn the core principles of leading teams effectively in modern workplaces. This program covers delegation, motivation, conflict resolution, and building trust within diverse teams.",
    instructor: "Dr. Sarah Mitchell",
    duration: "4 hours 30 minutes",
    level: "Beginner",
    videos: [
      { title: "Introduction to Team Leadership", url: "https://www.youtube.com/watch?v=bMAvUY4kCSk" },
      { title: "Building Trust in Teams", url: "https://www.youtube.com/watch?v=pVeq-0dIqpk" },
      { title: "Delegation and Empowerment", url: "https://www.youtube.com/watch?v=bGVe3wE6JBs" }
    ],
    isActive: true
  },
  {
    title: "Strategic Communication for Leaders",
    category: "Communication",
    description: "Master the art of communicating as a leader. Learn how to inspire through storytelling, deliver impactful presentations, handle difficult conversations, and communicate across cultures.",
    instructor: "Prof. James Anderson",
    duration: "3 hours 45 minutes",
    level: "Intermediate",
    videos: [
      { title: "The Power of Storytelling in Leadership", url: "https://www.youtube.com/watch?v=Nj-hdQMa3uA" },
      { title: "How to Speak With Confidence", url: "https://www.youtube.com/watch?v=a2MR5XbJtXU" },
      { title: "Handling Difficult Conversations", url: "https://www.youtube.com/watch?v=YMyofnBfolE" }
    ],
    isActive: true
  },
  {
    title: "Critical Thinking and Problem Solving",
    category: "Problem Solving",
    description: "Develop structured approaches to complex problem solving. Learn frameworks like root cause analysis, design thinking, and the 5 Whys technique to tackle challenges in any professional setting.",
    instructor: "Dr. Emily Chen",
    duration: "5 hours",
    level: "Intermediate",
    videos: [
      { title: "Introduction to Critical Thinking", url: "https://www.youtube.com/watch?v=dItUGF8GdTw" },
      { title: "Design Thinking Process Explained", url: "https://www.youtube.com/watch?v=_r0VX-aU_T8" },
      { title: "Root Cause Analysis Techniques", url: "https://www.youtube.com/watch?v=gfk0bRIfjpg" }
    ],
    isActive: true
  },
  {
    title: "Emotional Intelligence in the Workplace",
    category: "Soft Skills",
    description: "Understand how emotional intelligence impacts career success. This program covers self-awareness, empathy, social skills, and managing emotions under pressure to become a more effective professional.",
    instructor: "Dr. Rachel Foster",
    duration: "4 hours",
    level: "Beginner",
    videos: [
      { title: "What is Emotional Intelligence", url: "https://www.youtube.com/watch?v=Y7m9eNoB3NU" },
      { title: "Developing Self-Awareness", url: "https://www.youtube.com/watch?v=tGdsOXZpyWE" },
      { title: "Empathy in Professional Settings", url: "https://www.youtube.com/watch?v=UzPMMSKfKZQ" }
    ],
    isActive: true
  },
  {
    title: "Managing High-Performance Teams",
    category: "Team Management",
    description: "Learn advanced strategies for building and managing high-performing teams. Covers OKR frameworks, agile team structures, remote team management, and creating a culture of accountability and innovation.",
    instructor: "Michael Torres",
    duration: "6 hours",
    level: "Advanced",
    videos: [
      { title: "Building High-Performance Teams", url: "https://www.youtube.com/watch?v=hHIikHJV9fI" },
      { title: "OKR Framework Explained", url: "https://www.youtube.com/watch?v=EIcpFZ5rbGc" },
      { title: "Managing Remote Teams Effectively", url: "https://www.youtube.com/watch?v=x6fIseB7yeg" }
    ],
    isActive: true
  }
];

// ============ TECHNICAL RESOURCES ============
const technicalData = [
  {
    title: "JavaScript Mastery - From Basics to Advanced",
    category: "Programming",
    description: "A comprehensive guide to modern JavaScript including ES6 features, async programming, closures, prototypes, and real-world project patterns used by top tech companies.",
    instructor: "Maximilian Schwarzmuller",
    duration: "8 hours",
    level: "Beginner",
    videos: [
      { title: "JavaScript Fundamentals in 1 Hour", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
      { title: "ES6 Features Every Developer Must Know", url: "https://www.youtube.com/watch?v=nZ1DMMsyVyI" },
      { title: "Async JavaScript - Promises and Await", url: "https://www.youtube.com/watch?v=PoRJizFvM7s" }
    ],
    tags: ["JavaScript", "ES6", "Frontend"],
    isActive: true
  },
  {
    title: "React.js Complete Developer Guide",
    category: "Web Development",
    description: "Master React.js from scratch including Hooks, Context API, React Router, state management, and building production-ready applications with best practices.",
    instructor: "Academind by Maximilian",
    duration: "10 hours",
    level: "Intermediate",
    videos: [
      { title: "React JS Full Course for Beginners", url: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
      { title: "React Hooks Explained", url: "https://www.youtube.com/watch?v=TNhaISOUy6Q" },
      { title: "State Management with Context API", url: "https://www.youtube.com/watch?v=35lXWvCuM8o" }
    ],
    tags: ["React", "Hooks", "Frontend", "SPA"],
    isActive: true
  },
  {
    title: "MongoDB and NoSQL Database Essentials",
    category: "Database",
    description: "Learn MongoDB from database design to advanced queries. Covers CRUD operations, aggregation pipelines, indexing strategies, and integrating MongoDB with Node.js applications.",
    instructor: "Brad Traversy",
    duration: "6 hours",
    level: "Beginner",
    videos: [
      { title: "MongoDB Crash Course", url: "https://www.youtube.com/watch?v=-56x56UppqQ" },
      { title: "MongoDB Aggregation Framework", url: "https://www.youtube.com/watch?v=A3jvoE0jGdE" },
      { title: "Mongoose with Node.js Tutorial", url: "https://www.youtube.com/watch?v=DZBGEVgL2eE" }
    ],
    tags: ["MongoDB", "NoSQL", "Database", "Backend"],
    isActive: true
  },
  {
    title: "Python for Data Science and Machine Learning",
    category: "Data Science",
    description: "Start your data science journey with Python. Covers NumPy, Pandas, Matplotlib, Scikit-Learn, and hands-on projects in data visualization, regression, and classification.",
    instructor: "Jose Portilla",
    duration: "12 hours",
    level: "Intermediate",
    videos: [
      { title: "Python for Data Science Full Course", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI" },
      { title: "Pandas Tutorial for Data Analysis", url: "https://www.youtube.com/watch?v=vmEHCJofslg" },
      { title: "Machine Learning with Scikit-Learn", url: "https://www.youtube.com/watch?v=pqNCD_5r0IU" }
    ],
    tags: ["Python", "Data Science", "ML", "AI"],
    isActive: true
  },
  {
    title: "AWS Cloud Practitioner - Complete Guide",
    category: "Cloud & DevOps",
    description: "Prepare for the AWS Cloud Practitioner certification. Learn about EC2, S3, Lambda, IAM, VPC, and core AWS services with real-world architecture examples.",
    instructor: "Stephane Maarek",
    duration: "7 hours",
    level: "Beginner",
    videos: [
      { title: "AWS Cloud Practitioner Course", url: "https://www.youtube.com/watch?v=SOTamWNgDKc" },
      { title: "AWS EC2 and S3 Explained", url: "https://www.youtube.com/watch?v=iHX-jtKIVNA" },
      { title: "Serverless with AWS Lambda", url: "https://www.youtube.com/watch?v=97q30JjEq9Y" }
    ],
    tags: ["AWS", "Cloud", "DevOps", "Certification"],
    isActive: true
  },
  {
    title: "UI/UX Design Principles for Developers",
    category: "UI/UX Design",
    description: "Bridge the gap between design and development. Learn fundamental UI/UX principles, color theory, typography, wireframing with Figma, and creating user-centered designs.",
    instructor: "Gary Simon",
    duration: "5 hours",
    level: "Beginner",
    videos: [
      { title: "UI Design Fundamentals", url: "https://www.youtube.com/watch?v=tRpoI6vkqLs" },
      { title: "Figma Tutorial for Beginners", url: "https://www.youtube.com/watch?v=HZuk6Wkx_Eg" },
      { title: "Color Theory for Web Design", url: "https://www.youtube.com/watch?v=KMS3VwGh3HY" }
    ],
    tags: ["UI", "UX", "Figma", "Design"],
    isActive: true
  }
];

// ============ QUIZZES ============
const quizData = [
  {
    title: "JavaScript Fundamentals Quiz",
    category: "Technical",
    description: "Test your understanding of core JavaScript concepts including variables, functions, scope, and ES6 features.",
    timeLimit: 15,
    passingScore: 60,
    questions: [
      {
        questionText: "What is the difference between let and var in JavaScript?",
        options: ["let is block-scoped while var is function-scoped", "They are exactly the same", "var is block-scoped while let is function-scoped", "let cannot be reassigned"],
        correctAnswer: 0,
        explanation: "let is block-scoped, meaning it is only accessible within the block it is defined in, while var is function-scoped."
      },
      {
        questionText: "What does the spread operator (...) do in JavaScript?",
        options: ["Deletes elements from an array", "Expands an iterable into individual elements", "Creates a new function", "Compares two arrays"],
        correctAnswer: 1,
        explanation: "The spread operator expands an iterable (like an array) into individual elements, useful for copying arrays and merging objects."
      },
      {
        questionText: "What is a Promise in JavaScript?",
        options: ["A type of loop", "A guaranteed return value", "An object representing the eventual completion or failure of an async operation", "A way to declare variables"],
        correctAnswer: 2,
        explanation: "A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value."
      },
      {
        questionText: "Which array method creates a new array with elements that pass a test?",
        options: ["map()", "forEach()", "filter()", "reduce()"],
        correctAnswer: 2,
        explanation: "filter() creates a new array with all elements that pass the test implemented by the provided callback function."
      },
      {
        questionText: "What is a closure in JavaScript?",
        options: ["A way to close the browser", "A function that has access to variables from its outer scope even after the outer function has returned", "A method to end a loop", "A type of error handling"],
        correctAnswer: 1,
        explanation: "A closure is a function that retains access to its lexical scope even when the function is executed outside that scope."
      }
    ],
    isActive: true
  },
  {
    title: "Leadership Skills Assessment",
    category: "Leadership",
    description: "Evaluate your leadership capabilities including decision-making, team motivation, conflict resolution, and strategic thinking.",
    timeLimit: 10,
    passingScore: 70,
    questions: [
      {
        questionText: "What is the most effective approach when two team members have a conflict?",
        options: ["Ignore it and hope it resolves itself", "Take sides with the more experienced team member", "Facilitate a conversation to understand both perspectives and find common ground", "Immediately escalate to upper management"],
        correctAnswer: 2,
        explanation: "Effective leaders facilitate open dialogue to understand all perspectives and guide the team toward a mutually beneficial resolution."
      },
      {
        questionText: "Which leadership style involves making decisions without consulting the team?",
        options: ["Democratic", "Autocratic", "Laissez-faire", "Transformational"],
        correctAnswer: 1,
        explanation: "Autocratic leadership involves making decisions unilaterally without much input from team members."
      },
      {
        questionText: "What does SMART stand for in goal setting?",
        options: ["Simple, Manageable, Achievable, Realistic, Timely", "Specific, Measurable, Achievable, Relevant, Time-bound", "Strategic, Meaningful, Actionable, Reliable, Tracked", "Standard, Measured, Assigned, Reviewed, Tested"],
        correctAnswer: 1,
        explanation: "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound - a framework for effective goal setting."
      },
      {
        questionText: "What is the primary purpose of delegation in leadership?",
        options: ["To reduce your own workload", "To empower team members and develop their skills while achieving organizational goals", "To avoid responsibility", "To test if employees can handle pressure"],
        correctAnswer: 1,
        explanation: "Delegation empowers team members, develops their capabilities, and allows leaders to focus on strategic priorities."
      },
      {
        questionText: "Which of the following best describes servant leadership?",
        options: ["Leading by serving the needs of the team first", "Having servants carry out your commands", "Leading from the back without involvement", "Serving customers before employees"],
        correctAnswer: 0,
        explanation: "Servant leadership prioritizes the growth and well-being of team members, putting their needs first to build a stronger organization."
      }
    ],
    isActive: true
  },
  {
    title: "Career Development Essentials",
    category: "Career Development",
    description: "Test your knowledge on building a successful career including resume writing, networking, interview preparation, and professional growth strategies.",
    timeLimit: 12,
    passingScore: 60,
    questions: [
      {
        questionText: "What is the ideal length for an entry-level resume?",
        options: ["3 or more pages", "Exactly 2 pages", "One page", "Half a page"],
        correctAnswer: 2,
        explanation: "For entry-level positions, a concise one-page resume is ideal. It forces you to highlight only the most relevant and impactful information."
      },
      {
        questionText: "What does the STAR method help you with during an interview?",
        options: ["Calculating your salary expectations", "Structuring behavioral interview answers: Situation, Task, Action, Result", "Choosing the right outfit", "Researching the company"],
        correctAnswer: 1,
        explanation: "STAR stands for Situation, Task, Action, Result - a structured approach to answering behavioral interview questions effectively."
      },
      {
        questionText: "Which is the most effective networking strategy?",
        options: ["Only connecting with people when you need a job", "Building genuine relationships and offering value before asking for help", "Sending mass connection requests on LinkedIn", "Attending events but not following up"],
        correctAnswer: 1,
        explanation: "Effective networking is about building authentic relationships and providing mutual value, not just transactional connections."
      },
      {
        questionText: "What should you do within 24 hours after a job interview?",
        options: ["Call repeatedly to ask about the decision", "Send a thank-you email expressing appreciation and reiterating your interest", "Post about the interview on social media", "Nothing - wait for them to contact you"],
        correctAnswer: 1,
        explanation: "Sending a thoughtful thank-you email within 24 hours shows professionalism and keeps you top of mind with the interviewer."
      },
      {
        questionText: "What is the hidden job market?",
        options: ["Illegal job postings", "Jobs that are never publicly advertised and are filled through referrals and networking", "Remote work opportunities", "Government-classified positions"],
        correctAnswer: 1,
        explanation: "The hidden job market refers to positions filled through internal promotions, referrals, and networking rather than public job boards."
      }
    ],
    isActive: true
  },
  {
    title: "Soft Skills for the Modern Workplace",
    category: "Soft Skills",
    description: "Assess your understanding of critical soft skills including communication, teamwork, adaptability, and time management in professional environments.",
    timeLimit: 10,
    passingScore: 60,
    questions: [
      {
        questionText: "What is active listening?",
        options: ["Listening while doing other tasks", "Fully concentrating on the speaker, understanding their message, and responding thoughtfully", "Interrupting to share your own ideas", "Taking detailed notes during every conversation"],
        correctAnswer: 1,
        explanation: "Active listening involves fully focusing on the speaker, understanding the complete message, and providing thoughtful responses."
      },
      {
        questionText: "Which time management technique involves working in focused 25-minute intervals?",
        options: ["Eisenhower Matrix", "GTD (Getting Things Done)", "Pomodoro Technique", "Time blocking"],
        correctAnswer: 2,
        explanation: "The Pomodoro Technique uses 25-minute focused work sessions followed by 5-minute breaks to maintain productivity."
      },
      {
        questionText: "What is the best way to handle constructive criticism at work?",
        options: ["Become defensive and explain why you did it that way", "Listen carefully, ask clarifying questions, and use it as an opportunity to improve", "Ignore it completely", "Complain to colleagues about the feedback"],
        correctAnswer: 1,
        explanation: "Receiving constructive criticism gracefully demonstrates maturity and a growth mindset, both valued in professional settings."
      },
      {
        questionText: "What does adaptability in the workplace mean?",
        options: ["Changing your personality to please everyone", "Being willing and able to adjust to new conditions, technologies, and challenges", "Always agreeing with management", "Switching jobs frequently"],
        correctAnswer: 1,
        explanation: "Workplace adaptability means being flexible and open to change, learning new skills, and adjusting your approach when circumstances shift."
      },
      {
        questionText: "Which of the following demonstrates strong teamwork?",
        options: ["Completing all tasks independently without asking for help", "Volunteering to help colleagues, sharing credit, and communicating openly", "Only doing your assigned tasks and nothing more", "Competing with team members for recognition"],
        correctAnswer: 1,
        explanation: "Strong teamwork involves collaboration, open communication, shared credit, and supporting colleagues to achieve common goals."
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

    // Insert Leadership Programs
    const leadershipResult = await Leadership.insertMany(leadershipData);
    console.log(`Inserted ${leadershipResult.length} Leadership Programs`);

    // Insert Technical Resources
    const techResult = await TechnicalResource.insertMany(technicalData);
    console.log(`Inserted ${techResult.length} Technical Resources`);

    // Insert Quizzes
    const quizResult = await Quiz.insertMany(quizData);
    console.log(`Inserted ${quizResult.length} Quizzes`);

    console.log("\nAll sample data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
