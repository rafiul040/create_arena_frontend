import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaTrophy, FaCrown, FaMedal, FaUser } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Leaderboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await axiosSecure.get('/leaderboard');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <span className="loading loading-infinity loading-lg text-yellow-400"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-3xl mb-6">
            <FaTrophy className="text-4xl text-yellow-400 drop-shadow-lg" />
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-2xl">
                Leaderboard
              </h1>
              <p className="text-xl text-white/80">Top Winners</p>
            </div>
          </div>
          <p className="text-2xl text-yellow-300 font-bold">
            🏆 {leaderboard.length} Champions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {leaderboard.slice(0, 3).map((player, index) => (
            <div
              key={player.email}
              className={`group relative p-8 rounded-3xl shadow-2xl backdrop-blur-xl border-4 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 ${
                index === 0 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300' 
                  : index === 1 
                  ? 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300' 
                  : 'bg-gradient-to-br from-[#CD7F32] to-[#B8860B] border-amber-400'
              }`}
            >
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-black shadow-2xl border-4 ${
                index === 0 ? 'bg-yellow-400 text-black border-yellow-300' :
                index === 1 ? 'bg-gray-400 text-black border-gray-300' :
                'bg-[#CD7F32] text-white border-amber-400'
              }`}>
                {index === 0 ? (
                  <FaCrown className="text-3xl" />
                ) : index === 1 ? (
                  <span>2</span>
                ) : (
                  <span>3</span>
                )}
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:scale-110 transition-transform">
                  {player.photoURL ? (
                    <img
                      src={player.photoURL}
                      alt={player.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-2xl"
                    />
                  ) : (
                    <FaUser className="text-4xl text-white" />
                  )}
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2 truncate">
                  {player.name}
                </h3>
                
                <div className="bg-black/20 px-6 py-3 rounded-2xl mb-6 backdrop-blur-sm">
                  <div className="text-3xl font-black text-yellow-300 mb-1">
                    {player.wins}
                  </div>
                  <p className="text-white/80 text-sm uppercase tracking-wide">Wins</p>
                </div>

                {player.contests && player.contests.length > 0 && (
                  <div className="text-xs text-white/70 mb-4">
                    <p>Recent Wins:</p>
                    <div className="flex flex-wrap gap-1 mt-1 justify-center">
                      {player.contests.slice(0, 2).map((contest, i) => (
                        <span key={i} className="bg-white/20 px-2 py-1 rounded-full truncate max-w-20">
                          {contest}
                        </span>
                      ))}
                      {player.contests.length > 2 && (
                        <span className="bg-white/20 px-2 py-1 rounded-full">
                          +{player.contests.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {leaderboard.slice(3, 12).map((player, index) => (
            <div
              key={player.email}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all border border-white/20 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                  #{index + 4}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {player.photoURL ? (
                      <img
                        src={player.photoURL}
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-white truncate">{player.name}</h4>
                      <p className="text-white/70 text-sm truncate">{player.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-black text-yellow-300">
                    {player.wins}
                  </div>
                  <p className="text-white/60 text-xs uppercase tracking-wide">Wins</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length > 12 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8">
            <div className="overflow-x-auto">
              <table className="table w-full text-white">
                <thead>
                  <tr className="text-yellow-300">
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Wins</th>
                    <th>Recent Contests</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(12).map((player, index) => (
                    <tr key={player.email} className="hover:bg-white/10 transition-colors">
                      <td className="font-bold text-lg">#{index + 13}</td>
                      <td className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          {player.photoURL ? (
                            <img src={player.photoURL} alt={player.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <FaUser className="text-white text-xs" />
                          )}
                        </div>
                        <span className="font-semibold">{player.name}</span>
                      </td>
                      <td className="font-black text-2xl text-yellow-300">{player.wins}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {player.contests?.slice(0, 3).map((contest, i) => (
                            <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full truncate max-w-24">
                              {contest}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
