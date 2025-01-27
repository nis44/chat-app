import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore"; // Zustand store for user state
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { useEffect } from "react";

const App = () => {
  const { user, getCurrentUser } = useAuthStore(); // Access user state and fetch method

  // Fetch user data on app load
  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  return (
    <div>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/profile" />} />
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/setting" element={user ? <SettingPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
