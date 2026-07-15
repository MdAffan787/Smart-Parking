const { getParkingData, recommendSpot } = require("../services/geminiService");

const Spot = require("../models/spot");

module.exports.searchParking = async (req, res) => {

    try {

        const prompt = req.body.prompt;

        if (!prompt) {

            return res.status(400).json({

                success: false,

                message: "Prompt is required"

            });

        }

        // Ask Gemini to extract filters
        const aiResponse = await getParkingData(prompt);

        const filters = JSON.parse(aiResponse);

        const query = {

            isActive: true

        };

        if (filters.area) {

            query.area = {

                $regex: filters.area,

                $options: "i"

            };

        }

        if (filters.maxPrice) {

            query.pricePerHr = {

                $lte: filters.maxPrice

            };

        }

        const spots = await Spot.find(query);

        if (spots.length === 0) {

            return res.json({

                success: true,

                recommendation: "No parking spots found.",

                spots: []

            });

        }

        // Only send useful fields to Gemini
        const simplifiedSpots = spots.map((spot) => ({

            id: spot._id,

            area: spot.area,

            landmark: spot.landmark,

            pricePerHr: spot.pricePerHr

        }));

        const recommendationPrompt = `
User Request:

${prompt}

Available Parking Spots:

${JSON.stringify(simplifiedSpots)}

Recommend ONLY ONE parking spot.
`;

        const recommendation = await recommendSpot(recommendationPrompt);

        return res.json({

            success: true,

            filters,

            total: spots.length,

            recommendation,

            spots: simplifiedSpots

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};