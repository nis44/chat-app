import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { users, messages, fetchUsers, fetchMessages, sendMessage } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [messageText, setMessageText] = useState(""); // Input message text
  const [imageFile, setImageFile] = useState(null); // Selected image file

  useEffect(() => {
    fetchUsers(); // Fetch users when the component loads
  }, [fetchUsers]);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id); // Fetch messages for the selected user
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() && !imageFile) return; // Don't send if both text and image are empty

    // Create FormData to send both text and image
    const formData = new FormData();
    formData.append("text", messageText);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    console.log(formData)

    await sendMessage(selectedUser._id, formData); // Send message to the selected user
    setMessageText(""); // Clear input after sending
    setImageFile(null); // Clear selected image
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save the selected file
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Content area */}
      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar */}
        <div className="w-1/4 bg-white shadow-lg overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-800 p-4">Users</h2>
          <ul className="space-y-2">
            {users && users.length ? (
              users.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-4 cursor-pointer hover:bg-gray-200 ${
                    selectedUser?._id === user._id ? "bg-gray-300" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="text-gray-700 font-medium">{user.username}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500">No users found</li>
            )}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white shadow-lg">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800">
                  Chat with {selectedUser.fullname}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages && messages.length ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderId === selectedUser._id ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          msg.senderId === selectedUser._id
                            ? "bg-gray-200 text-gray-800"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {msg.text && <p>{msg.text}</p>}
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Message"
                            className="max-w-xs rounded"
                          />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">No messages yet</div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex space-x-2 items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300"
                  >
                    {imageFile ? "Image Selected" : "Attach Image"}
                  </label>
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Send
                  </button>
                </div>
                {imageFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
