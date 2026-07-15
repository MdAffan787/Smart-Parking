import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function Booking() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleBooking = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post(`/booking/${id}`, {
                startTime,
                endTime
            });

            alert(res.data.message);
            navigate("/dashboard");

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message || "Booking Failed"
            );

        }

    };

    return (

        <div>

            <h2>Book Parking Spot</h2>

            <p>Spot ID: {id}</p>

            <form onSubmit={handleBooking}>

                <div>

                    <label>Start Time</label>

                    <br />

                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />

                </div>

                <br />

                <div>

                    <label>End Time</label>

                    <br />

                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />

                </div>

                <br />

                <button type="submit">

                    Confirm Booking

                </button>

            </form>

        </div>

    );

}

export default Booking;