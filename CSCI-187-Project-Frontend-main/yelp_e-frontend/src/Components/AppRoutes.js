import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import BusinessPage from "./BusinessPage";
import SearchPage from "./SearchResultPage";
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/business/:business_id" element={<BusinessPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}
