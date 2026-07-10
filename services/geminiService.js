const { GoogleGenAI } = require("@google/genai");
const parkingPrompt = require("../prompts/parkingPrompt");
const bookingPrompt=require("../prompts/bookingPrompt");


const ai = new GoogleGenAI({
    apiKey: process.env.Gemini_API,
});

async function getParkingData(userPrompt) {
    try {

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `${parkingPrompt}

User Query:
${userPrompt}`
        });

        return response.text;

    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function recommendSpot(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
    });

    return response.text;

}


async function bookingSpot(prompt)
{
     const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${bookingPrompt}

User:
${prompt}`
    });

    return response.text;
}

module.exports = {
    getParkingData,
    recommendSpot,
    bookingSpot,
};