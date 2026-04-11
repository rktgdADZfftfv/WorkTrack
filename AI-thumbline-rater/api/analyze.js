export default async function handler(req, res) {
    // Sirf POST request allow karenge (Security ke liye)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    const { image, topic } = req.body;

    if (!image || !topic) {
        return res.status(400).json({ error: 'Image and topic are required' });
    }

    try {
        // Vercel se hamari chupi hui API key lenge
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: API key missing' });
        }

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // Gemini AI ko command (Prompt) denge
        const promptText = `You are an expert YouTube strategist. I am giving you a video thumbnail image and the video topic: "${topic}". Rate this thumbnail out of 10 based on how well it fits the topic, catches attention, and looks professional. Provide a short 2-sentence feedback. Return EXACTLY and ONLY a JSON object in this format without any markdown: {"score": 8, "feedback": "Your short feedback here."}`;

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptText },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: image
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();

        // Gemini ka answer nikalenge
        const textResponse = data.candidates[0].content.parts[0].text;

        // Agar Gemini ne text ke aaspas ```json lagaya hai toh use hata denge
        const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const resultData = JSON.parse(cleanedText);

        // Frontend ko final score aur feedback bhej denge
        return res.status(200).json({
            score: resultData.score,
            feedback: resultData.feedback
        });

    } catch (error) {
        console.error("AI Error:", error);
        return res.status(500).json({ error: 'AI failed to analyze the thumbnail. Try again.' });
    }
}