import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const Payments = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get(`/payments/history/${user.email}`)
      .then(res => setPayments(res.data))
      .catch(err => console.error("Error fetching payments:", err))
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        💳 Payment History ({payments.length})
      </h1>

      {payments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No payment history yet</p>
          <p className="text-sm text-gray-400 mt-2">Join contests to see your payments here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map(payment => (
            <div key={payment._id} className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-l-4 border-green-500 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl">{payment.contestName}</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-semibold">
                  ${payment.price || payment.amount}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>📅 {new Date(payment.createdAt).toLocaleDateString()}</span>
                <span>ID: {payment.trackingId}</span>
                <span>Status: <span className="font-semibold text-green-700">✅ Paid</span></span>
              </div>
              {payment.transactionId && (
                <p className="text-xs text-gray-500 mt-2">TXN: {payment.transactionId}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
