import React, { useState } from "react";
import SignIn from "./signIn";

function Signup() {
  const [isSignInOpen, setSignInOpen] = useState(true);

  const handleSignInOpen = () => {
    setSignInOpen(true);
  };

  // const handleSignInClose = () => {
  //   setSignInOpen(false);
  // };
  const token = localStorage.getItem("token");
  const handleSignInClose = () => {
    if (token) {
      setSignInOpen(false);
    }
  };

  return (
    <div>
      {isSignInOpen && (
        <SignIn open={isSignInOpen} handleClose={handleSignInClose} />
      )}
    </div>
  );
}

export default Signup;
