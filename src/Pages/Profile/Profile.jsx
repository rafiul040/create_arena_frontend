import React from "react";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user, logOut } = useAuth();

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8">
  
      <div className="flex items-center gap-8">
        
        <div className="relative">
          <img
            src={user?.photoURL || "/avatar.png"}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover"
          />
          <span className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </div>

  
        <div>
          <h2 className="text-2xl font-bold">{user?.displayName || "John Doe"}</h2>
          <p className="text-gray-500">{user?.email}</p>

          <button
            onClick={logOut}
            className="mt-4 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Log out
          </button>
        </div>
      </div>
              </div>

  );
};

export default Profile;
