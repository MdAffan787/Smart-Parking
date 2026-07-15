import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function ParkingSpots() {

    const [spots, setSpots] = useState([]);

    useEffect(() => {
        fetchSpots();
    }, []);

    async function fetchSpots() {

        try {

            const res = await api.get("/spot");

            setSpots(res.data.spots);

        } catch (err) {

            console.log(err);

        }

    }

    return (

        <div>

            <h2>Available Parking Spots</h2>

            <MapContainer
                center={[12.9716, 77.5946]}
                zoom={13}
                style={{
                    height: "600px",
                    width: "100%"
                }}
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {spots.map((spot) => (

                    <Marker
                        key={spot._id}
                        position={[spot.lat, spot.lng]}
                    >

                        <Popup>

                            <h3>{spot.area}</h3>

                            <p>{spot.landmark}</p>

                            <p>
                                ₹ {spot.pricePerHr} / hour
                            </p>

                            {/* Status */}

                            {spot.status === "BOOKED" ? (

                                <div>

                                    <p style={{ color: "red" }}>
                                        🔴 Occupied
                                    </p>

                                    <p>

                                        Available After :

                                        {" "}

                                        {new Date(
                                            spot.availableAfter
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}

                                    </p>

                                </div>

                            ) : (

                                <div>

                                    <p style={{ color: "green" }}>
                                        🟢 Available
                                    </p>

                                    {spot.nextBooking ? (

                                        <p style={{ color: "orange" }}>

                                            Next Booking :

                                            {" "}

                                            {new Date(
                                                spot.nextBooking
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}

                                        </p>

                                    ) : (

                                        <p>
                                            No Upcoming Bookings
                                        </p>

                                    )}

                                    <Link to={`/booking/${spot._id}`}>
                                        <button>
                                            Book Now
                                        </button>
                                    </Link>

                                </div>

                            )}

                        </Popup>

                    </Marker>

                ))}

            </MapContainer>

        </div>

    );

}

export default ParkingSpots;