// import { response } from "express";
import User from "../Models/user.models.js";
import { generateGeminiResponse } from "../Config/gemini.js";

export const getAssistantConfig = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-geminiApiKey")
        if (!user) {
            return res.status(404).json({ message: "failed to get user" })
        }
        return res.status(200).json({ message: "Assistant Config data", user })
    } catch (error) {
        return res.status(500).json({ message: `Assistant config failed ${error}` })
    }
}

export const askAssistant = async (req, res) => {
    try {
        const { message, userId } = req.body
        if (!message || !userId) {
            return res.status(400).json({ message: "Message and userId are required" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User is not found" })
        }
        if (!user.geminiApiKey) {
            return res.status(404).json({ message: "gemini api key is not added" })
        }
        if (user.plan === "free" && user.totalMessages >= user.requestLimit) {
            return res.status(400).json({ message: "Free limit reached" })
        }
        if (user.plan === "pro" && new Date(user.proExpiresAt) < new Date()) {
            user.plan = "free"
            await user.save()
            return res.status(400).json({ message: "Pro plan expired" })
        }

        const cleanMessage = message.toLowerCase()
        if (user.enableNavigation) {
            const navigationWords = [
                "open",
                "go",
                "start",
                "show",
                "navigate",
                "take me",
            ]
            const wantsNavigation = navigationWords.some((word) =>
                cleanMessage.startsWith(word));
            if (wantsNavigation) {
                const matchedPage = user.pages?.find((page) =>
                    page.keywords.some((keywords) =>
                        cleanMessage.includes(
                            keywords.toLowerCase()
                        )));

                if (matchedPage) {
                    if (
                        req.body.currentPath === matchedPage.path
                    ) {
                        return res.json({
                            success: true,
                            response:
                                `${matchedPage.name} already open`
                        })
                    }
                    return res.json({
                        success: true,
                        action: "navigate",
                        path: matchedPage.path,
                        response:
                            `Opening ${matchedPage.name}`,
                    });
                }
            }
        }

        const prompt = `
        You  are ${user.assistantName}.
        Business Name:
        ${user.businessName}
        Business Type:
        ${user.businessType}
        Business Description:
        ${user.businessDescription}
        Assistant Tone:
        ${user.tone}
        
       Rules:
- Give grammatically correct and meaningful responses.
- Use natural, conversational language.
- If the user speaks Hindi, respond in natural Hindi or Hinglish.
- If the user speaks English, respond in English.
- Never create incorrect or mixed-up Hindi words.
- Use correct Hindi grammar and sentence structure.
- Keep replies under 100 words.
- Always give complete sentences.
- Never stop in the middle of a sentence.
- Avoid unnecessary explanations.
- Keep responses suitable for voice playback.

        User Question:
        ${message}
        `;

        const aiResponse = await generateGeminiResponse({ prompt, apikey: user.geminiApiKey, user })

        if (user.plan === "free") {
            user.totalMessages += 1
            await user.save()
        }

        return res.json({
            success: true,
            aiResponse,
        });


    } catch (error) {
        console.error("ASK ASSISTANT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Assistant AI Error",
            error: error.message
        });
    }

}