import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { users, messages, fetchUsers, fetchMessages, sendMessage, setselectedUserr } =
    useAuthStore();
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [messageText, setMessageText] = useState(""); // Input message text
  const messagesEndRef = useRef(null); // Reference to the end of the messages list

  useEffect(() => {
    fetchUsers(); // Fetch users when the component loads
  }, [fetchUsers]);

  // Scroll to the latest message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom whenever messages update
  }, [messages]);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
    setselectedUserr(user._id); // Fetch messages for the selected user
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim()) return; // Don't send empty messages
    sendMessage(selectedUser._id, { text: messageText }); // Send message to the selected user
    setMessageText(""); // Clear input after sending
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">Chat Application</h1>
      </nav>

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
                        {msg.text || (
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
                {/* Dummy div for scrolling */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Send
                  </button>
                </div>
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
