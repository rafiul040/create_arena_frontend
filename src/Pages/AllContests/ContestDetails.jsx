import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ContestDetails = () => {
  const { contestId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()
  const queryClient = useQueryClient(); 
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitLink, setSubmitLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 

  if (!contestId) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-6xl mb-4 text-red font-bold">X</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Contest Not Found</h1>
        <button onClick={() => navigate('/contests')} className="btn btn-primary px-8 py-3">
          ← Back to Contests
        </button>
      </div>
    );
  }

  const { data: contest, isLoading: contestLoading, isError } = useQuery({
    queryKey: ["contest", contestId],
    queryFn: () => axiosSecure.get(`/contests/${contestId}`).then(res => res.data),
  });

  const { data: participants = [] } = useQuery({
    queryKey: ["participants", contestId],
    queryFn: () => axiosSecure.get(`/contests/${contestId}/participants`).then(res => res.data),
  });

  const { data: userPayments = [] } = useQuery({
    queryKey: ["userPayments", user?.email, contestId],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/users/${user.email}/payments`);
      return res.data.filter(p => p.contestId === contestId);
    },
    enabled: !!user?.email,
  });

  
  const hasSubmittedTask = userPayments.some(payment => 
    payment.submissions && payment.submissions.length > 0
  );

  const hasPaid = userPayments.some(p => p.paymentStatus === "paid");
  const isEnded = contest && new Date(contest.deadline) < new Date();
  const paymentStatus = searchParams.get('payment');

  const handleStripePayment = async () => {
    if (!user?.email || !contest) return;
    try {
      const response = await axiosSecure.post("/create-checkout-session", {
        price: contest.price,
        contestId: contestId,
        email: user.email,
        name: contest.name
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Payment init failed:", error);
      alert("Payment initialization failed");
    }
  };

  const handleSubmitTask = async () => {
    if (!submitLink.trim() || isSubmitting) return; 

    setIsSubmitting(true);
    try {
      await axiosSecure.post(`/contests/${contestId}/submit-task`, {
        submissionLink: submitLink.trim()
      });
      
      
      queryClient.invalidateQueries(["userPayments", user?.email, contestId]);
      queryClient.invalidateQueries(["participants", contestId]);
      
      alert("Task submitted successfully!");
      setShowSubmitModal(false);
      setSubmitLink("");
    } catch (error) {
      alert("Failed to submit task");
    } finally {
      setIsSubmitting(false); 
    }
  };

  if (contestLoading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-infinity loading-lg"></span></div>;

  if (isError || !contest) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold mb-4">Contest Not Found</h1>
        <button onClick={() => navigate('/contests')} className="btn btn-primary">← Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      {paymentStatus === 'success' && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-green-100 border-2 border-green-400 text-green-800 p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-4xl">✅</span>
              <div>
                <h3 className="text-2xl font-bold">Payment Successful!</h3>
                <p>You are now enrolled. Submit your task below.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold">
          ← Back to Contests
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {contest.name}
          </h1>
          <div className="inline-flex items-center gap-2 20/80 px-6 py-3 rounded-2xl shadow-xl">
            <span className="text-2xl">👥</span>
            <span className="text-xl font-bold">{participants.length} Participants</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className=" rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">📝 Contest Details</h2>
              <p className=" whitespace-pre-wrap">{contest.description}</p>
            </div>

            <div className=" rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-emerald-800">🎯 Task</h3>
              <p className="whitespace-pre-wrap">{contest.taskDetails}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className=" rounded-3xl p-8 shadow-xl border-2 border-gray-100">
              <h3 className="text-2xl font-bold mb-8 text-center">Quick Actions</h3>

            
              <button
                onClick={handleStripePayment}
                disabled={hasPaid || isEnded}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                  hasPaid || isEnded
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 hover:shadow-2xl hover:-translate-y-1"
                }`}
              >
                {hasPaid ? "✅ Already Paid" : isEnded ? "⏰ Contest Ended" : `💳 Pay $${contest.price}`}
              </button>

             
              {hasPaid && !isEnded && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  disabled={hasSubmittedTask} 
                  className={`w-full mt-4 py-4 px-6 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                    hasSubmittedTask
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 hover:shadow-2xl hover:-translate-y-1"
                  }`}
                >
                  {hasSubmittedTask ? (
                    <>
                      <span className="text-2xl"></span>
                      Submitted
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">📤</span>
                      Submit Task
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      
      {showSubmitModal && !hasSubmittedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center">Submit Your Task</h3>
            
            
            {hasSubmittedTask && (
              <div className="bg-green-100 border-2 border-green-400 text-green-800 p-6 rounded-2xl mb-6 text-center">
                <span className="text-3xl block mb-2">✅</span>
                <p className="font-bold">Already Submitted!</p>
              </div>
            )}

            <textarea
              value={submitLink}
              onChange={(e) => setSubmitLink(e.target.value)}
              placeholder="Paste your submission link (GitHub, CodePen, Figma, etc.)"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl min-h-[120px] focus:border-indigo-400 focus:ring-2 focus:outline-none resize-vertical"
              rows="4"
              disabled={isSubmitting}
            />
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmitTask}
                disabled={!submitLink.trim() || isSubmitting || hasSubmittedTask}
                className={`flex-1 py-3 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting || !submitLink.trim() || hasSubmittedTask
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed opacity-60"
                    : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Task"
                )}
              </button>
              
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setSubmitLink("");
                }}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestDetails;
