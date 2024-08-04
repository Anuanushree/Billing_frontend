import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignIn({ Base_url }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("Starting sign-in process");

    try {
      const user = { email, password };
      const startTime = performance.now();
      console.log("Sending request to server");

      const response = await axios.post(`${Base_url}/user/signin`, user);
      console.log(response.data);
      const endTime = performance.now();
      console.log(`Received response in ${endTime - startTime} ms`);

      if (response.data.error) {
        setError(response.data.error);
        console.log(`Error received from server: ${response.data.error}`);
      } else {
        const { token, id, Admin } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("id", id);

        if (token) {
          navigate(Admin ? "/inward" : "/exceldata");
        }
      }
    } catch (error) {
      console.error("Error signing in user:", error);
      setError("An error occurred during sign-in. Please try again.");
    } finally {
      setLoading(false);
      console.log("Sign-in process ended");
    }
  };

  const togglePasswordVisibility = () => {
    const input = document.getElementById("passwordInput");
    input.type = input.type === "password" ? "text" : "password";
  };

  return (
    <div className="login-body">
      <div className="container login-container">
        <div className="d-flex justify-content-center h-100">
          <div className="card login-card">
            <div className="card-header login-card-header">
              <h3>Sign In</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSignIn}>
                <div className="input-group form-group">
                  <div className="input-group-prepend login-input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    className="form-control login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend login-input-group">
                    <span className="input-group-text">
                      <i className="fas fa-key"></i>
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    id="passwordInput"
                    required
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend p-3"></div>
                  <input
                    type="checkbox"
                    className="input-group-text"
                    onClick={togglePasswordVisibility}
                  />
                  Show Password
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn float-right login_btn"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  {error && <p className="error">Message: {error}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
