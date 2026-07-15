import { useEffect, useState } from "react";
import api from "../services/api";

function History() {

    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {

        try {

            const res = await api.get("/user/booking-history");

            setHistory(res.data.history);

        } catch (err) {

            console.log(err);

        }

    }

    return (

        <div style={{ padding: "20px" }}>

            <h2>My Booking History</h2>

            {history.length === 0 ? (

                <h3>No Bookings Found</h3>

            ) : (

                history.map((booking) => (

                    <div
                        key={booking._id}
                        style={{
                            border: "1px solid gray",
                            borderRadius: "10px",
                            padding: "15px",
                            marginBottom: "15px"
                        }}
                    >

                        <h3>{booking.spotId?.area}</h3>

                        <p>
                            <b>Landmark:</b>{" "}
                            {booking.spotId?.landmark}
                        </p>

                        <p>
                            <b>Price:</b> ₹
                            {booking.spotId?.pricePerHr}/hour
                        </p>

                        <p>
                            <b>Start:</b>{" "}
                            {new Date(
                                booking.startTime
                            ).toLocaleString()}
                        </p>

                        <p>
                            <b>End:</b>{" "}
                            {new Date(
                                booking.endTime
                            ).toLocaleString()}
                        </p>

                        <p>
                            <b>Status:</b>{" "}
                            {booking.status === "BOOKED" && (
                                <span style={{ color: "orange" }}>
                                    🟡 BOOKED
                                </span>
                            )}

                            {booking.status === "ACTIVE" && (
                                <span style={{ color: "blue" }}>
                                    🔵 ACTIVE
                                </span>
                            )}

                            {booking.status === "COMPLETED" && (
                                <span style={{ color: "green" }}>
                                    🟢 COMPLETED
                                </span>
                            )}

                            {booking.status === "CANCELLED" && (
                                <span style={{ color: "red" }}>
                                    🔴 CANCELLED
                                </span>
                            )}
                        </p>

                    </div>

                ))

            )}

        </div>

    );

}

export default History;