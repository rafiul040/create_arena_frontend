import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { FaEye, FaTrophy, FaUsers, FaPlus, FaEdit } from "react-icons/fa";

const SubmissionTask = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState("all"); 
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [assignTaskModal, setAssignTaskModal] = useState(false);
  const [assignTaskData, setAssignTaskData] = useState({});

  
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["creatorSubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/creator-submissions?email=${user.email}`);
      return res.data;
    },
  });

  
  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedTab === "pending") {
      return !sub.isWinner && !sub.contestWinnerDeclared;
    }
    if (selectedTab === "winners") {
      return sub.isWinner;
    }
    return true; 
  });

  const submissionsByContest = filteredSubmissions.reduce((acc, sub) => {
    if (!acc[sub.contestId]) {
      acc[sub.contestId] = {
        contestName: sub.contestName,
        submissions: [],
      };
    }
    acc[sub.contestId].submissions.push(sub);
    return acc;
  }, {});

  
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
      queryClient.invalidateQueries(["creatorSubmissions"]);
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    },
  });

  
  const assignTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      return axiosSecure.post("/assign-task", taskData);
    },
    onSuccess: () => {
      Swal.fire("Task Assigned!", "Task assigned to participant successfully", "success");
      setAssignTaskModal(false);
      setAssignTaskData({});
      queryClient.invalidateQueries(["creatorSubmissions"]);
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    },
  });

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

  const handleAssignTask = (submission) => {
    setAssignTaskData({
      contestId: submission.contestId,
      participantEmail: submission.participantEmail,
      participantName: submission.participantName,
    });
    setAssignTaskModal(true);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const taskData = {
      ...assignTaskData,
      taskTitle: form.taskTitle.value,
      taskDescription: form.taskDescription.value,
      deadline: form.deadline.value,
    };
    assignTaskMutation.mutate(taskData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-500">
        <h2 className="text-4xl font-bold mb-4">No submissions yet</h2>
        <p>Your contests have no participant submissions</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Contest Submissions</h1>
          <div className="tabs tabs-boxed">
            <a
              className={`tab ${selectedTab === "all" ? "tab-active" : ""}`}
              onClick={() => setSelectedTab("all")}
            >
              All ({submissions.length})
            </a>
            <a
              className={`tab ${selectedTab === "pending" ? "tab-active" : ""}`}
              onClick={() => setSelectedTab("pending")}
            >
              Pending ({filteredSubmissions.filter(s => !s.isWinner && !s.contestWinnerDeclared).length})
            </a>
            <a
              className={`tab ${selectedTab === "winners" ? "tab-active" : ""}`}
              onClick={() => setSelectedTab("winners")}
            >
              Winners ({filteredSubmissions.filter(s => s.isWinner).length})
            </a>
          </div>
        </div>

      
        <div className="space-y-8">
          {Object.entries(submissionsByContest).map(([contestId, data]) => (
            <div key={contestId} className="bg-white rounded-xl shadow-xl">
              <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{data.contestName}</h2>
                  <span className="badge badge-lg badge-secondary">
                    {data.submissions.length} Participants
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Participant</th>
                      <th>Email</th>
                      <th>Submitted At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.submissions.map((sub) => (
                      <tr key={sub._id} className="hover">
                        <td className="font-semibold">{sub.participantName}</td>
                        <td>{sub.participantEmail}</td>
                        <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                        <td>
                          {sub.isWinner ? (
                            <span className="badge badge-success gap-2">
                              <FaTrophy className="w-4 h-4" />
                              Winner
                            </span>
                          ) : sub.contestWinnerDeclared ? (
                            <span className="badge badge-warning badge-sm">Winner Declared</span>
                          ) : (
                            <span className="badge badge-ghost">Pending</span>
                          )}
                        </td>
                        <td className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-info" 
                            onClick={() => setSelectedSubmission(sub)}
                          >
                            <FaEye /> View
                          </button>
                          
                          {!sub.isWinner && !sub.contestWinnerDeclared && (
                            <>
                              <button 
                                className="btn btn-sm btn-success" 
                                onClick={() => handleDeclareWinner(sub)}
                                disabled={declareWinnerMutation.isLoading}
                              >
                                {declareWinnerMutation.isLoading ? (
                                  <span className="loading loading-spinner"></span>
                                ) : (
                                  <FaTrophy className="w-4 h-4 mr-1" />
                                )}
                                Winner
                              </button>
                              
                              
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

    
        {selectedSubmission && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-xl">
              <h3 className="font-bold text-2xl mb-4">
                Submission Details - {selectedSubmission.contestName}
              </h3>
              <div className="space-y-3">
                <p><b>Name:</b> {selectedSubmission.participantName}</p>
                <p><b>Email:</b> {selectedSubmission.participantEmail}</p>
                <div className="p-4 bg-base-200 rounded-lg">
                  <p className="font-semibold mb-2">Task Submission:</p>
                  <p className="whitespace-pre-wrap">{selectedSubmission.taskText}</p>
                </div>
                {selectedSubmission.taskFile && (
                  <a 
                    href={selectedSubmission.taskFile} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-link btn-sm"
                  >
                    📎 View File Attachment
                  </a>
                )}
              </div>
              <div className="modal-action">
                <button className="btn" onClick={() => setSelectedSubmission(null)}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

      
        {assignTaskModal && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-2xl mb-4">
                Assign Task to {assignTaskData.participantName}
              </h3>
              <form onSubmit={handleTaskSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Task Title</span>
                  </label>
                  <input 
                    name="taskTitle" 
                    type="text" 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Task Description</span>
                  </label>
                  <textarea 
                    name="taskDescription" 
                    className="textarea textarea-bordered w-full" 
                    rows={4}
                    required
                  ></textarea>
                </div>
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Deadline</span>
                  </label>
                  <input 
                    name="deadline" 
                    type="datetime-local" 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                <div className="modal-action">
                  
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => {
                      setAssignTaskModal(false);
                      setAssignTaskData({});
                    }}
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

export default SubmissionTask;
