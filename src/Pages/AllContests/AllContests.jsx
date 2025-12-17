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




import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AllContests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

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
      // ✅ ONLY paid participations block joining
      return res.data.filter(p => p.paymentStatus === "paid");
    },
    enabled: !!user?.email,
  });

  if (contestsLoading || participatedLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  // ✅ Check if user ALREADY PAID for this contest
  const isAlreadyPaid = (contestId) => {
    return participated.some(payment => payment.contestId === contestId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <title>All Contest | Create Arena</title>
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        All Approved Contests
      </h2>

      {contests.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-lg">
          No contests available right now
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contests.map((contest) => {
            const alreadyPaid = isAlreadyPaid(contest._id);
            
            return (
              <div
                key={contest._id}
                className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900">
                    {contest.name}
                  </h3>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-blue-500">📋</span>
                      Type: <span className="font-medium">{contest.type}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">💵</span>
                      Entry: <span className="font-bold text-green-600">${contest.price}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-yellow-500">🏆</span>
                      Prize: <span className="font-bold text-yellow-600">${contest.prizeMoney}</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <span className="inline-block px-4 py-2 text-xs font-bold rounded-full bg-green-100 text-green-800">
                      ✅ Approved
                    </span>
                  </div>

                  {/* ✅ PAID USERS: DISABLED BUTTON + CLEAR MESSAGE */}
                  {alreadyPaid ? (
                    <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl text-center">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-3xl">🚫</span>
                        <div>
                          <h4 className="font-bold text-lg text-red-800">Already Paid & Joined</h4>
                          <p className="text-sm text-red-700 mt-1">Payment completed successfully</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/dashboard/my_participate_contest")}
                        className="w-full btn btn-success"
                        disabled={false}
                      >
                        👉 View My Contests
                      </button>
                    </div>
                  ) : (
                    /* ✅ NOT PAID: Normal Join Button */
                    <button
                      onClick={() => navigate(`/contests/${contest._id}`)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-indigo-600 hover:to-blue-700 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      💳 Pay ${contest.price} & Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllContests;
