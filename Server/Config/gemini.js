// const Gemini_Url = "https://generativelanguage.googleapis.com/v1beta/interactions"

// export const generateGeminiResponse = async ({
//     prompt,
//     apikey,
//     user
// }
// ) => {
//     try {
//         if (!apikey) {
//             throw new Error("Gemini API Key missing")
//         }

//         const response = await fetch(`${Gemini_Url}?key=${apikey}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                contents:[
//                 {
//                     parts: [
//                         {
//                             text: prompt

//                         }
//                     ]
//                 }
//                ]
//             })
//     }
//         )

//         if(!response.ok){
//             if(response.status === 400 || response.status === 401){
//                 user.geminiStatus = "invalid";
//                 await user.save();
//             }
//             if(response.status===429){
//                 user.geminiStatus = "quota_exceeded";
//                 await user.save();
//             }

//             const err = await response.text();
//             throw new Error(err);
//         }

//         user.geminiStatus = "active";

//         await user.save();
//         const data = await response.json()

//         const text = data.candidates?.[0]
//         ?.content?.parts?.[0]
//         ?.text;

//         if(!text){
//             throw new Error(
//                 "No text returned from Gemini"
//             );
//         }
//         return text.trim();
//     }catch (error) {
//         console.error(
//             "Gemini Fetch Error:",
//             error.message
//         );
//         throw new Error(
//             "Gemini API fetch failed"
//         );

// }
// }


const Gemini_Url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

export const generateGeminiResponse = async ({
    prompt,
    apikey,
    user
}) => {
    try {
        if (!apikey) {
            throw new Error("Gemini API Key missing");
        }

        const response = await fetch(Gemini_Url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apikey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 256,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();

            console.log("Gemini API Status:", response.status);
            console.log("Gemini API Error:", err);

            if (response.status === 400 || response.status === 401 || response.status === 403) {
                user.geminiStatus = "invalid";
                await user.save();
            }

            if (response.status === 429) {
                user.geminiStatus = "quota_exceeded";
                await user.save();
            }

            throw new Error(err);
        }

        const data = await response.json();

        const candidate = data.candidates?.[0];

        console.log("Gemini Finish Reason:", candidate?.finishReason);

        const text = candidate?.content?.parts
            ?.map(part => part.text || "")
            .join(" ")
            .trim();

        if (!text) {
            throw new Error("No text returned from Gemini");
        }

        user.geminiStatus = "active";
        await user.save();

        return text.trim();

    } catch (error) {
        console.error("Gemini Fetch Error:", error.message);
        throw error;
    }
};
