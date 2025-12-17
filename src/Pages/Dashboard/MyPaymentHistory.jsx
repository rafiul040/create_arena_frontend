import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const MyPaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axiosSecure
      .get(`/payments/history/${user.email}`)
      .then(res => setPayments(res.data));
  }, [user.email, axiosSecure]);

  return (
    <div>
      {payments.map(p => (
        <div key={p._id} className="border p-3 mb-3 rounded">
          <h3>{p.contestName}</h3>
          <p>Amount: ৳{p.price}</p>
          <p>Txn: {p.transactionId}</p>
          <p>Txn: {p.trackingId}</p>
          <p>Txn: {p.contestId}</p>
        </div>
      ))}
    </div>
  );
};

export default MyPaymentHistory;
