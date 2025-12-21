import React from "react";
import banner1 from "../../assets/banners/banner1.jpg";

const Banner = ({ searchText, setSearchText }) => {
  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-4 items-center">

        {/* SEARCH */}
        <div className="ml-10">
          <div className="flex items-center w-full max-w-sm mb-8">
            <input
              type="text"
              placeholder="Search contests..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border-b font-bold outline-none"
            />
            <button className="bg-orange-500 rounded-r-full text-white px-4 py-2">
              🔍
            </button>
          </div>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={banner1}
            alt=""
            className="w-[320px] md:w-[460px] rounded-lg"
          />
        </div>

        {/* TEXT */}
        <div className="ml-5">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-orange-500">Create</span> your Platform
          </h1>
          <p className="text-gray-400 text-xl font-semibold max-w-md">
            Create Arena is a modern, user-friendly platform for creating, discovering, and managing creative contests. From design challenges to writing, business ideas, and gaming reviews, ContestHub connects creators with opportunities to showcase their skills and compete globally.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Banner;
