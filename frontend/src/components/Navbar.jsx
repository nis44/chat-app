
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
          src="https://imgs.search.brave.com/k5DigzwN-h7tljHzzbKMO05BrzlAj914iXw_By9bFKo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtcGxhdGZvcm0u/OTlzdGF0aWMuY29t/Ly83djctYXJoMzhy/YXpzMHNSNG15QXNU/S203SWc9LzB4MDox/MDI0eDEwMjQvZml0/LWluLzUwMHg1MDAv/OTlkZXNpZ25zLWNv/bnRlc3RzLWF0dGFj/aG1lbnRzLzcwLzcw/NjkxL2F0dGFjaG1l/bnRfNzA2OTEwMjM.jpeg"
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
