// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.bundle";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// import "./app.css";
// import SignIn from "./component/login/signIn";
// import SignUp from "./component/login/Signup";
// import axios from "axios";
// import ForgotPassword from "./component/passwordReset/ForgotPassword";
// import ResetPassword from "./component/passwordReset/Reset";
// import ExcelDetails from "./component/ExcelDetails";
// import ExcelForm from "./component/ExcelForm";
// import Data2 from "./component/Data2";
// import DailySalesReport from "./component/SaleReport";
// import ItemMaster from "./component/ItemMaster";
// import AllData from "./component/AllData";
// import MyComponent from "./component/sample";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Report from "./component/Report";
// import Sample from "./component/sample";
// import Invoice from "./component/Invoice";

// // const Base_url = " https/://billingbackend-xo8c.onrender.com"; woring
// // const Base_url = "https://billing-backend-10h6.onrender.com";
// const Base_url = "http://localhost:4000";

// function App() {
//   const [user, setUser] = useState();
//   const id = localStorage.getItem("id");
//   const token = localStorage.getItem("token");

//   const navigate = useNavigate();
//   console.log("token", token);
//   console.log("id", id);
//   const headers = {
//     headers: { authorization: `${token}` },
//   };
//   useEffect(() => {
//     // Check for token to determine if user is authenticated
//     if (!token) {
//       navigate("/");
//     } else {
//       axios
//         .get(`${Base_url}/user/profile`, headers)
//         .then((response) => {
//           setUser(response.data);
//           console.log(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching user data:", error);
//           navigate("/"); // Redirect to sign-in page on error or unauthorized access
//         });
//     }
//   }, [token, navigate]);
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<SignIn Base_url={Base_url} />} />
//         <Route path="/signup" element={<SignUp Base_url={Base_url} />} />
//         <Route
//           path="/forgotpassword"
//           element={<ForgotPassword Base_url={Base_url} />}
//         />
//         <Route
//           path="/resetpassword/:id"
//           element={<ResetPassword user={user} Base_url={Base_url} />}
//         />
//       </Routes>

//       <div id="page-top">
//         <div id="wrapper">
//           {(token == null || "authentication error token doesnot exixts") &&
//           id != null ? (
//             <Routes>
//               <Route
//                 path="/exceldata"
//                 element={<ExcelDetails Base_url={Base_url} />}
//               />
//               <Route
//                 path="/excelForm"
//                 element={<ExcelForm Base_url={Base_url} />}
//               />
//               <Route
//                 path="/SaleReport"
//                 element={<Report Base_url={Base_url} />}
//               />
//               <Route
//                 path="/excelForm2"
//                 element={<Data2 Base_url={Base_url} />}
//               />
//               <Route
//                 path="/dailyReport"
//                 element={<DailySalesReport Base_url={Base_url} />}
//               />
//               <Route path="/Report" element={<Data2 Base_url={Base_url} />} />
//               <Route
//                 path="/itemMaster"
//                 element={<ItemMaster Base_url={Base_url} />}
//               />
//               <Route path="/data" element={<AllData Base_url={Base_url} />} />
//               <Route
//                 path="/sample"
//                 element={<MyComponent Base_url={Base_url} />}
//               />
//               <Route
//                 path="/invoice"
//                 element={<Invoice Base_url={Base_url} />}
//               />
//             </Routes>
//           ) : (
//             <p>Login </p>
//           )}
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;
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
// import SignIn from "./component/login/SignIn";
// import SignUp from "./component/login/SignUp";
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
import Report from "./component/Report";
import Sample from "./component/sample";
import Invoice from "./component/Invoice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import FinalReport from "./component/finalReport";

// const Base_url = "http://localhost:4000";
const Base_url = "https://billing-backend-10h6.onrender.com";
function App() {
  const [user, setUser] = useState(null);
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getUserData();
    }
  }, [token, navigate]);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${Base_url}/user/profile`, headers);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/"); // Redirect to sign-in page on error or unauthorized access
    }
  };

  return (
    <div id="page-top">
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
        {user ? (
          <>
            <Route
              path="/exceldata"
              element={<ExcelDetails Base_url={Base_url} />}
            />
            <Route
              path="/excelform"
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
            <Route path="/pv_report" element={<FinalReport Base_url={Base_url} />} />
            <Route path="/invoice" element={<Invoice Base_url={Base_url} />} />
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
