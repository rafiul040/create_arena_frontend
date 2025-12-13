import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ContestDetails = () => {
  const { contestId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: contest = {}, isLoading } = useQuery({
    queryKey: ["contestDetails", contestId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contests/${contestId}`);
      return res.data;
    }
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        
        <div>
          <img
            src={contest.image}
            alt={contest.name}
            className="w-[250px] h-[220px] mx-auto rounded-lg border"
          />

          
          
        </div>

    
        <div>
          <span className="text-sm text-green-600 font-semibold uppercase">
            New Contest
          </span>

          <h2 className="text-3xl font-bold mt-2">
            {contest.name}
          </h2>

    
          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-sm text-gray-500">(4.5)</span>
          </div>


          <p className="text-3xl font-semibold text-green-600 mt-4">
            ${contest.price}
          </p>

          
          <p className="text-gray-600 mt-4">
            {contest.description}
          </p>

        
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <p className="font-semibold"><strong>Type:</strong> {contest.type}</p>
            <p className="font-semibold"><strong>Prize:</strong> ${contest.prizeMoney}</p>
            <p className="font-semibold"><strong>Deadline:</strong> {contest.deadline}</p>
            <p className="font-semibold"><strong>Status:</strong> Open</p>
          </div>

        
          <button
            onClick={() => navigate(`/payment/${contest._id}`)}
            className="mt-8 w-full py-3 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;
