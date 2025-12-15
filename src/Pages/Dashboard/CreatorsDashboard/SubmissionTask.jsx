import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const SubmissionTask = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // ================= FETCH SUBMISSIONS =================
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["creatorSubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/creator-submissions?email=${user.email}`
      );
      return res.data;
    }
  });

  // ================= DECLARE WINNER =================
  const declareWinnerMutation = useMutation({
    mutationFn: async (submission) => {
      return axiosSecure.patch(`/declare-winner`, {
        contestId: submission.contestId,
        submissionId: submission._id,
        winnerEmail: submission.participantEmail
      });
    },
    onSuccess: () => {
      Swal.fire("Winner Declared!", "Winner selected successfully", "success");
      setSelectedSubmission(null);
      queryClient.invalidateQueries(["creatorSubmissions"]);
    }
  });

  const handleDeclareWinner = (submission) => {
    Swal.fire({
      title: "Declare Winner?",
      text: "You can declare only one winner for this contest!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a"
    }).then((res) => {
      if (res.isConfirmed) {
        declareWinnerMutation.mutate(submission);
      }
    });
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

        <h1 className="text-4xl font-bold text-center mb-8">
          Submitted Tasks
        </h1>

        <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
          <table className="table w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th>Contest</th>
                <th>Participant</th>
                <th>Email</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover">
                  <td className="font-semibold">
                    {sub.contestName}
                  </td>
                  <td>{sub.participantName}</td>
                  <td>{sub.participantEmail}</td>
                  <td>
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </td>

                  <td>
                    {sub.isWinner ? (
                      <span className="badge badge-success">
                        Winner
                      </span>
                    ) : (
                      <span className="badge badge-ghost">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      View
                    </button>

                    {!sub.isWinner && !sub.contestWinnerDeclared && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleDeclareWinner(sub)}
                      >
                        Declare Winner
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= DETAILS MODAL ================= */}
        {selectedSubmission && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-xl">
              <h3 className="font-bold text-2xl mb-4">
                Submission Details
              </h3>

              <p><b>Contest:</b> {selectedSubmission.contestName}</p>
              <p><b>Name:</b> {selectedSubmission.participantName}</p>
              <p><b>Email:</b> {selectedSubmission.participantEmail}</p>

              <div className="mt-3 p-3 bg-base-200 rounded">
                <p className="font-semibold mb-1">Submitted Task:</p>
                <p>{selectedSubmission.taskText}</p>
              </div>

              {selectedSubmission.taskFile && (
                <a
                  href={selectedSubmission.taskFile}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-link mt-2"
                >
                  View Attachment
                </a>
              )}

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

        {submissions.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-2xl font-bold">
              No submissions yet
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionTask;
