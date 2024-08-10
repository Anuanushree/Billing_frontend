import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Fade,
  Backdrop,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import ForgotPassword from "../password reset/ForgotPassword";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export default function SignIn({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //   const handleSignIn = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const user = { email, password };

  //     const response = await axios.post(${Base_url}/user/signin, user);
  //     console.log(response.data);
  //     if (response.data.error) {
  //       setError(response.data.error);
  //       console.log(`Error received from server: ${response.data.error}`);
  //     } else {
  //       const { token, id, Admin } = response.data;
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("id", id);
  //       console.log("Navigating to the next page");
  //       if (token) {
  //         navigate(Admin ? "/inward" : "/exceldata");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error signing in user:", error);
  //     setError("An error occurred during sign-in. Please try again.");
  //   } finally {
  //     setLoading(false);
  //     console.log("Sign-in process ended");
  //   }
  // };

  // const handleSignIn = async () => {
  //   if (!email || !password) {
  //     setError("Both fields are required.");
  //     return;
  //   }
  //   try {
  //     const user = { email, password };

  //     const response = await axios.post(`${Base_url}/user/signin`, user);
  //     if (response.data.message === "Login successfully") {
  //       const { token, id, Admin } = response.data;

  //       console.log(response.data);
  //       localStorage.setItem("userName", response.data.username);
  //       localStorage.setItem("token", value);
  //       localStorage.setItem("id", id);

  //       //       localStorage.setItem("id", id);
  //       //       console.log("Navigating to the next page");
  //       if (token) {
  //         navigate(Admin ? "/inward" : "/exceldata");
  //       }
  //       handleClose();
  //     } else {
  //       setError(response.data.message);
  //     }
  //   } catch (error) {
  //     console.log("Error :", error);
  //   }
  // };

  const navigate = useNavigate();
  const handleSignIn = async () => {
    console.log("btnt clicked");
    if (!email || !password) {
      setError("Both fields are required.");
      toast.error("Both fields are required.");
      return;
    }
// http://localhost:4000
    try {
      const user = { email, password };
      const response = await axios.post(
        `https://billing-backend-2.onrender.com/user/signin`,
        user
      );
      console.log(response.data);
      const { token, id, Admin, username } = response.data;

      if (token) {
        // Get the current time in milliseconds
        const currentTime = Date.now();

        // Set the token's validity duration (e.g., 1 hour)
        const tokenValidityDuration = 60 * 60 * 1000; // 1 hour in milliseconds

        // Calculate the expiration time
        const expiresIn = currentTime + tokenValidityDuration;

        // Save the token and expiration time in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("expiresIn", expiresIn.toString());
        localStorage.setItem("id", id);
        localStorage.setItem("Admin", Admin.toString());
        localStorage.setItem("userName", username);

        // Navigate to the correct page based on user role
        navigate(Admin ? "/inward" : "/exceldata");
        handleClose();
        toast.success("Login successful!");
      } else {
        setError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.log("Error:", error);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleClose();
          }
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        style={{ backdropFilter: "blur(5px)", border: "none" }}
        slotProps={{
          backdrop: {
            timeout: 500,
            pointerEvents: "none",
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Sign In
            </Typography>
            <Box>
              <Typography variant="body1">E-mail</Typography>
              <TextField
                InputProps={{ sx: { textAlign: "center" } }}
                placeholder="Enter registered E-mail id"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Box>
              <Typography variant="body1">Password</Typography>
              <TextField
                InputProps={{ sx: { textAlign: "center" } }}
                placeholder="Enter password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                fullWidth
                required
              />
            </Box>
            <Box
              mt={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: "256px",
                  height: "31px",
                  justifyContent: "center",
                }}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <p>{error}</p>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
