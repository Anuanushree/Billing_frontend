import React, { useState } from "react";
import axios from "axios";

function SignUp({ Base_url }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const user = {
        username,
        email,
        password,
      };
      const response = await axios.post(
        `${Base_url}/user/signup`,
        user
      );
      console.log(response.data);
      seterror(response.data.error);
    } catch (error) {
      console.log("Error in adding user :", error);
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
              <h3>Sign Up</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSignUp}>
                <div className="input-group form-group">
                  <div className="input-group-prepend login-input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control login-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    required
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend login-input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                  <input
                    type="mail"
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
                    id="myInput"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    required
                  />
                </div>
                <div class="input-group form-group">
                  <div className="input-group-prepend "></div>
                  <input
                    type="checkbox"
                    className="input-group-text text-warning"
                    onClick={myFunction}
                  />
                  Show password
                </div>

                <div class="form-group">
                  <button type="submit" className="btn float-right login_btn">
                    sign up
                  </button>
                  <p className="error">Message:{error}</p>
                </div>
              </form>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-center links">
                Already have an account?<a href="/">Sign In</a>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
