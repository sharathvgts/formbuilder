import useAuthStore from "@/store/use-auth-store";
import { useState } from "react";
import { Links, useNavigate } from "react-router";
export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState("");

  const navigate = useNavigate();

  const { updateAuthState } = useAuthStore();

  // Mock user data with tokens and roles
  const users = {
    Admin_user1: {
      token: "078624db9e3e3d3db4e70ffd3924b54b14e7d455",
      role: "Admin",
      name: "Admin_user1",
    },
    Admin_user2: {
      token: "91e0eae7655a0ef185d9d278fbd5278828d240a1",
      role: "Admin",
      name: "Admin_user2",
    },
    "Super Admin_user3": {
      token: "99cfb7e6e9685fb5cd1c7d0ee58d230f71d642f6",
      role: "Super Admin",
      name: "Super Admin_user3",
    },
    "Super Admin_user4": {
      token: "f730aee89bed26752a867a48051ab084b4adaecb",
      role: "Super Admin",
      name: "Super Admin_user4",
    },
    Doctor_user5: {
      token: "ac428c3f0e051726f8d0482954673ba1d931ace8",
      role: "Doctor",
      name: "Doctor_user5",
    },
    Doctor_user6: {
      token: "9bca36b9119ad7a8cf3a22f5842cb7a7ae28ee3e",
      role: "Doctor",
      name: "Doctor_user6",
    },
    "Centre Incharge_user7": {
      token: "49935b4aa7276365fddae69fc4a7b7525aab7c94",
      role: "Centre Incharge",
      name: "Centre Incharge_user7",
    },
    "Centre Incharge_user8": {
      token: "2d361fe92db429f498039ba1964ea208b3e3528d",
      role: "Centre Incharge",
      name: "Centre Incharge_user8",
    },
    Accountant_user9: {
      token: "232d975d5dac87df1a6170c2d56375a2a171a205",
      role: "Accountant",
      name: "Accountant_user9",
    },
    Accountant_user10: {
      token: "b51d7fb1e3b6a2027a8927d5146a0289c0f7ff34",
      role: "Accountant",
      name: "Accountant_user10",
    },
  };

  const handleLogin = () => {
    if (selectedUser) {
      updateAuthState({
        token: users[selectedUser].token,
        role: users[selectedUser].role,
      });
      navigate("/form/list");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Login Portal
          </h1>
          <p className="text-gray-600">Select a user to continue</p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="userSelect"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select User
            </label>
            <select
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choose a user...</option>
              {Object.keys(users).map((userId) => (
                <option key={userId} value={userId}>
                  {users[userId].name} ({users[userId].role})
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                Selected User Info:
              </h3>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Role:</span>{" "}
                {users[selectedUser].role}
              </p>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Token:</span>{" "}
                {users[selectedUser].token}
              </p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!selectedUser}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 ${selectedUser
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Login
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Mock login system - Select any user to proceed
          </p>
        </div>
      </div>
    </div>
  );
}
