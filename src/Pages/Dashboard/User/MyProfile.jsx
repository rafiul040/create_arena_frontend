import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    phone: "",
    bio: "",
  });

  const [stats, setStats] = useState({
    participated: 0,
    won: 0,
    createdContests: 0,
  });

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch profile
        const profileRes = await axiosSecure.get(`/users/${user.email}`);
        setUserData({
          displayName: profileRes.data.displayName || "",
          email: profileRes.data.email || "",
          photoURL: profileRes.data.photoURL || "",
          phone: profileRes.data.phone || "",
          bio: profileRes.data.bio || "",
        });

        // Fetch stats
        const statsRes = await axiosSecure.get(`/users/${user.email}/stats`);
        setStats(statsRes.data || { participated: 0, won: 0, createdContests: 0 });

      } catch (err) {
        Swal.fire("Error", "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData((prev) => ({ ...prev, photoURL: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await axiosSecure.patch(`/users/email/${user.email}`, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        phone: userData.phone,
        bio: userData.bio,
      });

      Swal.fire("Success", "Profile updated successfully", "success");
      setEditing(false);
    } catch {
      Swal.fire("Error", "Profile update failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  const winRate =
    stats.participated > 0 ? ((stats.won / stats.participated) * 100).toFixed(0) : 0;

  const doughnutData = {
    labels: ["Won", "Lost"],
    datasets: [
      {
        data: [stats.won, Math.max(stats.participated - stats.won, 0)],
        backgroundColor: ["#22c55e", "#e5e7eb"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-black text-indigo-600">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile & track performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
          <div className="bg-white rounded-3xl p-8 shadow-xl space-y-6">
            <h3 className="text-2xl font-bold">📊 Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat icon="🎯" label="Contests Joined" value={stats.participated} />
              <Stat icon="🏆" label="Contests Won" value={stats.won} />
              <Stat icon="🎨" label="Ongoing Contests" value={stats.createdContests} />
            </div>

          
            <div className="bg-gray-50 rounded-3xl p-6">
              <h4 className="text-center font-bold mb-4">🏆 Win Percentage</h4>
              <div className="relative w-full h-64 flex items-center justify-center">
                <Doughnut data={doughnutData} />
                <div className="absolute text-center pointer-events-none">
                  <p className="text-4xl font-black text-green-600">{winRate}%</p>
                  <p className="text-sm text-gray-500 font-semibold">Win Rate</p>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <LegendItem color="bg-green-500" label={`Won (${stats.won})`} />
                <LegendItem
                  color="bg-gray-300"
                  label={`Lost (${stats.participated - stats.won})`}
                />
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between mb-6">
              <h3 className="text-2xl font-bold">👤 Profile</h3>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setEditing(!editing)}
                disabled={updating}
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={
                    userData.photoURL ||
                    "https://img.freepik.com/free-icon/user_318-159711.jpg"
                  }
                  alt="User Profile"
                  className="rounded-full w-28 h-28 object-cover border-4 border-indigo-200 shadow-lg"
                />
              </div>

              {editing && (
                <div className="flex justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="file-input file-input-bordered w-full max-w-xs"
                  />
                </div>
              )}

              <InputField
                label="Name"
                name="displayName"
                value={userData.displayName}
                onChange={handleChange}
                disabled={!editing}
              />

              <InputField
                label="Email"
                name="email"
                value={userData.email}
                disabled
              />

              <InputField
                label="Phone"
                name="phone"
                type="tel"
                value={userData.phone}
                onChange={handleChange}
                disabled={!editing}
              />

              <InputField
                label="Bio"
                name="bio"
                type="textarea"
                value={userData.bio}
                onChange={handleChange}
                disabled={!editing}
              />

              {editing && (
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Clean helper components
const Stat = ({ icon, label, value }) => (
  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border-l-4 border-indigo-500">
    <div className="flex items-center gap-3">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-indigo-700">{value}</p>
      </div>
    </div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-6 h-6 rounded-full ${color}`}></span>
    <span>{label}</span>
  </div>
);

const InputField = ({ label, name, value, onChange, disabled, type = "text" }) => (
  <div>
    <label htmlFor={name} className="block font-semibold mb-2 text-gray-700">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={name}
        name={name}
        rows="4"
        className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
        }`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={`Enter your ${label.toLowerCase()}...`}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
        }`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={`Enter your ${label.toLowerCase()}...`}
      />
    )}
  </div>
);

export default MyProfile;
