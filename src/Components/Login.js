import React from "react";
import LoginForm from "./LoginComponent"; // Import the Login form component
import "../App.css";

const Login = () => {
    const loginStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f7f7f7",
    };

    return (
        <div style={loginStyle}>
            <div className="login-container">
                <h1>Welcome to CIRMS</h1>
                <p>Please log in to access the system.</p>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
