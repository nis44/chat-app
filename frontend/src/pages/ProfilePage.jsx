import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore"; // Assuming this hook handles user state and actions
import { Camera } from "lucide-react";

const ProfilePage = () => {
  const {
    user, // Get current user state from store
    getCurrentUser, // Fetch current user details
    updateAvatar, // Update avatar functionality
    updateAccountDetails, // Update account details functionality
  } = useAuthStore();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "/default-avatar.png");

  // Form state for updating account details
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
  });

  // Fetch user data when the component loads or when `user` changes
  useEffect(() => {
    if (!user) {
      getCurrentUser(); // Fetch current user details if not already fetched
    } else {
      // Update form state and avatar preview when user info is available
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
      });
      setAvatarPreview(user.avatar || "/default-avatar.png");
    }
  }, [user, getCurrentUser]);

  // Handle avatar image file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      try {
        await updateAvatar(formData);
        alert("Avatar updated successfully!");
      } catch (error) {
        console.error("Error updating avatar:", error);
        alert("Failed to upload avatar.");
      }
    } else {
      alert("Please select an image to upload.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle account details update
  const handleUpdateDetails = async () => {
    try {
      await updateAccountDetails(formData);
      console.log(formData)
      alert("Account details updated successfully!");
    } catch (error) {
      console.error("Error updating account details:", error);
      alert("Failed to update account details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Profile</h1>

      {/* Avatar Section */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={avatarPreview}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <button
          onClick={handleAvatarUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Upload Avatar
        </button>
      </div>

      {/* Profile Details */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Update Profile Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={user?.fullname || "Enter your full name"}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={user?.email || "Enter your email"}
            />
          </div>
          <button
            onClick={handleUpdateDetails}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Update Details
          </button>
        </div>
      </div>

      {/* Display User Information */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Details</h2>
        <p>
          <span className="font-medium text-gray-700">Full Name: </span>
          {user?.fullname || "Not provided"}
        </p>
        <p>
          <span className="font-medium text-gray-700">Email: </span>
          {user?.email || "Not provided"}
        </p>
        <p>
          <span className="font-medium text-gray-700">Avatar: </span>
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
          ) : (
            "No avatar uploaded"
          )}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
