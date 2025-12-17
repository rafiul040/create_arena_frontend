import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const positionBadge = position => {
  if (position === 1) return "🥇 1st Place";
  if (position === 2) return "🥈 2nd Place";
  if (position === 3) return "🥉 3rd Place";
  return "🏅 Winner";
};

const MyWinningContes = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/my-winning-contests/${user.email}`)
      .then(res => setWins(res.data))
      .catch(err => console.error("Error fetching wins:", err))
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (!wins.length) {
    return (
      <div className="text-center py-14 text-gray-400">
        <div className="text-4xl mb-3">🥲</div>
        <p className="text-lg font-medium">No wins yet</p>
        <p className="text-sm mt-1">Keep participating to win big! 🏆</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        🏆 My Winning Contests
        <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
          {wins.length} Wins
        </span>
      </h3>

      {wins.map(w => (
        <div
          key={w._id}
          className="p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50
          rounded-2xl shadow-xl border-l-4 border-yellow-500 hover:scale-[1.01] transition"
        >
          <div className="flex items-start gap-5">
            {/* Trophy */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 
              flex items-center justify-center text-3xl shadow-lg">
                🏆
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="font-bold text-xl text-gray-800 truncate">
                {w.contestName}
              </h4>

              {/* Position */}
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full 
                bg-yellow-200 text-yellow-900 mt-1">
                {positionBadge(w.position)}
              </span>

              {/* Prize */}
              <p className="text-sm text-gray-700 mt-2">
                💰 Prize Won:{" "}
                <span className="font-bold text-green-700">
                  ৳{w.prizeAmount || w.price}
                </span>
              </p>

              {/* Date */}
              <p className="text-sm text-gray-600">
                📅 Won on:{" "}
                {new Date(w.createdAt).toLocaleDateString()}
              </p>

              {/* Prize Delivery */}
              {w.prizeStatus && (
                <p
                  className={`text-xs font-semibold mt-1 ${
                    w.prizeStatus === "delivered"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  📦 Prize Status: {w.prizeStatus}
                </p>
              )}

              {/* Tracking */}
              {w.trackingId && (
                <p className="text-xs text-gray-500 mt-1">
                  Tracking ID: {w.trackingId}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyWinningContes;
