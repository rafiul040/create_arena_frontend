import React from "react";
import { Link } from "react-router";

const winners = [
  {
    id: 1,
    name: "Sarah Khan",
    contest: "UI Design Challenge",
    prize: "$500",
    image: "https://i.ibb.co/6WZ2F7k/user1.jpg",
  },
  {
    id: 2,
    name: "Arafat Hossain",
    contest: "Startup Idea Contest",
    prize: "$1,000",
    image: "https://i.ibb.co/Gv4zqKc/user2.jpg",
  },
  {
    id: 3,
    name: "Emily Watson",
    contest: "Creative Writing",
    prize: "$300",
    image: "https://i.ibb.co/y0LzQ3J/user3.jpg",
  },
];

const WinnerAdvertisement = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-[#fff7e6] rounded-xl to-[#fff]">
      <div className="max-w-7xl mx-auto px-6">

      
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            🏆 Winners Don’t Just Win Prizes  
            <span className="block text-orange-500">They Win Recognition</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Thousands of creators are earning rewards, building portfolios,
            and getting global exposure through ContestHub.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h3 className="text-4xl font-black text-orange-500">$50K+</h3>
            <p className="text-gray-600 font-semibold mt-2">
              Prize Money Distributed
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h3 className="text-4xl font-black text-orange-500">1,200+</h3>
            <p className="text-gray-600 font-semibold mt-2">
              Total Winners
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h3 className="text-4xl font-black text-orange-500">80+</h3>
            <p className="text-gray-600 font-semibold mt-2">
              Countries Participated
            </p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {winners.map((winner) => (
            <div
              key={winner.id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 text-center"
            >
              <img
                src={winner.image}
                alt={winner.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-orange-400 mb-4"
              />

              <h4 className="text-xl font-bold">{winner.name}</h4>
              <p className="text-gray-500 text-sm mb-1">
                {winner.contest}
              </p>

              <span className="inline-block mt-3 bg-orange-100 text-orange-600 px-4 py-1 rounded-full font-bold">
                Won {winner.prize}
              </span>
            </div>
          ))}
        </div>

        
        <div className="text-center mt-20">
          <h3 className="text-3xl font-black mb-4">
            You Could Be the Next Winner 🚀
          </h3>
          <p className="text-gray-600 mb-8">
            Join contests, showcase your talent, and earn real rewards.
          </p>

          <Link to="/all_contests" className="px-10 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg">
            Join a Contest Now →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default WinnerAdvertisement;
