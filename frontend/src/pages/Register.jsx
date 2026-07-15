
import { useState } from "react";
import api from "../services/api";
import { Link,useNavigate } from "react-router-dom";



function Register()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const handleRegister=async (e)=>{
        e.preventDefault();

        try{
            res=await api.post("/user/register",{
                name,
                email,
                password,
                phone,
            });
            alert("Account created successfully!");
            navigate("/dashboard");

        }
        
        catch(err)
        {
            alert(err.response?.data?.massege || "Registration failed");
        }
        
    }
    
    return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>

        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Phone</label>
          <br />
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Create Account
        </button>

      </form>

      <p>
        Already have an account?
        <Link to="/"> Login</Link>
      </p>
    </div>
  );
}
export default Register; 