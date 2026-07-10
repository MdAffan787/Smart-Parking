import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    try {
      const res = await axios.post(
        "http://localhost:3000/user/login",
        {
          email,
          password,
        },
        {
        withCredentials: true
        }
      );

      console.log(res.data);
      alert("Login Successful");
      navigate("/dashboard");

      
    } catch (err) {
      console.log(err);
      alert("Login Failed!");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;