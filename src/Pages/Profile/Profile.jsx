import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiCamera,
  FiLogOut,
  FiAward,
  FiTrendingUp,
  FiCalendar
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Profile = () => {
  const { user, logOut, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoadingStats(true);
        const response = await axiosSecure.get(`/users/${user?.email}/stats`);
        setUserStats(response.data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        // Set default stats if API fails
        setUserStats({
          contestsJoined: 0,
          contestsWon: 0,
          totalEarnings: 0,
          rank: "Beginner"
        });
      } finally {
        setLoadingStats(false);
      }
    };

    if (user?.email) {
      fetchUserStats();
    }
  }, [user?.email, axiosSecure]);

  // Handle profile update
  const handleUpdateProfile = async (data) => {
    setLoading(true);
    try {
      // Update Firebase profile
      await updateUserProfile({
        displayName: data.displayName,
      });

      // Update database
      await axiosSecure.patch(`/users/${user?.email}`, {
        displayName: data.displayName,
        phone: data.phone,
      });

      toast.success("Profile updated successfully! 🎉");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_host_key}`;
      const imgRes = await axios.post(imageAPIURL, formData);
      const photoURL = imgRes?.data?.data?.url;

      if (!photoURL) throw new Error("Image upload failed");

      // Update Firebase profile
      await updateUserProfile({ photoURL });

      // Update database
      await axiosSecure.patch(`/users/${user?.email}`, { photoURL });

      toast.success("Profile picture updated! 📸");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image ❌");
    } finally {
      setUploading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    reset({
      displayName: user?.displayName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=random`}
                      alt="Profile"
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Upload Button Overlay */}
                <label
                  htmlFor="profile-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploading ? (
                    <span className="loading loading-spinner loading-md text-white"></span>
                  ) : (
                    <FiCamera className="w-8 h-8 text-white" />
                  )}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                
                {/* Online Status */}
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-success rounded-full border-2 border-base-100"></span>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {!isEditing ? (
                  <>
                    <h2 className="text-3xl font-bold text-base-content">
                      {user?.displayName || "User"}
                    </h2>
                    <p className="text-base-content/60 flex items-center justify-center md:justify-start gap-2 mt-1">
                      <FiMail className="w-4 h-4" />
                      {user?.email}
                    </p>
                    {user?.phone && (
                      <p className="text-base-content/60 flex items-center justify-center md:justify-start gap-2 mt-1">
                        <FiPhone className="w-4 h-4" />
                        {user?.phone}
                      </p>
                    )}
                    <p className="text-sm text-base-content/50 flex items-center justify-center md:justify-start gap-2 mt-2">
                      <FiCalendar className="w-4 h-4" />
                      Member since {new Date(user?.metadata?.creationTime).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-3 mt-4 justify-center md:justify-start">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-primary btn-sm"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="btn btn-error btn-sm"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
                    {/* Display Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Display Name</span>
                      </label>
                      <input
                        {...register("displayName", {
                          required: "Display name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                        type="text"
                        className={`input input-bordered ${errors.displayName ? "input-error" : ""}`}
                      />
                      {errors.displayName && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.displayName.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Email (Read-only) */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email</span>
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        className="input input-bordered"
                        disabled
                      />
                      <label className="label">
                        <span className="label-text-alt">Email cannot be changed</span>
                      </label>
                    </div>

                    {/* Phone */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Phone (Optional)</span>
                      </label>
                      <input
                        {...register("phone", {
                          pattern: {
                            value: /^[0-9+\-\s()]*$/,
                            message: "Please enter a valid phone number",
                          },
                        })}
                        type="tel"
                        className={`input input-bordered ${errors.phone ? "input-error" : ""}`}
                      />
                      {errors.phone && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.phone.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn btn-ghost"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Contests Joined */}
          <div className="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Contests Joined</p>
                  {loadingStats ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <h3 className="text-3xl font-bold">{userStats?.contestsJoined || 0}</h3>
                  )}
                </div>
                <FiTrendingUp className="w-10 h-10 opacity-50" />
              </div>
            </div>
          </div>

          {/* Contests Won */}
          <div className="card bg-gradient-to-br from-success to-success/80 text-success-content shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Contests Won</p>
                  {loadingStats ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <h3 className="text-3xl font-bold">{userStats?.contestsWon || 0}</h3>
                  )}
                </div>
                <FiAward className="w-10 h-10 opacity-50" />
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="card bg-gradient-to-br from-warning to-warning/80 text-warning-content shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Earnings</p>
                  {loadingStats ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <h3 className="text-3xl font-bold">${userStats?.totalEarnings || 0}</h3>
                  )}
                </div>
                <span className="text-4xl opacity-50">💰</span>
              </div>
            </div>
          </div>

          {/* User Rank */}
          <div className="card bg-gradient-to-br from-secondary to-secondary/80 text-secondary-content shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Current Rank</p>
                  {loadingStats ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <h3 className="text-2xl font-bold">{userStats?.rank || "Beginner"}</h3>
                  )}
                </div>
                <span className="text-4xl opacity-50">🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="divider"></div>
            
            {loadingStats ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-4">
                {userStats?.recentActivity && userStats.recentActivity.length > 0 ? (
                  userStats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12">
                          <span className="text-xl">🎯</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{activity.title}</p>
                        <p className="text-sm text-base-content/60">{activity.description}</p>
                      </div>
                      <div className="text-sm text-base-content/50">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-base-content/60">
                    <p>No recent activity yet</p>
                    <p className="text-sm mt-2">Start participating in contests to see your activity here!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
