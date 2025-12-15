import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyProfile = () => {
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    photoURL: "",
    bio: "",
    role: "user"
  });
  const [stats, setStats] = useState({ participated: 0, won: 0, createdContests: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await axiosSecure.get(`/users/${user.email}`);
        setUserData(profileRes.data);
        
        const statsRes = await axiosSecure.get(`/users/${user.email}/stats`);
        setStats(statsRes.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, axiosSecure]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData(prev => ({ ...prev, photoURL: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      await axiosSecure.patch(`/users/${userData._id || userData.id}`, {
        name: userData.name,
        photoURL: userData.photoURL,
        bio: userData.bio
      });
      
      Swal.fire('সফল!', 'Profile আপডেট হয়েছে!', 'success');
      setEditing(false);
    } catch (error) {
      Swal.fire('ত্রুটি!', 'Profile আপডেট ফেইল', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className='loading loading-infinity loading-lg'></span>
      </div>
    );
  }

  const winPercentage = stats.participated > 0 
    ? ((stats.won / stats.participated) * 100).toFixed(0) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            আমার প্রোফাইল
          </h1>
          <p className="text-xl text-gray-600">আপনার অ্যাকাউন্ট ম্যানেজ করুন এবং পরিসংখ্যান দেখুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Stats Cards */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                📊 আমার পরিসংখ্যান
              </h3>
              
              <div className="space-y-6">
                {/* Participated */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-blue-500">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-blue-700">{stats.participated}</span>
                    <span className="text-sm font-medium text-blue-600">Contest Joined</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                {/* Won */}
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-l-4 border-emerald-500">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-emerald-700">{stats.won}</span>
                    <span className="text-sm font-medium text-emerald-600">Contest Won</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${winPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Created Contests */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-l-4 border-purple-500">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-purple-700">{stats.createdContests}</span>
                    <span className="text-sm font-medium text-purple-600">Contest Created</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                      style={{ width: '80%' }}
                    ></div>
                  </div>
                </div>

            
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-l-4 border-amber-500 text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                    {winPercentage}%
                  </div>
                  <div className="text-lg font-bold text-amber-800">Win Rate</div>
                </div>
              </div>
            </div>
          </div>

        
          <div>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  👤 প্রোফাইল তথ্য
                </h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className={`btn btn-outline btn-sm ${updating ? 'btn-disabled' : ''}`}
                >
                  {editing ? 'বাতিল' : 'এডিট'}
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
            
                <div className="flex flex-col items-center space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                  <div className="relative group">
                    <img
                      src={userData.photoURL || '/default-avatar.png'}
                      alt="Profile"
                      className="w-36 h-36 rounded-3xl object-cover border-4 border-white shadow-2xl ring-4 ring-indigo-200/50"
                    />
                    {editing && (
                      <>
                        <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all"></div>
                        <label className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-2xl border-4 border-white">
                          📸
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">পুরো নাম</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full text-lg py-4 ${editing ? 'input-primary' : 'input-disabled bg-gray-50'}`}
                    disabled={!editing}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">ইমেইল</span>
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    className="input input-bordered w-full input-disabled bg-gradient-to-r from-gray-50 to-gray-100 text-lg py-4"
                    readOnly
                  />
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">বায়ো / ঠিকানা</span>
                  </label>
                  <textarea
                    name="bio"
                    value={userData.bio || ''}
                    onChange={handleInputChange}
                    className={`textarea textarea-bordered w-full h-28 text-lg py-4 ${editing ? 'textarea-primary' : 'textarea-disabled bg-gray-50'}`}
                    placeholder="আপনার সম্পর্কে বলুন..."
                    disabled={!editing}
                  />
                </div>

                {editing && (
                  <button
                    type="submit"
                    className="w-full btn btn-primary btn-lg text-white font-bold py-4 text-lg shadow-2xl hover:shadow-xl transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span className="loading loading-spinner mr-2"></span>
                        আপডেট হচ্ছে...
                      </>
                    ) : (
                      'পরিবর্তন সংরক্ষণ করুন'
                    )}
                  </button>
                )}
              </form>
            </div>

            {/* Role Badge */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl shadow-2xl font-bold text-xl">
                <div className="w-4 h-4 rounded-full bg-white"></div>
                <span>{userData.role || 'User'} Role</span>
                <div className="w-4 h-4 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
