import { useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import api from "../services/api";

import { MapContainer, 
  TileLayer,
Marker,
  useMapEvents, } from "react-leaflet";

function LocationMarker({ lat, lng, setLat, setLng,setArea }) {
    

    useMapEvents({
        async click(e) {
            setLat(e.latlng.lat);
            setLng(e.latlng.lng);
            const url =
`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`;

         const response = await fetch(url);


const data = await response.json();

const areaName =
    data.address.neighbourhood ||
    data.address.suburb ||
    data.address.city;
     if (areaName) {
        setArea(areaName);
    }
        }
    });

    if (!lat || !lng) return null;

    return <Marker position={[lat, lng]} />;
}

function CreateSpot() {
 const [area, setArea] = useState("");
    const [landmark, setLandMark] = useState("");
    const [pricePerHr, setPricePerHr] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const navigate = useNavigate();
async function handleCreateSpot(e)
 {
  e.preventDefault();
  try{


    const res=await api.post("/spot", {
            area,
            landmark,
            pricePerHr,
            isActive,
            lat,
            lng,
        });

        alert(res.data.message);
        console.log(res.data);
        navigate("/dashboard");
  }
 catch (err) {
    console.log(err);

    if (err.response) {
        console.log(err.response.data);
        alert(err.response.data.message || "Server Error");
    } else {
        alert(err.message);
    }
}
    
 };

 return (
    <>
    
      <h2>Create Spot</h2>

            <form onSubmit={handleCreateSpot}>

                <div>
                    <label>Area</label>
                    <br />

                    <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    />

                </div>

                <br />

                <div>

                    <label>Landmark</label>
                    <br />

                    <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandMark(e.target.value)}
                    />

                </div>

                <br />

                <div>

                    <label>Price Per Hour</label>
                    <br />

                    <input
                        type="number"
                        value={pricePerHr}
                        onChange={(e) => setPricePerHr(e.target.value)}
                    />

                </div>

                <br />


                <div>

                    <label>

                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e)=>setIsActive(e.target.checked)}
                        />

                        Active Spot

                    </label>

                </div>

                <br />

                <button type="submit">

                    Create Spot

                </button>

            </form>


            <p>
    Back to the home Page
    <Link to="/dashboard"> Dash Board</Link>
</p>

<div style={{ height: "400px", marginTop: "20px" }}>

    <MapContainer
        center={[12.9716, 77.5946]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
    >

        <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
    lat={lat}
    lng={lng}
    setLat={setLat}
    setLng={setLng}
    setArea={setArea}
/>

    </MapContainer>

</div>

    </>
  )
}

export default CreateSpot;