import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./app.css";
import SignIn from "./component/login/signIn";
import SignUp from "./component/login/Signup";
import axios from "axios";
import ForgotPassword from "./component/passwordReset/ForgotPassword";
import ResetPassword from "./component/passwordReset/Reset";
import ExcelDetails from "./component/ExcelDetails";
import ExcelForm from "./component/ExcelForm";
import Data2 from "./component/Data2";
import DailySalesReport from "./component/SaleReport";
import ItemMaster from "./component/ItemMaster";
import AllData from "./component/AllData";
import MyComponent from "./component/sample";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Report from "./component/Report";
import Sample from "./component/sample";

const Base_url = " https://billingbackend-xo8c.onrender.com";
function App() {
  const [user, setuser] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn Base_url={Base_url} />} />
        <Route path="/signup" element={<SignUp Base_url={Base_url} />} />
        <Route
          path="/forgotpassword"
          element={<ForgotPassword Base_url={Base_url} />}
        />
        <Route
          path="/resetpassword/:id"
          element={<ResetPassword user={user} Base_url={Base_url} />}
        />
      </Routes>

      <div id="page-top">
        <div id="wrapper">
          <Routes>
            <Route
              path="/exceldata"
              element={<ExcelDetails Base_url={Base_url} />}
            />
            <Route
              path="/excelForm"
              element={<ExcelForm Base_url={Base_url} />}
            />
            <Route
              path="/SaleReport"
              element={<Report Base_url={Base_url} />}
            />
            <Route path="/excelForm2" element={<Data2 Base_url={Base_url} />} />
            <Route
              path="/dailyReport"
              element={<DailySalesReport Base_url={Base_url} />}
            />
            <Route path="/Report" element={<Data2 Base_url={Base_url} />} />
            <Route
              path="/itemMaster"
              element={<ItemMaster Base_url={Base_url} />}
            />
            <Route path="/data" element={<AllData Base_url={Base_url} />} />
            <Route
              path="/sample"
              element={<MyComponent Base_url={Base_url} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
