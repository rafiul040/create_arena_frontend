
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import { toast } from "react-hot-toast";

// const ManageContests = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   // ================= FETCH ALL CONTESTS =================
//   const { data: contests = [], isLoading } = useQuery({
//     queryKey: ["manageContests"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/contests");
//       return res.data;
//     },
//   });

//   // ================= APPROVE CONTEST =================
//   const approveContestMutation = useMutation({
//     mutationFn: (id) =>
//       axiosSecure.patch(`/contests/${id}`, { status: "approved" }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["manageContests"]);
//       toast.success("Contest Approved!");
//     },
//   });

//   // ================= REJECT CONTEST =================
//   const rejectContestMutation = useMutation({
//     mutationFn: (id) =>
//       axiosSecure.patch(`/contests/${id}`, { status: "rejected" }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["manageContests"]);
//       toast.success("Contest Rejected!");
//     },
//   });

//   // ================= DELETE CONTEST =================
//   const deleteContestMutation = useMutation({
//     mutationFn: (id) => axiosSecure.delete(`/contests/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["manageContests"]);
//       toast.success("Contest Deleted!");
//     },
//   });

//   if (isLoading) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <title>Manage Contest | Create Arena</title>

//       {/* ================= DASHBOARD STATS ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white shadow rounded-lg p-5">
//           <h4 className="text-sm text-gray-500">Pending Contests</h4>
//           <p className="text-2xl font-bold text-yellow-500">
//             {contests.filter((c) => c.status === "pending").length}
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-lg p-5">
//           <h4 className="text-sm text-gray-500">Approved Contests</h4>
//           <p className="text-2xl font-bold text-green-500">
//             {contests.filter((c) => c.status === "approved").length}
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-lg p-5">
//           <h4 className="text-sm text-gray-500">Rejected Contests</h4>
//           <p className="text-2xl font-bold text-red-500">
//             {contests.filter((c) => c.status === "rejected").length}
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-lg p-5">
//           <h4 className="text-sm text-gray-500">Total Contests</h4>
//           <p className="text-2xl font-bold text-blue-500">
//             {contests.length}
//           </p>
//         </div>
//       </div>

//       {/* ================= CONTEST TABLE ================= */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <h2 className="text-lg font-semibold p-5 border-b">
//           Manage Contests
//         </h2>

//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="px-6 py-3">Contest Name</th>
//               <th className="px-6 py-3">Type</th>
//               <th className="px-6 py-3">Email</th>
//               <th className="px-6 py-3 text-center">Price</th>
//               <th className="px-6 py-3 text-center">Prize</th>
//               <th className="px-6 py-3 text-center">Status</th>
//               <th className="px-6 py-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {contests.length > 0 ? (
//               contests.map((contest) => (
//                 <tr
//                   key={contest._id}
//                   className="border-b border-gray-200 hover:bg-gray-50"
//                 >
//                   <td className="px-6 py-4 font-medium">
//                     {contest.name}
//                   </td>
//                   <td className="px-6 py-4">{contest.type}</td>
//                   <td className="px-6 py-4">{contest.email}</td>
//                   <td className="px-6 py-4 text-center">
//                     ${contest.price}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     ${contest.prizeMoney}
//                   </td>

//                   {/* STATUS */}
//                   <td className="px-6 py-4 text-center">
//                     {contest.status === "pending" && (
//                       <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">
//                         Pending
//                       </span>
//                     )}
//                     {contest.status === "approved" && (
//                       <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">
//                         Approved
//                       </span>
//                     )}
//                     {contest.status === "rejected" && (
//                       <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
//                         Rejected
//                       </span>
//                     )}
//                   </td>

//                   {/* ACTION BUTTONS */}
//                   <td className="px-6 py-4 flex justify-center gap-2">
//                     <button
//                       disabled={contest.status !== "pending"}
//                       onClick={() =>
//                         approveContestMutation.mutate(contest._id)
//                       }
//                       className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
//                     >
//                       Approve
//                     </button>

//                     <button
//                       disabled={contest.status !== "pending"}
//                       onClick={() =>
//                         rejectContestMutation.mutate(contest._id)
//                       }
//                       className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50"
//                     >
//                       Reject
//                     </button>

//                     <button
//                       onClick={() => {
//                         if (
//                           window.confirm(
//                             "Are you sure you want to delete this contest?"
//                           )
//                         ) {
//                           deleteContestMutation.mutate(contest._id);
//                         }
//                       }}
//                       className="px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-800"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center py-6 text-gray-500">
//                   No contests found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ManageContests;




import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const ManageContests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["manageContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contests");
      return res.data;
    },
  });

  const approveContestMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.patch(`/contests/${id}`, { status: "approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["manageContests"]);
      toast.success("Contest Approved!");
    },
  });

  const rejectContestMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.patch(`/contests/${id}`, { status: "rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["manageContests"]);
      toast.success("Contest Rejected!");
    },
  });

  const deleteContestMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/contests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["manageContests"]);
      toast.success("Contest Deleted!");
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <title>Manage Contest | Create Arena</title>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-gray-400">Pending Contests</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {contests.filter(c => c.status === "pending").length}
              </h2>
              <span className="badge badge-warning badge-outline">Pending</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-gray-400">Approved Contests</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {contests.filter(c => c.status === "approved").length}
              </h2>
              <span className="badge badge-success badge-outline">Approved</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-gray-400">Rejected Contests</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {contests.filter(c => c.status === "rejected").length}
              </h2>
              <span className="badge badge-error badge-outline">Rejected</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-gray-400">Total Contests</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{contests.length}</h2>
              <span className="badge badge-info badge-outline">All</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-1">Country Campaigns</h2>
          <p className="text-sm text-gray-400 mb-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting
          </p>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Prize</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {contests.map((contest) => (
                  <tr key={contest._id}>
                    <td className="font-medium">{contest.name}</td>
                    <td>{contest.type}</td>
                    <td>{contest.email}</td>
                    <td className="text-center">${contest.price}</td>
                    <td className="text-center">${contest.prizeMoney}</td>

                    <td className="text-center">
                      {contest.status === "pending" && (
                        <span className="badge badge-warning">Pending</span>
                      )}
                      {contest.status === "approved" && (
                        <span className="badge badge-success">Approved</span>
                      )}
                      {contest.status === "rejected" && (
                        <span className="badge badge-error">Rejected</span>
                      )}
                    </td>

                    <td className="text-center space-x-2">
                      <button
                        disabled={contest.status !== "pending"}
                        onClick={() =>
                          approveContestMutation.mutate(contest._id)
                        }
                        className="btn btn-xs btn-success"
                      >
                        Approve
                      </button>

                      <button
                        disabled={contest.status !== "pending"}
                        onClick={() =>
                          rejectContestMutation.mutate(contest._id)
                        }
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() =>
                          window.confirm("Delete this contest?") &&
                          deleteContestMutation.mutate(contest._id)
                        }
                        className="btn btn-xs btn-neutral"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {contests.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-400">
                      No contests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContests;
