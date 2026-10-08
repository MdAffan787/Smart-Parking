import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

  const [spots, setSpots] = useState([]);

  useEffect(() => {

    async function fetchSpots() 
    {

        try {
            const res = await api.get("/spot/owner");
            console.log(res.data);
            setSpots(res.data.spots);

        } 
        catch (err) {
    console.log("ERROR:", err);

    if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
    } else {
        console.log("No response from server");
    }
}

    }


    fetchSpots();

}, []);


  const toggleStatus = async (spot) => {
    try {

        const res = await api.patch(`/spot/${spot._id}`, {
            isActive: !spot.isActive
        });

        setSpots(
            spots.map((s) =>
                s._id === spot._id
                    ? { ...s, isActive: !s.isActive }
                    : s
            )
        );

    } catch (err) {
        console.log(err);
    }
};


  return (
    <div>
      <h1>Smart Parking Dashboard</h1>

      <br />

      <Link to="/parkingSpots">
        <button>🚗 Find Parking</button>
      </Link>

      <br /><br />

      <Link to="/createSpot">
        <button>➕ Create Parking Spot</button>
      </Link>

      <br /><br />

     

      <Link to="/history">
        <button>📖 Booking History</button>
      </Link>


       <br /><br />

      <Link to="/assistant">
    <button>
        🤖 AI Assistant
    </button>
</Link>
<br /><br />



      <div>
        <h2>My Parking Spots</h2>

{spots.map((spot) => (

    <div
        key={spot._id}
        style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px"
        }}
    >

        <h3>{spot.area}</h3>

        <p>{spot.landmark}</p>

        <p>₹ {spot.pricePerHr} / hour</p>

        <p>
            {spot.isActive ? "🟢 Active" : "🔴 Inactive"}
        </p>

        <button
            onClick={() => toggleStatus(spot)}
        >
            {spot.isActive ? "Deactivate" : "Activate"}
        </button>

    </div>

))}
      </div>
    </div>
  );
}

export default Dashboard;