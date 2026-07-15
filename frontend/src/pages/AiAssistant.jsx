import { useState } from "react";
import api from "../services/api";

function AiAssistant() {

    const [prompt, setPrompt] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const askAI = async () => {

        if (!prompt.trim()) return;

        try {

            setLoading(true);

            const res = await api.post("/ai/search", {
                prompt
            });

            setResult(res.data);

        } catch (err) {

            console.log(err);

            alert("AI request failed");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div style={{ padding: "20px" }}>

            <h2>🤖 AI Parking Assistant</h2>

            <input
                type="text"
                placeholder="Find parking near KR Market under ₹100"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{
                    width: "400px",
                    padding: "10px"
                }}
            />

            <button
                onClick={askAI}
                style={{
                    marginLeft: "10px"
                }}
            >
                Ask AI
            </button>

            <hr />

            {loading && <h3>Thinking...</h3>}

            {result && (

                <div>

                    <h3>Recommendation</h3>

                    <p>{result.recommendation}</p>

                    <hr />

                    <h3>Available Spots</h3>

                    {

                        result.spots.map((spot) => (

                            <div
                                key={spot._id}
                                style={{
                                    border: "1px solid gray",
                                    padding: "15px",
                                    marginBottom: "10px"
                                }}
                            >

                                <h4>{spot.area}</h4>

                                <p>{spot.landmark}</p>

                                <p>

                                    ₹ {spot.pricePerHr}/hr

                                </p>

                            </div>

                        ))

                    }

                </div>

            )}

        </div>

    );

}

export default AiAssistant;