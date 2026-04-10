const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMsg = message.toLowerCase();
        let responseText = "";

        if (lowerMsg.includes("resume") || lowerMsg.includes("cv") || lowerMsg.includes("cover letter")) {
            responseText = "📝 RESUME & CV TIPS:\n\n• Keep it to one page if you have less than 10 years of experience.\n• Tailor your resume to the job description by using relevant keywords.\n• Highlight achievements with quantifiable results (e.g., 'Increased sales by 20%').\n• Ensure it is free of grammatical errors and typos.\n• Use a clean, professional format.";
        } else if (lowerMsg.includes("interview")) {
            responseText = "🎯 INTERVIEW PREPARATION GUIDE:\n\n• Research the company thoroughly before the interview.\n• Practice answering behavioral questions using the STAR method (Situation, Task, Action, Result).\n• Prepare 2-3 thoughtful questions to ask the interviewer at the end.\n• Dress professionally and turn on your camera if it's virtual.\n• Always follow up with a polite thank-you email.";
        } else if (lowerMsg.includes("salary") || lowerMsg.includes("pay") || lowerMsg.includes("negotiat")) {
            responseText = "💰 SALARY NEGOTIATION STRATEGY:\n\n• Do early market research using sites like Glassdoor or PayScale.\n• Try not to share your expected salary first; let them make an offer.\n• Base your negotiation on your concrete skills and value, not personal needs.\n• Consider the whole package (bonuses, remote work options, equity).";
        } else if (lowerMsg.includes("internship") || lowerMsg.includes("intern") || lowerMsg.includes("apply")) {
            responseText = "🎓 FINDING INTERNSHIPS:\n\n• Complete your Student Profile right here on CareerPath to stand out.\n• Check our Internships page regularly for new AI-matched roles.\n• Reach out directly to recruiters on platforms like LinkedIn.\n• Don't wait to be perfect! Apply even if you meet only 70% of the job requirements.";
        } else if (lowerMsg.includes("skills") || lowerMsg.includes("technical") || lowerMsg.includes("learn") || lowerMsg.includes("course")) {
            responseText = "💻 SKILL DEVELOPMENT:\n\n• We offer comprehensive Technical Programs to boost your practical skills.\n• Practice consistently and build a portfolio of your own projects to show employers.\n• Focus on top industry tech stacks relevant to your field.\n• Try taking one of our Skill Assessments to benchmark your knowledge!";
        } else if (lowerMsg.includes("networking") || lowerMsg.includes("connect") || lowerMsg.includes("linkedin")) {
            responseText = "🤝 NETWORKING ADVICE:\n\n• LinkedIn is your best friend. Optimize your profile and post regularly.\n• Attend industry meetups, online webinars, and job fairs.\n• Reach out to alumni from your university for informational interviews.\n• Always add a personalized note when sending a connection request to someone new!";
        } else if (lowerMsg.includes("career") || lowerMsg.includes("path") || lowerMsg.includes("job") || lowerMsg.includes("future")) {
            responseText = "🚀 CAREER PLANNING:\n\nWhen planning your career trajectory, identify your core strengths and interests first. Consider taking our leadership or technical assessments, networking heavily, and seeking volunteer opportunities to gain practical experience. Continuous learning is the undisputed key to success!";
        } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey") || lowerMsg.includes("morning")) {
            responseText = "👋 Hello there! I'm CareerPath's AI Assistant.\n\nI can help you with:\n• Resume & CV improvements\n• Interview preparation\n• Finding internships\n• Salary negotiation\n• Networking\n\nWhat would you like to know today?";
        } else if (lowerMsg.includes("thank")) {
            responseText = "You're very welcome! 😊 \n\nI'm always here if you need more career advice or help navigating your professional journey. Best of luck today!";
        } else {
            responseText = "🤖 I'm your Career AI Assistant.\n\nI couldn't quite understand that, but I can provide detailed guidance on:\n• Resumes / CVs\n• Interviews\n• Internships\n• Salary negotiation\n• Networking\n\nCould you ask about one of these topics?";
        }

        // Simulate a slight delay to make it feel like a real AI processing
        setTimeout(() => {
            res.status(200).json({ reply: responseText });
        }, 1000);

    } catch (error) {
        console.error("Error generating chat response:", error);
        res.status(500).json({ reply: "An internal error occurred." });
    }
};

module.exports = { generateChatResponse };
