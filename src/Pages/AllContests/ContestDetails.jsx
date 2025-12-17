// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const ContestDetails = () => {
//   const { contestId } = useParams();
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();

//   const { data: contest = null, isLoading: contestLoading, isError: contestError } = useQuery({
//     queryKey: ["contestDetails", contestId],
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/contests/${contestId}`);
//       return res.data;
//     },
//     enabled: !!contestId
//   });

//   const { data: participants = [], isLoading: participantsLoading } = useQuery({
//     queryKey: ["contestParticipants", contestId],
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/contests/${contestId}/participants`);
//       return res.data;
//     },
//     enabled: !!contestId
//   });

  
//   const isUserJoined = participants.some(p => p.email === localStorage.getItem('email'));

//   if (contestLoading || participantsLoading) {
//     return (
//       <div className="flex justify-center mt-20">
//         <span className='loading loading-infinity loading-lg'></span>
//       </div>
//     );
//   }

//   if (contestError || !contest) {
//     return <p className="text-center mt-20 text-red-500">Contest not found</p>;
//   }

//   const handleJoinContest = () => {
//     navigate(`/payment/${contest._id}`);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         <div>
//           <img
//             src={contest.image}
//             alt={contest.name}
//             className="w-[250px] h-[220px] mx-auto rounded-lg border object-cover"
//           />
//         </div>

//         <div>
//           <span className="text-sm text-green-600 font-semibold uppercase">New Contest</span>
//           <h2 className="text-3xl font-bold mt-2">{contest.name}</h2>

//           <div className="flex items-center gap-2 mt-2">
//             <span className="text-yellow-500">★★★★★</span>
//             <span className="text-sm text-gray-500">(4.5)</span>
//           </div>

//           <p className="text-3xl font-semibold text-green-600 mt-4">${contest.price}</p>
//           <p className="text-gray-600 mt-4">{contest.description}</p>

//           <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
//             <p><strong>Type:</strong> {contest.type}</p>
//             <p><strong>Prize:</strong> ${contest.prizeMoney}</p>
//             <p><strong>Deadline:</strong> {contest.deadline}</p>
//             <p><strong>Status:</strong> Open</p>
//           </div>

//           <div className="mt-8">
//             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <span className="text-2xl">👥</span>
//               Participants ({participants.length})
//             </h3>
//             <div className="flex flex-wrap gap-3 mb-6">
//               {participants.slice(0, 12).map((participant) => (
//                 <img
//                   key={participant._id}
//                   src={participant.photoURL || '/default-avatar.png'}
//                   alt={participant.name}
//                   className="w-12 h-12 rounded-full object-cover border-2 border-green-300 hover:border-green-500 transition-all cursor-pointer"
//                   title={`${participant.name} - Joined`}
//                 />
//               ))}
//               {participants.length > 12 && (
//                 <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-dashed border-gray-400">
//                   +{participants.length - 12}
//                 </div>
//               )}
//             </div>
//           </div>

//           <button
//             onClick={handleJoinContest}
//             className="mt-6 w-full py-3 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//             disabled={isUserJoined}
//           >
//             {isUserJoined ? 'Already Joined ✅' : 'Participate / Join Contest'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContestDetails;



import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";

const ContestDetails = () => {
  const { contestId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitLink, setSubmitLink] = useState("");

  // Fetch contest details
  const { data: contest, isLoading: contestLoading } = useQuery({
    queryKey: ["contest", contestId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contests/${contestId}`);
      return res.data;
    },
    enabled: !!contestId,
  });

  // Fetch participants count
  const { data: participants = [] } = useQuery({
    queryKey: ["participants", contestId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contests/${contestId}/participants`);
      return res.data;
    },
    enabled: !!contestId,
  });

  // Fetch user's participation status
  const { data: userPayments = [] } = useQuery({
    queryKey: ["userPayments", user?.email, contestId],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/users/${user.email}/payments`);
      return res.data.filter(p => p.contestId === contestId);
    },
    enabled: !!user?.email && !!contestId,
  });

  // Check if user has paid
  const hasPaid = userPayments.some(p => p.paymentStatus === "paid");
  
  // Check if contest ended
  const isEnded = contest && new Date(contest.deadline) < new Date();
  
  // Find winner
  const winnerPayment = participants.find(p => p.isWinner);
  
  // Submit task handler
  const handleSubmitTask = async () => {
    if (!submitLink.trim()) return;
    
    try {
      await axiosSecure.post(`/contests/${contestId}/submit-task`, {
        submissionLink: submitLink.trim()
      });
      alert("Task submitted successfully!");
      setShowSubmitModal(false);
      setSubmitLink("");
    } catch (error) {
      alert("Failed to submit task");
    }
  };

  if (contestLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (!contest) {
    return <div className="text-center py-20">Contest not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          ← Back to Contests
        </button>

        {/* Contest Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {contest.name}
          </h1>
          
          {/* Participants Count */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl border border-indigo-200">
            <span className="text-2xl">👥</span>
            <span className="text-xl font-bold text-gray-800">
              {participants.length} Participants
            </span>
          </div>
        </div>

        {/* Big Banner Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={contest.image}
            alt={contest.name}
            className="w-full h-96 md:h-[500px] object-cover"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Description & Details */}
          <div className="space-y-8">
            {/* Contest Description */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 Contest Details</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {contest.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Task Details */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 shadow-xl border border-emerald-200">
              <h3 className="text-2xl font-bold mb-6 text-emerald-800 flex items-center gap-3">
                🎯 Task Requirements
              </h3>
              <div className="space-y-4 text-gray-700">
                <p className="whitespace-pre-wrap">{contest.taskDetails || "Task details will be provided here."}</p>
              </div>
            </div>

            {/* Prize & Deadline */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl shadow-xl text-center">
                <div className="text-3xl mb-2">🏆</div>
                <h4 className="text-xl font-bold text-yellow-800 mb-2">Prize Money</h4>
                <p className="text-3xl font-black text-yellow-600">${contest.prizeMoney}</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-xl text-center">
                <h4 className="text-xl font-bold text-indigo-800 mb-4">
                  {isEnded ? "⏰ Contest Ended" : "⏰ Deadline"}
                </h4>
                <div className="text-3xl font-mono font-bold text-indigo-600">
                  {isEnded 
                    ? "ENDED" 
                    : new Date(contest.deadline).toLocaleString()
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions & Winner */}
          <div className="space-y-6">
            {/* Winner Section */}
            {winnerPayment ? (
              <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-8 rounded-3xl shadow-xl border-4 border-emerald-300 text-center">
                <div className="text-5xl mb-4">🥇</div>
                <h3 className="text-2xl font-black text-emerald-800 mb-4">WINNER DECLARED!</h3>
                <img
                  src={winnerPayment.photoURL || "https://via.placeholder.com/80"}
                  alt={winnerPayment.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-emerald-400 shadow-lg"
                />
                <p className="text-xl font-bold text-emerald-700">{winnerPayment.name}</p>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
              <h3 className="text-2xl font-bold mb-8 text-gray-800 text-center">Quick Actions</h3>
              
              {/* Pay/Register Button */}
              <button
                onClick={() => navigate(`/payment/${contestId}`)}
                disabled={hasPaid || isEnded}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transform transition-all duration-300 flex items-center justify-center gap-3 ${
                  hasPaid || isEnded
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                    : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 hover:shadow-2xl hover:-translate-y-1"
                }`}
              >
                {hasPaid ? (
                  "✅ Already Paid"
                ) : isEnded ? (
                  "⏰ Contest Ended"
                ) : (
                  `💳 Pay $${contest.price} & Join`
                )}
              </button>

              {/* Submit Task Button */}
              {hasPaid && !isEnded && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:from-emerald-600 hover:to-green-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  📤 Submit Task
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Task Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Submit Your Task
            </h3>
            
            <div className="space-y-4">
              <textarea
                value={submitLink}
                onChange={(e) => setSubmitLink(e.target.value)}
                placeholder="Paste your submission link here (GitHub, CodePen, Figma, etc.)"
                className="w-full p-4 border-2 border-gray-200 rounded-2xl resize-vertical min-h-[120px] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                rows="4"
              />
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitTask}
                  disabled={!submitLink.trim()}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-2xl font-bold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Task
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmitLink("");
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestDetails;
