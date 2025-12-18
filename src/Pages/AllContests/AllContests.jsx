// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import { Link, useNavigate } from "react-router-dom";

// const AllContests = () => {
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();

//   const { data: contests = [], isLoading } = useQuery({
//     queryKey: ["approvedContests"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/contests/approved");
//       return res.data;
//     }
//   });

//   if (isLoading) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <title>All Contest | Create Arena</title>
//       <h2 className="text-2xl font-bold mb-6 text-center">
//         All Approved Contests
//       </h2>

//       {contests.length === 0 ? (
//         <p className="text-center text-gray-500">
//           No contests available right now
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {contests.map((contest) => (
//             <div
//               key={contest._id}
//               className="bg-white shadow rounded-lg overflow-hidden"
//             >
//               <img
//                 src={contest.image}
//                 alt={contest.name}
//                 className="w-full h-48 object-cover"
//               />

//               <div className="p-5">
//                 <h3 className="text-lg font-semibold mb-2">
//                   {contest.name}
//                 </h3>

//                 <p className="text-sm text-gray-600">
//                   Type: {contest.type}
//                 </p>

//                 <p className="text-sm text-gray-600">
//                   Entry Fee: ${contest.price}
//                 </p>

//                 <p className="text-sm text-gray-600">
//                   Prize: ${contest.prizeMoney}
//                 </p>

//                 <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
//                   Approved
//                 </span>

//                 <button
//                   onClick={() => navigate(`/contests/${contest._id}`)}
//                   className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllContests;




// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";
// import { useNavigate } from "react-router-dom";

// const AllContests = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // Fetch approved contests
//   const { data: contests = [], isLoading: contestsLoading } = useQuery({
//     queryKey: ["approvedContests"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/contests/approved");
//       return res.data;
//     }
//   });

//   // Fetch user's participated contests (PAID only)
//   const { data: participated = [], isLoading: participatedLoading } = useQuery({
//     queryKey: ["userParticipated", user?.email],
//     queryFn: async () => {
//       if (!user?.email) return [];
//       const res = await axiosSecure.get(`/my-participated-contests/${user.email}`);
//       // ✅ ONLY paid participations block joining
//       return res.data.filter(p => p.paymentStatus === "paid");
//     },
//     enabled: !!user?.email,
//   });

//   if (contestsLoading || participatedLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen p-6">
//         <span className="loading loading-infinity loading-lg"></span>
//       </div>
//     );
//   }

//   // ✅ Check if user ALREADY PAID for this contest
//   const isAlreadyPaid = (contestId) => {
//     return participated.some(payment => payment.contestId === contestId);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <title>All Contest | Create Arena</title>
//       <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
//         All Approved Contests
//       </h2>

//       {contests.length === 0 ? (
//         <p className="text-center text-gray-500 py-20 text-lg">
//           No contests available right now
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {contests.map((contest) => {
//             const alreadyPaid = isAlreadyPaid(contest._id);
            
//             return (
//               <div
//                 key={contest._id}
//                 className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
//               >
//                 <img
//                   src={contest.image}
//                   alt={contest.name}
//                   className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
//                 />

//                 <div className="p-6">
//                   <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900">
//                     {contest.name}
//                   </h3>

//                   <div className="space-y-3 mb-5">
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <span className="text-blue-500">📋</span>
//                       Type: <span className="font-medium">{contest.type}</span>
//                     </div>

//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <span className="text-green-500">💵</span>
//                       Entry: <span className="font-bold text-green-600">${contest.price}</span>
//                     </div>

//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <span className="text-yellow-500">🏆</span>
//                       Prize: <span className="font-bold text-yellow-600">${contest.prizeMoney}</span>
//                     </div>
//                   </div>

//                   <div className="mb-5">
//                     <span className="inline-block px-4 py-2 text-xs font-bold rounded-full bg-green-100 text-green-800">
//                       ✅ Approved
//                     </span>
//                   </div>

//                   {/* ✅ PAID USERS: DISABLED BUTTON + CLEAR MESSAGE */}
//                   {alreadyPaid ? (
//                     <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl text-center">
//                       <div className="flex items-center justify-center gap-3 mb-3">
//                         <span className="text-3xl">🚫</span>
//                         <div>
//                           <h4 className="font-bold text-lg text-red-800">Already Paid & Joined</h4>
//                           <p className="text-sm text-red-700 mt-1">Payment completed successfully</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => navigate("/dashboard/my_participate_contest")}
//                         className="w-full btn btn-success"
//                         disabled={false}
//                       >
//                         👉 View My Contests
//                       </button>
//                     </div>
//                   ) : (
//                     /* ✅ NOT PAID: Normal Join Button */
//                     <button
//                       onClick={() => navigate(`/contests/${contest._id}`)}
//                       className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-indigo-600 hover:to-blue-700 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
//                     >
//                       💳 Pay ${contest.price} & Join
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllContests;












import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// ✅ Countdown Timer Component
const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

  function calculateTimeLeft(deadline) {
    const difference = new Date(deadline) - new Date();
    
    if (difference <= 0) {
      return { expired: true };
    }

    return {
      expired: false,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.expired) {
    return (
      <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">⏰</span>
          <span className="text-red-700 font-bold text-lg">Contest Ended!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-xl p-4">
      <div className="text-center mb-2">
        <span className="text-sm font-semibold text-purple-700 flex items-center justify-center gap-1">
          <span className="animate-pulse">🔴</span> LIVE COUNTDOWN
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* Days */}
        <div className="bg-white rounded-lg p-2 shadow-md">
          <div className="text-2xl font-bold text-purple-700">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Days</div>
        </div>
        
        {/* Hours */}
        <div className="bg-white rounded-lg p-2 shadow-md">
          <div className="text-2xl font-bold text-indigo-600">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
        </div>
        
        {/* Minutes */}
        <div className="bg-white rounded-lg p-2 shadow-md">
          <div className="text-2xl font-bold text-blue-600">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Mins</div>
        </div>
        
        {/* Seconds */}
        <div className="bg-white rounded-lg p-2 shadow-md animate-pulse">
          <div className="text-2xl font-bold text-red-500">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Secs</div>
        </div>
      </div>
    </div>
  );
};

// ✅ Contest Card Component
const ContestCard = ({ contest, alreadyPaid, navigate }) => {
  const isExpired = new Date(contest.deadline) < new Date();

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">
      {/* Image Section */}
      <div className="relative">
        <img
          src={contest.image}
          alt={contest.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {isExpired ? (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500 text-white shadow-lg">
              ⏱️ ENDED
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500 text-white shadow-lg animate-pulse">
              🟢 LIVE
            </span>
          )}
        </div>

        {/* Participants Count */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-black/70 text-white">
            👥 {contest.participantsCount || 0} joined
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900">
          {contest.name}
        </h3>

        {/* Contest Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-blue-500">📋</span>
            Type: <span className="font-medium px-2 py-0.5 bg-blue-100 rounded-full text-blue-700">{contest.type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500">💵</span>
            Entry Fee: <span className="font-bold text-green-600">${contest.price}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-yellow-500">🏆</span>
            Prize Money: <span className="font-bold text-yellow-600">${contest.prizeMoney}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-purple-500">📅</span>
            Deadline: <span className="font-medium">{new Date(contest.deadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>

        {/* ✅ LIVE COUNTDOWN TIMER */}
        <div className="mb-5">
          <CountdownTimer deadline={contest.deadline} />
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-2 text-xs font-bold rounded-full bg-green-100 text-green-800">
            ✅ Approved
          </span>
        </div>

        {/* Action Section - Push to bottom */}
        <div className="mt-auto">
          {isExpired ? (
            // Contest Ended
            <div className="p-4 bg-gray-100 border-2 border-gray-300 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🏁</span>
                <span className="font-bold text-gray-700">Contest Ended</span>
              </div>
              <button
                onClick={() => navigate(`/contests/${contest._id}`)}
                className="w-full btn btn-outline btn-sm"
              >
                View Results
              </button>
            </div>
          ) : alreadyPaid ? (
            // Already Paid
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">✅</span>
                <div>
                  <h4 className="font-bold text-lg text-emerald-800">Already Joined!</h4>
                  <p className="text-sm text-emerald-600 mt-1">Payment completed ✓</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard/my_participate_contest")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition-all duration-300"
              >
                👉 View My Contests
              </button>
            </div>
          ) : (
            // Join Button
            <button
              onClick={() => navigate(`/contests/${contest._id}`)}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-indigo-600 hover:to-blue-700 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              💳 Pay ${contest.price} & Join Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Main Component
const AllContests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, active, ended
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch approved contests
  const { data: contests = [], isLoading: contestsLoading } = useQuery({
    queryKey: ["approvedContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contests/approved");
      return res.data;
    }
  });

  // Fetch user's participated contests (PAID only)
  const { data: participated = [], isLoading: participatedLoading } = useQuery({
    queryKey: ["userParticipated", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/my-participated-contests/${user.email}`);
      return res.data.filter(p => p.paymentStatus === "paid");
    },
    enabled: !!user?.email,
  });

  // Filter and search contests
  const filteredContests = contests.filter(contest => {
    const matchesSearch = contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contest.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isExpired = new Date(contest.deadline) < new Date();
    
    if (filter === "active") return matchesSearch && !isExpired;
    if (filter === "ended") return matchesSearch && isExpired;
    return matchesSearch;
  });

  // Check if user already paid
  const isAlreadyPaid = (contestId) => {
    return participated.some(payment => payment.contestId === contestId);
  };

  if (contestsLoading || participatedLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50">
        <span className="loading loading-infinity loading-lg text-indigo-600"></span>
        <p className="mt-4 text-gray-600 animate-pulse">Loading contests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      <title>All Contest | Create Arena</title>
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🏆 All Contests
          </h1>
          <p className="text-lg text-indigo-100 mb-8">
            Compete, showcase your skills, and win amazing prizes!
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search contests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { value: "all", label: "All", icon: "📋" },
                { value: "active", label: "Active", icon: "🟢" },
                { value: "ended", label: "Ended", icon: "🔴" }
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    filter === value
                      ? "bg-white text-indigo-600 shadow-lg"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">{contests.length}</div>
            <div className="text-sm text-gray-500">Total Contests</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {contests.filter(c => new Date(c.deadline) > new Date()).length}
            </div>
            <div className="text-sm text-gray-500">Active Now</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{participated.length}</div>
            <div className="text-sm text-gray-500">Your Entries</div>
          </div>
        </div>
      </div>

      {/* Contests Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredContests.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Contests Found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try a different search term" : "No contests available right now"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Showing {filteredContests.length} contest(s)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContests.map((contest) => (
                <ContestCard
                  key={contest._id}
                  contest={contest}
                  alreadyPaid={isAlreadyPaid(contest._id)}
                  navigate={navigate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllContests;