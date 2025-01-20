
import { useAuthStore } from "../store/useAuthStore"; // Importing the AuthStore hook
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router for navigation

const Navbar = () => {
  const { logout } = useAuthStore(); // Extract the logout function from the store
  const navigate = useNavigate(); // React Router's navigate function

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from the store
      navigate("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img
          src="https://via.placeholder.com/40"
          alt="Chattyy Logo"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-2xl font-bold text-gray-800">Chattyy</span>
      </div>

      {/* Links */}
      <div className="flex items-center space-x-6">
        <a
          href="/"
          className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
        >
          Home
        </a>
        <a
          href="/profile"
          className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
        >
          Profile
        </a>
        <a
          href="/settings"
          className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
        >
          Settings
        </a>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
