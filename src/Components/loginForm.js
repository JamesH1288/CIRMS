import React, { useState } from "react"; // Import React and hooks
import '../App.css';
import { useHistory } from "react-router-dom"; // For navigation

const homeStyle = {
    backgroundColor: 'black', 
    height: '100vh',
    margin: 0,
    padding: 0,
  };

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // useHistory for navigation after login
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message before submission

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                alert("Login successful!");
                // Store token in localStorage
                localStorage.setItem("token", data.accessToken);
                // Redirect to Home page
                history.push("/Home");
            } else {
                // Handle login errors
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            // Handle network or unexpected errors
            setError("An error occurred. Please try again later.");
        }
    };

    return (

        <div style={homeStyle}> 
            <div className="Home-Header">
                <h1>Cybersecurity Incident Reporting Management System</h1>
            </div>

        <div className="main">


                <div style={{ marginTop: "30px", maxWidth: "500px", margin: "0 auto"}}>
                    <h2 className="LoginHeaderText-Stying">Login</h2>
                    <hr className="white-thin-line"></hr>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "30px" }}>
                            <label className="LoginText-Stying" style={{ display: "block", marginBottom: "15px" }}>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                            />
                        </div>
                        <div style={{ marginBottom: "30px" }}>
                            <label className="LoginText-Stying" style={{ display: "block", marginBottom: "15px" }}>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                            />
                        </div>
                        <hr className="white-thin-line"></hr>
                        <button type="submit" className="LoginSubmitButton-Styling">
                            Login
                        </button>
                    </form>
                </div>
        </div>
        </div>
    );
};

export default LoginForm;
