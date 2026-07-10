 import { Routes, Route } from "react-router-dom";
 
 
 import Login from "./pages/Login";
 import Register from "./pages/register";
import DashBoard from "./pages/dashbord";

 
 
 function App()
 {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard/>} />
      </Routes>)
}
    export default App;