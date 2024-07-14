import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignIn({ Base_url }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState("");
  const [icon, setIcon] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      const user = {
        email,
        password,
      };
      const response = await axios.post(`${Base_url}/user/signin`, user);
      seterror(response.data.error);
      // const error = response.da
      console.log(response.data);
      const value = response.data.token;
      const id = response.data.id;
      const admin = response.data.Admin;
      console.log(admin);
      localStorage.setItem("token", value);
      localStorage.setItem("id", id);
      if (value) {
        if (admin === true) {
          navigate("/inward");
        } else {
          navigate("/exceldata");
        }
      }
    } catch (error) {
      console.log("Error in signin user :", error);
    }
  };

  const myFunction = () => {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
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
              <form>
                <div className="input-group form-group">
                  <div className="input-group-prepend login-input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    type="email"
                    className="form-control login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usermail id"
                    required
                  />
                </div>
                <div class="input-group form-group">
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
                    placeholder="password"
                    id="myInput"
                    required
                  />
                </div>
                <div class="input-group form-group">
                  <div className="input-group-prepend p-3">
                    {/* <span className="input-group-text"></span> */}
                  </div>
                  <input
                    type="checkbox"
                    className="input-group-text"
                    onClick={myFunction}
                  />
                  Show Password
                </div>
                <div class="form-group">
                  <button
                    type="submit"
                    onClick={handleSignIn}
                    className="btn float-right login_btn"
                  >
                    login
                  </button>
                  <p className="error">Message:{error}</p>
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
