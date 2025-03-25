import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import MonthlyReport from "./pages/MonthlyReport";
import MMTHOrder from "./pages/MMTHOrder";
import MMTHBilling from "./pages/MMTHBilling";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/monthly-report" element={<MonthlyReport />} />
        <Route path="/mmth-order" element={<MMTHOrder />} />
        <Route path="/export-mmth-billing" element={<MMTHBilling />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    </Box>
  );
}

export default App;
