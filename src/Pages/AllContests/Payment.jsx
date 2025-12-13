import { useParams } from "react-router-dom";

const Payment = () => {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Contest Payment</h2>

      <p className="text-gray-600 mb-6">
        Complete payment to join this contest
      </p>

      <button className="w-full py-3 bg-blue-600 text-white rounded">
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
