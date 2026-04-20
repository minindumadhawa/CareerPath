const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../Models/Chat");
const User = require("../Models/User");
const Internship = require("../Models/Internship");

const generateChatResponse = async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        let systemPrompt = `You are the Lead Career Strategist for "CareerPath". Your goal is to provide world-class, professional career guidance. 
            
            ADVICE GUIDELINES:
            1. PERSONA: Sound like a senior recruitment expert—supportive, knowledgeable, and highly professional.
            2. STRUCTURE: Use clear, structured formatting with bullet points and headers.
            3. ACTIONABLE: Every response should include a practical "Next Step".`;

        // 1. Fetch User Profile Context
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                const cvContext = `
                CURRENT USER CONTEXT (Auto-detected from their Profile):
                - Full Name: ${user.fullName || 'N/A'}
                - University: ${user.university || 'N/A'}
                - Tech Skills: ${user.technicalSkills?.join(', ') || 'None listed'}
                - Soft Skills: ${user.softSkills?.join(', ') || 'None listed'}
                - Summary: ${user.summary || 'N/A'}
                
                Please use this context to personalize your advice.
                `;
                systemPrompt += "\n\n" + cvContext;
            }
        }

        // 2. Fetch Relevant Internships for Context
        const keywords = message.split(' ').filter(word => word.length > 3);
        const relevantInternships = await Internship.find({
            $or: [
                { title: { $regex: keywords.join('|'), $options: 'i' } },
                { skills: { $in: keywords } }
            ],
            status: 'Active'
        }).limit(3);

        if (relevantInternships.length > 0) {
            const internshipContext = `
            RELEVANT OPPORTUNITIES ON CAREERPATH:
            ${relevantInternships.map(i => `- ${i.title} at ${i.location} (Required: ${i.skills.join(', ')})`).join('\n')}
            
            If the user asks about jobs or internships, mention these specific ones as great places to start.
            `;
            systemPrompt += "\n\n" + internshipContext;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(200).json({ reply: "API Key missing." });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        const result = await model.generateContent(message);
        const responseText = result.response.text();

        // 3. Save conversation
        if (userId) {
            await Chat.findOneAndUpdate(
                { userId },
                { $push: { messages: [
                    { sender: 'user', text: message },
                    { sender: 'bot', text: responseText }
                ] } },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("Error generating chat response:", error);
        res.status(500).json({ reply: "I'm having trouble connecting to my AI brain. Please try again later." });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const chat = await Chat.findOne({ userId });
        if (!chat) return res.status(200).json({ messages: [] });
        res.status(200).json({ messages: chat.messages });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

const generateMockResponse = (message, res) => {
    // ... basic mock logic ...
    res.status(200).json({ reply: "I am currently in mock mode. Please check your API key." });
};

module.exports = { generateChatResponse, getChatHistory };

