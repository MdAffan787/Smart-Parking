import { useState } from "react";
import api from "../services/api";
import { Link,useNavigate } from "react-router-dom";

function Login()
{
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin=async (e)=>{
      e.preventDefault();
      try{
        const res=await api.post("/user/login",{
          email:email,
          password:password,
        });
        navigate("/dashboard");

        } catch (err) {

            alert(err.response.data.massege);

        }

    
  }

  return (
    <>
    
      <h2>Login</h2>

            <form onSubmit={handleLogin}>

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

                    Login

                </button>

            </form>
            <p>
    Don't have an account?
    <Link to="/register"> Register</Link>
</p>

    </>
  )

}

export default Login;