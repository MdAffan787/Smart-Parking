import axios from "axios";
import { useState,useEffect } from "react";


function DashBoard()
{
    const [spots, setSpots] = useState([]);
   useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/api/spots", {
          withCredentials: true,
        });

        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSpots();
  }, []);
    return <>
    <h1>Dash Board</h1>
    </>
}
export default DashBoard; 