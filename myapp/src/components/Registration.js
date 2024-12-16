import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';

const Registration = () => {
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regPassConfirm, setRegPassConfirm] = useState('');
    const [regResult, setRegResult] = useState(false);

    function Register() {
        if (regEmail.trim() && regPass.trim() && regPassConfirm.trim() && regPass === regPassConfirm) {
            fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8" },
                body: JSON.stringify({
                    email: regEmail.trim(),
                    password: regPass.trim(),
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.regresult) {
                    setRegResult(true); // Set registration successful flag
                    alert(data.message);  // Alert on successful registration
                }
            })
            .catch((e) => alert("Error:", e.message));
        } else {
            alert("Please ensure all fields are filled and passwords match.");
        }
    }
if(regResult){
    return <Login/>
}
    return (
        <div>
            <h1>Registration</h1>
            <label>Email</label>
            <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
            />
            <label>Password</label>
            <input
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
            />
            <label>Confirm Password</label>
            <input
                type="password"
                value={regPassConfirm}
                onChange={(e) => setRegPassConfirm(e.target.value)}
            />
            <button onClick={Register}>Register</button>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Registration;
