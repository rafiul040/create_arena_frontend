import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const axiosSecure = useAxiosSecure();

  const [paymentInfo, setPaymentInfo] = useState({});
  const hasCalled = useRef(false);

  useEffect(() => {
    const updatePayment = async () => {
      if (!sessionId || hasCalled.current) return;

      hasCalled.current = true;

      try {
        const res = await axiosSecure.patch(
          `/payment-success?session_id=${sessionId}`
        );

        setPaymentInfo({
  transactionId: res.data.transactionId,
  trackingId: res.data.trackingId,
});

      } catch (error) {
        console.error('Payment confirmation failed:', error);
      }
    };

    updatePayment();
  }, [sessionId, axiosSecure]);

  return (
    <div>
      <h2 className="text-4xl">Payment Successful</h2>

      {paymentInfo.transactionId && (
        <p>Your TransactionId : {paymentInfo.transactionId}</p>
      )}

     {paymentInfo.trackingId && (
  <p>Your Contest Tracking id : {paymentInfo.trackingId}</p>
)}

    </div>
  );
};

export default PaymentSuccess;
