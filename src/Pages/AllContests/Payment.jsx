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
    }
  });

  const handlePayment = async () => {
    const paymentInfo = {
      price: contest.price,
      contestId: contest._id,
      email: user?.email,
      name: contest.name
    };

    const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
    window.location.href = res.data.url;
  };

  if (isLoading) return (
    <div className="flex justify-center mt-20">
      <span className='loading loading-infinity loading-xl'></span>
    </div>
  );

  if (!contest) return <p className="text-center mt-20 text-red-500">Contest not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Contest Payment</h2>
      <p className="text-gray-600 mb-6">Complete payment to join this contest</p>
      <h4 className="mb-6">Please Pay ${contest.price} for: {contest.name}</h4>
      <button
        onClick={handlePayment}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
