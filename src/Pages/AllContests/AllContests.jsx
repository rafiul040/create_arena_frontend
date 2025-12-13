import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link, useNavigate } from "react-router";

const AllContests = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["approvedContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contests/approved");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">
        All Approved Contests
      </h2>

      {contests.length === 0 ? (
        <p className="text-center text-gray-500">
          No contests available right now
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <div
              key={contest._id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              {/* ===== IMAGE ===== */}
              <img
                src={contest.image}
                alt={contest.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">
                  {contest.name}
                </h3>

                <p className="text-sm text-gray-600">
                  Type: {contest.type}
                </p>

                <p className="text-sm text-gray-600">
                  Entry Fee: ${contest.price}
                </p>

                <p className="text-sm text-gray-600">
                  Prize: ${contest.prizeMoney}
                </p>

                <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                  Approved
                </span>


               <button
  onClick={() => navigate(`/contest/${contest._id}`)}
  className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
>
  Join Contest
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllContests;
