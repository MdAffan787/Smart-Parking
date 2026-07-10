const { getParkingData, recommendSpot } = require("../services/geminiService");
const Spot = require("../models/spot");

module.exports.searchParking=async(req,res)=>{
    try{
        const prompt = req.body?.prompt;

if (!prompt) {
    return res.status(400).json({
        success: false,
        message: "Prompt is required"
    });
}
        const result=await getParkingData(prompt);
        const filters = JSON.parse(result);
        const query={};
      

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

const userPrompt = `
User Request:
${prompt}

Available Parking Spots:
${JSON.stringify(spots)}

Recommend the single best parking spot.
Explain why in 2-3 sentences.
`;
const recommendation = await recommendSpot(userPrompt);
return res.json({
    success: true,
    total: spots.length,
    recommendation,
    spots
});

    }
    catch(err)
    {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        error: err.stack
        });
    }
}