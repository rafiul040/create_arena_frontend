import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyContestParticipate = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchContests = async () => {
      setLoading(true);
      try {
        // ✅ Use correct backend endpoint
        const res = await axiosSecure.get(`/my-participated-contests/${user.email}`);
        
        // ✅ Filter by correct field: paymentStatus === "paid"
        const paidContests = res.data.filter((payment) => payment.paymentStatus === "paid");
        
        // ✅ Sort by contest deadline (from contestDetails)
        paidContests.sort((a, b) => 
          new Date(a.contestDetails?.deadline) - new Date(b.contestDetails?.deadline)
        );
        
        setContests(paidContests);
      } catch (err) {
        console.error("Error fetching participated contests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [user?.email, axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-indigo-600">My Participated Contests</h2>

      {contests.length === 0 ? (
        <p className="text-center text-gray-600 mt-16">You have not participated in any contests yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="table w-full">
            <thead>
              <tr className="text-indigo-600">
                <th>#</th>
                <th>Contest</th>
                <th>Price Paid</th>
                <th>Deadline</th>
                <th>Payment ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((payment, index) => {
                const contest = payment.contestDetails || {};
                const isExpired = new Date(contest.deadline) < new Date();
                
                return (
                  <tr key={payment._id} className="hover">
                    <th>{index + 1}</th>
                    <td className="font-medium">
                      {contest.name || "Contest Deleted"}
                    </td>
                    <td>${payment.price}</td>
                    <td>
                      <span className={`${
                        isExpired ? 'text-red-600' : 'text-green-600'
                      } font-semibold`}>
                        {new Date(contest.deadline).toLocaleDateString()}
                        {isExpired && ' (Expired)'}
                      </span>
                    </td>
                    <td className="font-mono text-sm text-gray-600">
                      {payment.trackingId}
                    </td>
                    <td>
                      {payment.isWinner ? (
                        <span className="badge badge-success badge-lg">🏆 Winner!</span>
                      ) : isExpired ? (
                        <span className="badge badge-error">Expired</span>
                      ) : (
                        <span className="badge badge-info">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyContestParticipate;
