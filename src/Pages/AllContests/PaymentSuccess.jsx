
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast"; 

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      const verifyPayment = async () => {
        try {
          const res = await axiosSecure.get(`/payment-success?session_id=${sessionId}`);
          
          
          queryClient.invalidateQueries({ queryKey: ["popularContests"] });
          queryClient.invalidateQueries({ queryKey: ["contest"] });
          queryClient.invalidateQueries({ queryKey: ["participants"] });
          queryClient.invalidateQueries({ queryKey: ["userPayments"] });

          toast.success(res.data.message);
          
        
          const contestId = res.data.contestId;
          setTimeout(() => {
            // navigate(`/contests/${contestId}`);
            navigate(`/all_contests`);
          }, 2000);
        } catch (error) {
          toast.error("Payment verification failed");
          navigate("/dashboard");
        }
      };

      verifyPayment();
    }
  }, [sessionId, navigate, queryClient, axiosSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md mx-auto">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Verifying your payment and registering you for the contest...</p>
        <span className="loading loading-infinity loading-lg text-emerald-500"></span>
      </div>
    </div>
  );
};

export default PaymentSuccess;
