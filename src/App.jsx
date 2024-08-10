import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import SignIn from "./component/login/signIn";
import SignUp from "./component/login/Signup";
import ForgotPassword from "./component/passwordReset/ForgotPassword";
import ResetPassword from "./component/passwordReset/Reset";
import ExcelDetails from "./component/ExcelDetails";
import ExcelForm from "./component/ExcelForm";
import Data2 from "./component/Data2";
import DailySalesReport from "./component/SaleReport";
import ItemMaster from "./component/ItemMaster";
import AllData from "./component/AllData";
import MyComponent from "./component/sample";
import Report from "./component/Report";
import Invoice from "./component/Invoice";
import FinalReport from "./component/finalReport";
import Admin from "./Admindashboard/Admin";
import Adminsale from "./Admindashboard/Adminsale";
import Calc from "./component/Calc";
import AdminInward from "./Admindashboard/AdminInward";
import SalesMessage from "./component/SalesMessage";
import Signup from "./component/login/Signup";

// const Base_url = "http://localhost:4000";
const Base_url = "https://billing-backend-2.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  // const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("Admin");
  const [issubmit, SetIssubmit] = useState(false);
  const expiresIn = localStorage.getItem("expiresIn");

  const navigate = useNavigate();
  useEffect(() => {
    if (expiresIn) {
      if (Date.now() > expiresIn) {
        console.log(Date.now(), expiresIn);
        localStorage.clear();
        window.location.href = "/";
      }
    }
    if (!token) {
      // window.location.href = "/";
      localStorage.clear();
      navigate("/");
    }
  }, [token, expiresIn]);

  return (
    <div id="page-top">
      <Routes>
        <Route path="/" element={<Signup Base_url={Base_url} />} />
        {/* Uncomment these lines if needed */}
        {/* <Route path="/forgotpassword" element={<ForgotPassword Base_url={Base_url} />} />
        <Route path="/resetpassword/:id" element={<ResetPassword Base_url={Base_url} />} /> */}

        <Route path="/inward" element={<ExcelForm Base_url={Base_url} />} />
        {isAdmin && (
          <>
            <Route
              path="/AdminInward"
              element={<AdminInward Base_url={Base_url} />}
            />
            <Route path="/CreateUser" element={<Admin Base_url={Base_url} />} />
            <Route
              path="/AdminSaleView"
              element={<Adminsale Base_url={Base_url} />}
            />
          </>
        )}
        <Route
          path="/exceldata"
          element={
            <ExcelDetails Base_url={Base_url} SetIssubmit={SetIssubmit} />
          }
        />

        {token ? (
          <>
            <Route path="/invoice" element={<Invoice Base_url={Base_url} />} />
            <Route
              path="/SaleReport"
              element={<Report Base_url={Base_url} issubmit={issubmit} />}
            />
            <Route
              path="/excelForm2"
              element={<Data2 Base_url={Base_url} issubmit={issubmit} />}
            />
            <Route
              path="/dailyReport"
              element={
                <DailySalesReport Base_url={Base_url} issubmit={issubmit} />
              }
            />
            <Route path="/calc" element={<Calc Base_url={Base_url} />} />
            <Route
              path="/Report"
              element={<Data2 Base_url={Base_url} issubmit={issubmit} />}
            />
            <Route
              path="/saleMessage"
              element={<SalesMessage Base_url={Base_url} issubmit={issubmit} />}
            />
            <Route
              path="/itemMaster"
              element={<ItemMaster Base_url={Base_url} />}
            />
            <Route
              path="/data"
              element={<AllData Base_url={Base_url} issubmit={issubmit} />}
            />
            <Route
              path="/sample"
              element={<MyComponent Base_url={Base_url} issubmit={issubmit} />}
            />
            <Route
              path="/pv_report"
              element={<FinalReport Base_url={Base_url} issubmit={issubmit} />}
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
      <ToastContainer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
