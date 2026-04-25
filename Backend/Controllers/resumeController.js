const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require('pdf-parse');

const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ reply: "No file uploaded." });
        }

        // Extract text from PDF
        const dataBuffer = req.file.buffer;
        const data = await pdf(dataBuffer);
        const resumeText = data.text;

        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-flash-latest",
            systemInstruction: "You are a professional Resume Auditor. Analyze the provided resume text and provide a constructive, expert review. Highlight strengths, weaknesses, and specific areas for improvement (e.g., impact statements, formatting, skill gaps). Keep it professional and actionable."
        });

        const prompt = `Please audit this resume:\n\n${resumeText}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.status(200).json({ 
            reply: `### Resume Audit Results\n\nI have analyzed your uploaded resume. here is my professional feedback:\n\n${responseText}` 
        });

    } catch (error) {
        console.error("Resume analysis error:", error);
        res.status(500).json({ reply: "Sorry, I couldn't analyze the PDF. Please make sure it's a valid text-based PDF." });
    }
};

module.exports = { analyzeResume };
