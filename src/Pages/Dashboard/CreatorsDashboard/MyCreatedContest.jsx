// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import React from 'react';

// import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
// import Swal from 'sweetalert2';
// import { Link } from "react-router-dom";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import useAuth from "../../../hooks/useAuth";

// const MyCreatedContest = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   // ✅ Fetch creator's contests only
//   const { data: contests = [], isLoading, refetch } = useQuery({
//     queryKey: ['myCreatedContests', user?.email],
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/my-contests?email=${user?.email}`);
//       return res.data;
//     },
//     enabled: !!user?.email
//   });

//   // ✅ Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: async (contestId) => {
//       return await axiosSecure.delete(`/contests/${contestId}`);
//     },
//     onSuccess: () => {
//       Swal.fire('Success!', 'Contest deleted successfully', 'success');
//       queryClient.invalidateQueries({ queryKey: ['myCreatedContests'] });
//       refetch();
//     },
//     onError: (error) => {
//       Swal.fire('Error!', error.response?.data?.message || 'Delete failed', 'error');
//     }
//   });

//   const handleDelete = (contest) => {
//     Swal.fire({
//       title: `Delete "${contest.name}"?`,
//       text: "This action cannot be undone!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#ef4444',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, delete it!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deleteMutation.mutate(contest._id);
//       }
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <span className='loading loading-infinity loading-lg'></span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-base-200 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-center mb-4">My Created Contests</h1>
//           <p className="text-center text-xl text-gray-600">
//             Manage your contests and view submissions
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-bold">{contests.length}</h3>
//             <p className="text-blue-100">Total Contests</p>
//           </div>
//           <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-bold">
//               {contests.filter(c => c.status === 'pending').length}
//             </h3>
//             <p className="text-green-100">Pending</p>
//           </div>
//           <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-bold">
//               {contests.filter(c => c.status === 'confirmed').length}
//             </h3>
//             <p className="text-emerald-100">Confirmed</p>
//           </div>
//           <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-bold">
//               {contests.filter(c => c.status === 'rejected').length}
//             </h3>
//             <p className="text-red-100">Rejected</p>
//           </div>
//         </div>

//         {/* Contests Table */}
//         <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table w-full">
//               <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
//                 <tr>
//                   <th>Image</th>
//                   <th>Name</th>
//                   <th>Price</th>
//                   <th>Prize</th>
//                   <th>Deadline</th>
//                   <th>Status</th>
//                   <th>Participants</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {contests.map((contest) => (
//                   <tr key={contest._id} className="hover:bg-gray-50 transition">
//                     <td>
//                       <img
//                         src={contest.image}
//                         alt={contest.name}
//                         className="w-16 h-16 rounded-lg object-cover"
//                       />
//                     </td>
//                     <td>
//                       <div>
//                         <div className="font-bold">{contest.name}</div>
//                         <div className="text-sm opacity-75">{contest.type}</div>
//                       </div>
//                     </td>
//                     <td className="font-bold text-lg">${contest.price}</td>
//                     <td className="font-bold text-green-600">${contest.prizeMoney}</td>
//                     <td>
//                       <div className="badge badge-info badge-sm">
//                         {new Date(contest.deadline).toLocaleDateString()}
//                       </div>
//                     </td>
//                     <td>
//                       {contest.status === 'pending' && (
//                         <span className="badge badge-warning gap-2">
//                           Pending
//                         </span>
//                       )}
//                       {contest.status === 'confirmed' && (
//                         <span className="badge badge-success gap-2">
//                           Confirmed
//                         </span>
//                       )}
//                       {contest.status === 'rejected' && (
//                         <span className="badge badge-error gap-2">
//                           Rejected
//                         </span>
//                       )}
//                     </td>
//                     <td className="font-semibold">
//                       {/* Participants count */}
//                       <span className="badge badge-ghost">
//                         {contest.participantsCount || 0}
//                       </span>
//                     </td>
//                     <td className="flex gap-2">
//                       {/* See Submissions - Always visible */}
//                       <Link
//                         to={`/submissions/${contest._id}`}
//                         className="btn btn-sm btn-info"
//                         title="View Submissions"
//                       >
//                         <FaEye />
//                       </Link>

//                       {/* Edit - Only for Pending */}
//                       {contest.status === 'pending' && (
//                         <Link
//                           to={`/edit-contest/${contest._id}`}
//                           className="btn btn-sm btn-warning"
//                           title="Edit Contest"
//                         >
//                           <FaEdit />
//                         </Link>
//                       )}

//                       {/* Delete - Only for Pending */}
//                       {contest.status === 'pending' && (
//                         <button
//                           onClick={() => handleDelete(contest)}
//                           className="btn btn-sm btn-error"
//                           title="Delete Contest"
//                           disabled={deleteMutation.isPending}
//                         >
//                           {deleteMutation.isPending ? (
//                             <span className="loading loading-spinner"></span>
//                           ) : (
//                             <FaTrash />
//                           )}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {contests.length === 0 && !isLoading && (
//           <div className="text-center py-20">
//             <h3 className="text-2xl font-bold text-gray-500 mb-4">No contests created yet</h3>
//             <Link to="/add_contest" className="btn btn-primary btn-lg">
//               Create Your First Contest
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyCreatedContest;













import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyCreatedContest = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedContest, setSelectedContest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // ================= FETCH =================
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["myCreatedContests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-contests?email=${user?.email}`
      );
      return res.data;
    }
  });

  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      axiosSecure.delete(`/contests/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "Contest deleted successfully", "success");
      queryClient.invalidateQueries(["myCreatedContests"]);
    }
  });

  const handleDelete = (contest) => {
    Swal.fire({
      title: `Delete "${contest.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    }).then((res) => {
      if (res.isConfirmed) {
        deleteMutation.mutate(contest._id);
      }
    });
  };

  // ================= UPDATE =================
  const updateMutation = useMutation({
    mutationFn: async (updatedData) =>
      axiosSecure.patch(
        `/contests/${selectedContest._id}`,
        updatedData
      ),
    onSuccess: () => {
      Swal.fire("Success!", "Contest updated", "success");
      setIsEditOpen(false);
      queryClient.invalidateQueries(["myCreatedContests"]);
    }
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedData = {
      name: form.name.value,
      price: form.price.value,
      prizeMoney: form.prizeMoney.value
    };

    updateMutation.mutate(updatedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          My Created Contests
        </h1>

        <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
          <table className="table w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Prize</th>
                <th>Status</th>
                <th>Participants</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {contests.map((contest) => (
                <tr key={contest._id}>
                  <td>
                    <img
                      src={contest.image}
                      alt=""
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>

                  <td>
                    <p className="font-bold">{contest.name}</p>
                    <small>{contest.type}</small>
                  </td>

                  <td>${contest.price}</td>
                  <td className="text-green-600 font-bold">
                    ${contest.prizeMoney}
                  </td>

                  <td>
                    <span className={`badge ${
                      contest.status === "pending"
                        ? "badge-warning"
                        : contest.status === "confirmed"
                        ? "badge-success"
                        : "badge-error"
                    }`}>
                      {contest.status}
                    </span>
                  </td>

                  <td>{contest.participantsCount || 0}</td>

                  <td className="flex gap-2">
                    {/* DETAILS */}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setSelectedContest(contest);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <FaEye />
                    </button>

                    {/* EDIT */}
                    {contest.status === "pending" && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          setSelectedContest(contest);
                          setIsEditOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                    )}

                    {/* DELETE */}
                    {contest.status === "pending" && (
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(contest)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= DETAILS MODAL ================= */}
        {isDetailsOpen && selectedContest && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-2xl mb-3">
                {selectedContest.name}
              </h3>

              <img
                src={selectedContest.image}
                className="rounded mb-4 w-full h-52 object-cover"
              />

              <p><b>Type:</b> {selectedContest.type}</p>
              <p><b>Price:</b> ${selectedContest.price}</p>
              <p><b>Prize:</b> ${selectedContest.prizeMoney}</p>
              <p><b>Status:</b> {selectedContest.status}</p>
              <p>
                <b>Deadline:</b>{" "}
                {new Date(selectedContest.deadline).toLocaleDateString()}
              </p>

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* ================= EDIT MODAL ================= */}
        {isEditOpen && selectedContest && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-2xl mb-4">
                Edit Contest
              </h3>

              <form onSubmit={handleUpdate}>
                <input
                  name="name"
                  defaultValue={selectedContest.name}
                  className="input input-bordered w-full mb-3"
                />

                <input
                  name="price"
                  type="number"
                  defaultValue={selectedContest.price}
                  className="input input-bordered w-full mb-3"
                />

                <input
                  name="prizeMoney"
                  type="number"
                  defaultValue={selectedContest.prizeMoney}
                  className="input input-bordered w-full mb-4"
                />

                <div className="modal-action">
                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default MyCreatedContest;
