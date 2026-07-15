const { GoogleGenAI } = require("@google/genai");

const parkingPrompt = require("../prompts/parkingPrompt");

const bookingPrompt = require("../prompts/bookingPrompt");

const ai = new GoogleGenAI({
    apiKey: process.env.Gemini_API
});

async function getParkingData(userPrompt) {

    try {

        const response = await ai.models.generateContent({

            model: "gemini-3.5-flash",

            contents: `
${parkingPrompt}

User Request:

${userPrompt}
`

        });

        return response.text;

    } catch (err) {

        console.log("Gemini Error:", err);

        throw err;

    }

}

async function recommendSpot(userPrompt) {

    try {

        const response = await ai.models.generateContent({

            model: "gemini-3.5-flash",

            contents: `
You are a parking recommendation assistant.

The user has already filtered parking spots.

Choose ONLY ONE best parking spot.

Consider:

- Area match
- Lowest price
- User request

Explain your recommendation in 2 short sentences.

If no parking spots exist, reply:

"No suitable parking spot found."

${userPrompt}
`

        });

        return response.text;

    } catch (err) {

        console.log("Gemini Error:", err);

        throw err;

    }

}

async function bookingSpot(userPrompt) {

    try {

        const response = await ai.models.generateContent({

            model: "gemini-3.5-flash",

            contents: `
${bookingPrompt}

User Request:

${userPrompt}
`

        });

        return response.text;

    } catch (err) {

        console.log("Gemini Error:", err);

        throw err;

    }

}

module.exports = {

    getParkingData,

    recommendSpot,

    bookingSpot

};