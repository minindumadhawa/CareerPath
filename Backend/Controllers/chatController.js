const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMsg = message.toLowerCase();
        let responseText = "";

        if (lowerMsg.includes("resume")) {
            responseText = "Here are some top resume tips:\n1. Keep it to one page if you have less than 10 years of experience.\n2. Tailor your resume to the job description by using relevant keywords.\n3. Highlight your achievements with quantifiable results (e.g., 'Increased sales by 20%').\n4. Ensure it is free of grammatical errors and typos.\n5. Use a clean, professional format.";
        } else if (lowerMsg.includes("interview")) {
            responseText = "For interview preparation, remember these key points:\n1. Research the company thoroughly before the interview.\n2. Practice answering common behavioral questions using the STAR method (Situation, Task, Action, Result).\n3. Prepare a few thoughtful questions to ask the interviewer at the end.\n4. Dress professionally and appropriately for the company culture.\n5. Follow up with a polite thank-you email within 24 hours.";
        } else if (lowerMsg.includes("career") || lowerMsg.includes("path") || lowerMsg.includes("job")) {
             responseText = "When planning your career path, it's important to identify your core strengths and interests. Consider taking skill assessments, networking with professionals in fields you're curious about, and seeking internships or volunteer opportunities to gain practical experience. Continuous learning is key in any job market!";
        } else {
            responseText = "I'm your Career AI Assistant. I can help you with resume tips, interview preparation, and general career advice. What specific area would you like to focus on today?";
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
