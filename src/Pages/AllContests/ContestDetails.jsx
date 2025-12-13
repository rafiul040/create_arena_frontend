import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ContestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: contest = {}, isLoading } = useQuery({
    queryKey: ["contestDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contests/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={contest.image}
        alt={contest.name}
        className="w-full h-80 object-cover rounded"
      />

      <h2 className="text-3xl font-bold mt-6">{contest.name}</h2>

      <p className="mt-3 text-gray-600">{contest.description}</p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <p><strong>Type:</strong> {contest.type}</p>
        <p><strong>Entry Fee:</strong> ${contest.price}</p>
        <p><strong>Prize Money:</strong> ${contest.prizeMoney}</p>
        <p><strong>Deadline:</strong> {contest.deadline}</p>
      </div>

      <button
        onClick={() => navigate(`/payment/${contest._id}`)}
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default ContestDetails;
