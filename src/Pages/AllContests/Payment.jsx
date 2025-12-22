import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";


const Payment = () => {
  const { contestId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();


  
  const { isLoading, data: contest } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      const res = await axiosSecure.get(`contests/${contestId}`);
      return res.data;
    },
    enabled: !!contestId
  });


const handlePayment = async () => {
  if (!contest || !user?.email) {
    console.error("Missing contest or user email");
    return;
  }

  const paymentInfo = {
    price: contest.price,      
    contestId: contest._id,      
    email: user.email,
    name: contest.name
  };

  try {
    const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
    window.location.href = res.data.url;
  } catch (error) {
    console.error("Payment initiation failed:", error);
  }
};



  
  if (isLoading) return (
    <div className="flex justify-center mt-20">
      <span className='loading loading-infinity loading-xl'></span>
    </div>
  );


  
  if (!contest) return <p className="text-center mt-20 text-red-500">Contest Not Found</p>;


  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Contest Payment</h2>
      <p className="text-gray-600 mb-6">Complete payment to join this contest</p>
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-2">Please Pay ${contest.price} for:</h4>
        <p className="text-lg font-bold text-blue-800">{contest.name}</p>
      </div>
      <button
        onClick={handlePayment}
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all duration-200"
      >
        💳 Pay Now & Join Contest
      </button>
      <p className="text-xs text-gray-500 mt-4 text-center">
        You'll be redirected to secure payment. Success → Dashboard
      </p>
    </div>
  );
};


export default Payment;



