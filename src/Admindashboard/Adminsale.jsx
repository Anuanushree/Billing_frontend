import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Snackbar,
  SnackbarContent,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import { LocalizationProvider } from "@mui/lab";
import AdminDashboard from "./AdminDashboard";

function Adminsale({ Base_url }) {
  const [users, setUsers] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    getUser();
    fetchFormDetails();
    handleSearch();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(`${Base_url}/user/list`, headers);
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const fetchFormDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Base_url}/user/getAllData`, headers);
      setFormDetails(response.data);
      filterAndSeparateData(response.data);
    } catch (error) {
      console.error("Error fetching sale records:", error);
      showSnackbar("Error fetching sale records", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSeparateData = (data) => {
    const filteredData = {};

    users.forEach((user) => {
      const userId = user.id;
      const totalQuantity = data
        .filter(
          (item) => item.user === userId && !isNaN(parseInt(item.Closing_value))
        )
        .reduce((acc, item) => acc + parseInt(item.Closing_value || 0, 10), 0);

      filteredData[userId] = {
        userName: user.username,
        totalQuantity: totalQuantity || 0, // Default to 0 if NaN
      };
    });

    setFilteredData(filteredData);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSearch = async () => {
    console.log("jhgc");
    const formattedDate = selectedDate.toISOString().substring(0, 10);
    const response = await axios.get(`${Base_url}/user/getAllDailyData`);
    console.log(response.data, "ddfk");
    const filt = response.data.filter(
      (d) => d.Date.substring(0, 10) === formattedDate
    );
    console.log(filt);
    setFormDetails(filt);
    filterAndSeparateData(filt);
  };

  return (
    <div id="wrapper">
      <AdminDashboard />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Sales Data</h1>
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell align="right">Total Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(filteredData).map((userId) => (
                  <TableRow key={userId}>
                    <TableCell component="th" scope="row">
                      {filteredData[userId]?.userName}
                    </TableCell>
                    <TableCell align="right">
                      {filteredData[userId]?.totalQuantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

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
              <Button
                color="inherit"
                size="small"
                onClick={handleCloseSnackbar}
              >
                CLOSE
              </Button>
            }
          />
        </Snackbar>

        {/* Loading indicator */}
        {loading && (
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Adminsale;
