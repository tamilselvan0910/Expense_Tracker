import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddExpenses from "./Addexpenses";

const Login = () => {
  const [useremail, setEmail] = useState("");
  const [userpass, setPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function Loginuser() {
    if (useremail.trim() && userpass.trim()) {
      fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify({
          email: useremail.trim(),
          password: userpass.trim(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setIsLoggedIn(true); // Set the user as logged in
          } else {
            alert("Enter Correct Email/Password");
          }
        });
    } else {
      alert("Please Enter Valid Email/Password");
    }
  }

  // If the user is logged in, show the AddExpenses component
  if (isLoggedIn) {
    return <AddExpenses />;
  }

  return (
    <div>
      <h1>Login</h1>
      <label>Email</label>
      <input
        type="email"
        value={useremail}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password</label>
      <input
        type="password" // Fixed type to password
        value={userpass}
        onChange={(e) => setPass(e.target.value)}
      />
      <button onClick={Loginuser}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
