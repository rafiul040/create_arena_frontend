import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaEye, FaUsers, FaTrophy } from "react-icons/fa";
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
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);





  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["myCreatedContests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-contests?email=${user.email}`);
      return res.data;
    }
  });


  // const { data: contestParticipants = [] } = useQuery({
  //   queryKey: ["contestParticipants", selectedContest?._id],
  //   enabled: !!selectedContest?._id && isSubmissionsOpen,
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(`/contests/${selectedContest._id}/participants`);
  //     return res.data;
  //   }
  // });
  const { data: contestParticipants = [] } = useQuery({
  queryKey: ["contestParticipants", selectedContest?._id],
  enabled: !!selectedContest?._id && isSubmissionsOpen,
  queryFn: async () => {
    const res = await axiosSecure.get(`/contests/${selectedContest._id}/participants`);
    return res.data;
  }
});




const { data: contestSubmissions = [] } = useQuery({
  queryKey: ["contestSubmissions", selectedContest?._id],
  enabled: !!selectedContest?._id && isSubmissionsOpen,
  queryFn: async () => {
    const res = await axiosSecure.get(
      `/creator-submissions?email=${user.email}&contestId=${selectedContest._id}`
    );
    return res.data;
  }
});










  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/contests/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "Contest deleted successfully", "success");
      queryClient.invalidateQueries(["myCreatedContests"]);
    }
  });

  const declareWinnerMutation = useMutation({
    mutationFn: async (submission) => {
      return axiosSecure.patch("/declare-winner", {
        contestId: submission.contestId,
        _id: submission._id,
        participantEmail: submission.participantEmail,
      });
    },
    onSuccess: () => {
      Swal.fire("Winner Declared!", "Winner selected successfully", "success");
      setSelectedSubmission(null);
      queryClient.invalidateQueries({ queryKey: ["contestSubmissions", selectedContest?._id] });
      queryClient.invalidateQueries({ queryKey: ["contestParticipants", selectedContest?._id] });
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    },
  });

  const handleDelete = (contest) => {
    Swal.fire({
      title: `Delete "${contest.name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    }).then((res) => {
      if (res.isConfirmed) {
        deleteMutation.mutate(contest._id);
      }
    });
  };

  const handleDeclareWinner = (submission) => {
    Swal.fire({
      title: "Declare Winner?",
      text: "You can declare only one winner for this contest!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
    }).then((res) => {
      if (res.isConfirmed) {
        declareWinnerMutation.mutate(submission);
      }
    });
  };

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => 
      axiosSecure.patch(`/contests/${selectedContest._id}/edit`, updatedData),
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
      price: parseFloat(form.price.value),
      prizeMoney: parseFloat(form.prizeMoney.value)
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">My Created Contests</h1>
        
        <div className="overflow-x-auto rounded-xl shadow-xl">
          <table className="table w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Entry Fee</th>
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
                      alt={contest.name} 
                      className="w-14 h-14 rounded object-cover" 
                    />
                  </td>
                  <td>
                    <p className="font-bold">{contest.name}</p>
                    <small className="text-gray-500">{contest.type}</small>
                  </td>
                  <td>${contest.price}</td>
                  <td className="text-green-600 font-bold">
                    ${contest.prizeMoney}
                  </td>
                  <td>
                    <span className={`badge p-2 rounded-2xl ${
                      contest.status === "pending" 
                        ? "badge-warning" 
                        : contest.status === "approved" 
                        ? "badge-success" 
                        : "badge-error"
                    }`}>
                      {contest.status === "approved" ? "Approved" : contest.status}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-info p-2 rounded-2xl">
                      {contest.participantsCount || 0} Participants
                    </span>
                  </td>
                  <td className="flex mt-3 gap-2 flex-wrap">
                    <button 
                      className="btn btn-sm btn-info border-none rounded-3xl" 
                      onClick={() => {
                        setSelectedContest(contest);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <FaEye />
                    </button>
                    
                    <button 
                      className="btn btn-sm btn-primary border-none rounded-full" 
                      onClick={() => {
                        setSelectedContest(contest);
                        setIsSubmissionsOpen(true);
                      }}
                    >
                      <FaUsers /> Submissions
                    </button>

                    {contest.status === "pending" && (
                      <>
                        <button 
                          className="btn btn-sm btn-warning" 
                          onClick={() => {
                            setSelectedContest(contest);
                            setIsEditOpen(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-sm btn-error" 
                          onClick={() => handleDelete(contest)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

  
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
              <div className="space-y-3 text-sm">
                <p><b>Type:</b> {selectedContest.type}</p>
                <p><b>Status:</b> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                    selectedContest.status === "approved" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {selectedContest.status}
                  </span>
                </p>
                <p><b>Participants:</b> {selectedContest.participantsCount || 0}</p>
                <p><b>Entry Fee:</b> ${selectedContest.price}</p>
                <p><b>Prize Money:</b> ${selectedContest.prizeMoney}</p>
                <p><b>Deadline:</b> {new Date(selectedContest.deadline).toLocaleString()}</p>
              </div>
              <div className="modal-action">
                <button className="btn" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

      
        {isEditOpen && selectedContest && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-2xl mb-4">Edit Contest</h3>
              <form onSubmit={handleUpdate}>
                <input 
                  name="name" 
                  defaultValue={selectedContest.name}
                  className="input input-bordered w-full mb-3" 
                  required 
                />
                <input 
                  name="price" 
                  type="number" 
                  defaultValue={selectedContest.price}
                  className="input input-bordered w-full mb-3" 
                  required 
                />
                <input 
                  name="prizeMoney" 
                  type="number" 
                  defaultValue={selectedContest.prizeMoney}
                  className="input input-bordered w-full mb-4" 
                  required 
                />
                <div className="modal-action">
                  <button type="submit" className="btn btn-success" disabled={updateMutation.isLoading}>
                    {updateMutation.isLoading ? "Saving..." : "Save"}
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

    
        {isSubmissionsOpen && selectedContest && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-7xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h3 className="font-bold text-2xl">
                    Submissions – {selectedContest.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Participants: {contestParticipants.length} | 
                    Submissions: {contestSubmissions.length}
                  </p>
                </div>
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={() => {
                    setIsSubmissionsOpen(false);
                    setSelectedSubmission(null);
                  }}
                >
                  Close
                </button>
              </div>

    
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
          
                <div className="bg-base-100 p-6 rounded-xl">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaUsers className="text-indigo-600" /> Participants ({contestParticipants.length})
                  </h4>
                  {contestParticipants.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No participants yet</p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {contestParticipants.map((participant, index) => (
                        <div key={participant._id} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {participant.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{participant.name}</p>
                            <p className="text-xs text-gray-500 truncate">{participant.email}</p>
                          </div>
                          <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

            
                <div className="bg-base-100 p-6 rounded-xl">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaTrophy className="text-yellow-600" /> Submissions ({contestSubmissions.length})
                  </h4>
                  {contestSubmissions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No submissions yet</p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {contestSubmissions.map((submission, index) => (
                        <div key={submission._id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {submission.participantName?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{submission.participantName}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(submission.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            submission.isWinner 
                              ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white" 
                              : submission.contestWinnerDeclared
                              ? "bg-orange-400 text-white" 
                              : "bg-gray-400 text-white"
                          }`}>
                            {submission.isWinner ? "🥇 WINNER" : submission.contestWinnerDeclared ? "🏅 Declared" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default MyCreatedContest;
