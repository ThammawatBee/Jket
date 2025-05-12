import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { FileUpload, } from "@chakra-ui/react"
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import MonthlyReport from "./pages/MonthlyReport";
import MMTHOrder from "./pages/MMTHOrder";
import MMTHBilling from "./pages/MMTHBilling";
import UserManagement from "./pages/UserManagement";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./layout/PrivateRoute";

function App() {
  return (
    <Box>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<PrivateRoute>
          <UploadPage />
        </PrivateRoute>} />
        <Route path="/monthly-report" element={<PrivateRoute><MonthlyReport /></PrivateRoute>} />
        <Route path="/mmth-order" element={<PrivateRoute><MMTHOrder /></PrivateRoute>} />
        <Route path="/export-mmth-billing" element={<PrivateRoute><MMTHBilling /></PrivateRoute>} />
        <Route path="/user-management" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    </Box>
  );
}

export default App;
