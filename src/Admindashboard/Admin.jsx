import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard.jsx";
import axios from "axios";
import {
  CircularProgress,
  Snackbar,
  SnackbarContent,
  Button,
  TextField,
} from "@mui/material";

function Admin({ Base_url }) {
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState(""); // State to manage input field
  const [newUserName, setNewUserName] = useState(""); // State for new user name input
  const [newUserEmail, setNewUserEmail] = useState(""); // State for new user email input
  const [newUserId, setNewUserId] = useState(""); // State for new user ID input
  const [newUserPassword, setNewUserPassword] = useState(""); // State for new user password input
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [userId, setResetUserId] = useState(null); // State to track which user's password reset is being handled
  const [deleteUserId, setDeleteUserId] = useState(null); // State to store the userId to be deleted
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to manage Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to manage Snackbar message

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    getUser();
  }, []); // Empty dependency array to run effect only once

  const getUser = async () => {
    try {
      const response = await axios.get(`${Base_url}/user/list`);
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleReset = (userId) => {
    // Set the userId for which reset is initiated
    setResetUserId(userId);
  };

  const handleChange = (event) => {
    // Update the resetInput state as the user types
    setPassword(event.target.value);
  };

  const handleSave = async () => {
    try {
      if (!userId) {
        console.error("No user selected for password reset.");
        return;
      }
      // Make an API call to save the resetInput data for the selected user
      const response = await axios.post(`${Base_url}/user/reset`, {
        password,
        userId,
      });
      console.log(response.data);
      // Optionally, update the UI or show a success message
      setResetUserId(null); // Reset back to null after saving
      setPassword(""); // Clear the password input field after saving
      getUser(); // Refresh the user list to reflect changes
      showSnackbar("Password updated successfully", "success");
    } catch (error) {
      console.error("Error resetting password:", error);
      showSnackbar("Error resetting password", "error");
      // Handle error scenario as needed
    }
  };

  const handleDelete = (userId) => {
    // Show confirmation dialog using window.confirm()
    if (window.confirm("Are you sure you want to delete this user?")) {
      // If user confirms, set deleteUserId and proceed with deletion
      setDeleteUserId(userId);
      deleteUser(userId);
    }
  };

  const deleteUser = async (userIdToDelete) => {
    try {
      // Make API call to delete user with userIdToDelete
      const response = await axios.delete(
        `${Base_url}/user/deleteUser/${userIdToDelete}`,
        headers
      );
      console.log(response.data);
      // Refresh user list after deletion
      getUser();
      showSnackbar("User deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Error deleting user", "error");
      // Handle error scenario as needed
    }
  };

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${Base_url}/user/signup`,
        {
          username: newUserName,
          email: newUserEmail,

          password: newUserPassword,
          storeName: newUserId,
        },
        headers
      );
      console.log(response.data);
      setLoading(false);
      getUser(); // Refresh user list after creating user
      showSnackbar("User created successfully", "success");
      setNewUserName(""); // Clear input fields after successful creation
      setNewUserEmail("");
      setNewUserId("");
      setNewUserPassword("");
    } catch (error) {
      setLoading(false);
      console.error("Error creating user:", error);
      showSnackbar("Error creating user", "error");
      // Handle error scenario as needed
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div id="wrapper">
      <AdminDashboard />
      <div>
        <div className="user-creation-form">
          <TextField
            label="Store Name"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Username"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Email or id"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Password"
            type="text"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateUser}
            disabled={
              !newUserName ||
              !newUserEmail ||
              !newUserId ||
              !newUserPassword ||
              loading
            }
          >
            {loading ? <CircularProgress size={24} /> : "Create User"}
          </Button>
        </div>

        <div className="table">
          <table>
            <thead>
              <tr>
                <th>UserName</th>
                <th>Store</th>
                <th>User Email</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.storeName}</td>
                  <td>{user.email}</td>
                  <td>{user.createdAt}</td>
                  <td>
                    {userId === user.id ? (
                      <div>
                        <input
                          type="text"
                          value={password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                        />
                        <button onClick={handleSave}>Save</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => handleReset(user.id)}>
                          Reset password
                        </button>
                        <button onClick={() => handleDelete(user.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snackbar for user feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          style={{
            backgroundColor: snackbarMessage.includes("success")
              ? "green"
              : "red",
          }}
          message={snackbarMessage}
          action={
            <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
              CLOSE
            </Button>
          }
        />
      </Snackbar>

      {/* Loading indicator */}
      {loading && (
        <div className="loading-indicator">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default Admin;
