
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analyze from "./pages/Analyze";
import History from "./pages/History";
import AnalysisDetails from "./pages/AnalysisDetails";
import Interview from "./pages/Interview";
import InterviewSession from "./pages/InterviewSession";
import InterviewResult from "./pages/InterviewResult";

import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout() {
  const location = useLocation();

  const showFooter =
    location.pathname === "/" || location.pathname === "/about";

  return (
    <>
      {/* Navbar is visible on every page */}
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/analyze" element={<Analyze />} />

          <Route path="/history" element={<History />} />

          <Route path="/analysis/:id" element={<AnalysisDetails />} />

          <Route path="/interview" element={<Interview />} />

          <Route path="/interview/:id" element={<InterviewSession />} />

          <Route
            path="/interview/:id/result"
            element={<InterviewResult />}
          />
        </Route>
      </Routes>

      {/* Footer only on Home and About */}
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
