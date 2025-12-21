import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const ContestSection = ({ searchText }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["approvedContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contests/approved");
      return res.data;
    },
  });

  
  const filteredContests = contests.filter((contest) =>
    contest.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const popularContests = [...filteredContests]
    .sort(
      (a, b) =>
        (b.participantsCount || 0) - (a.participantsCount || 0)
    )
    .slice(0, 6);

  const handleDetails = (id) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/contests/${id}`);
  };

  if (isLoading) {
    return (
      <p className="text-center py-20 text-gray-400 text-lg">
        Loading contests...
      </p>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

      
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-3">Popular Contests</h2>
          <p className="text-gray-500">
            Most participated contests you don’t want to miss
          </p>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularContests.map((contest) => (
            <div
              key={contest._id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              
              <div className="relative">
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="h-48 w-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full">
                  👥 {contest.participantsCount || 0}
                </span>
              </div>

            
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {contest.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {contest.description
                    ? contest.description.slice(0, 90) + "..."
                    : "No description available"}
                </p>

                <button
                  onClick={() => handleDetails(contest._id)}
                  className="mt-auto w-full bg-secondary text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

    
        {popularContests.length === 0 && (
          <p className="text-center mt-10 text-gray-400 text-lg">
            No contests found 😶
          </p>
        )}

      
        <div className="text-center mt-14">
          <button
            onClick={() => navigate("/all_contests")}
            className="px-10 py-4 border-2 border-indigo-300 text-indigo-400 font-bold rounded-2xl hover:bg-secondary hover:text-white transition-all"
          >
            Show All Contests →
          </button>
        </div>

      </div>
    </section>
  );
};

export default ContestSection;
