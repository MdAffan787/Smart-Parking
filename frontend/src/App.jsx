 import { Routes, Route } from "react-router-dom";
 
 
 import Login from "./pages/Login";
 import Register from "./pages/register";
import DashBoard from "./pages/dashbord";
import ParkingSpots from "./pages/ParkingSpots";
import Booking from "./pages/Booking";
import CreateSpot from "./pages/CreateSpot";
import History from "./pages/History";
import Logout from "./pages/Logout";
import MySpot from "./pages/MySpot";
import Profile from "./pages/Profile";
import AiAssistant from "./pages/AiAssistant";

 
 
 function App()
 {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard/>} />
        <Route path="/parkingSpots" element={<ParkingSpots/>}/>
        <Route path="/booking/:id" element={<Booking/>}/>
        <Route path="createSpot" element={<CreateSpot/>}/>
        <Route path="/history" element={<History />} />
        <Route path="logout" element={<Logout/>}/>
        <Route path="mySpot" element={<MySpot/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="/assistant" element={<AiAssistant />}/>



      </Routes>)
}
    export default App;