// import React, { useEffect, useRef, useState } from 'react';
// import { useSearchParams } from 'react-router';
// import useAxiosSecure from '../../hooks/useAxiosSecure';

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get('session_id');
//   const axiosSecure = useAxiosSecure();

//   const [paymentInfo, setPaymentInfo] = useState({});
//   const hasCalled = useRef(false);

//   useEffect(() => {
//     const updatePayment = async () => {
//       if (!sessionId || hasCalled.current) return;

//       hasCalled.current = true;

//       try {
//         const res = await axiosSecure.patch(
//           `/payment-success?session_id=${sessionId}`
//         );

//         setPaymentInfo({
//   transactionId: res.data.transactionId,
//   trackingId: res.data.trackingId,
// });

//       } catch (error) {
//         console.error('Payment confirmation failed:', error);
//       }
//     };

//     updatePayment();
//   }, [sessionId, axiosSecure]);

//   return (
//     <div>
//         <title>Payment Success | Create Arena</title>
//       <h2 className="text-4xl">Payment Successful</h2>

//       {paymentInfo.transactionId && (
//         <p>Your TransactionId : {paymentInfo.transactionId}</p>
//       )}

//      {paymentInfo.trackingId && (
//   <p>Your Contest Tracking id : {paymentInfo.trackingId}</p>
// )}

//     </div>
//   );
// };

// export default PaymentSuccess;





import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  useEffect(() => {
    if (sessionId && user?.email) {
      handlePaymentSuccess();
    }
  }, [sessionId, user]);

  const handlePaymentSuccess = async () => {
    try {
      const response = await axiosSecure.patch("/payment-success", null, {
        params: { session_id: sessionId }
      });

      if (response.data.message === "Already registered") {
        Swal.fire("Success", "You're already registered for this contest!", "success");
      } else {
        Swal.fire("Payment Successful!", "You're now registered for the contest!", "success");
      }

      // Navigate to dashboard with tabs showing participation and payments
      navigate("/dashboard", { 
        state: { 
          activeTab: "participated", 
          showPaymentSuccess: true 
        } 
      });
    } catch (error) {
      Swal.fire("Error", "Payment confirmation failed. Please check your payment history.", "error");
      navigate("/dashboard/payments");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md mx-auto">
        <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Confirming your registration...</p>
        <span className="loading loading-infinity loading-lg text-green-500 mx-auto block"></span>
      </div>
    </div>
  );
};

export default PaymentSuccess;
