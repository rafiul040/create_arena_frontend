import React from "react";
import { FaRocket, FaUsers, FaShieldAlt, FaLightbulb } from "react-icons/fa";

const ExtraSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Why Creators Choose <span className="text-orange-500">Create Arena</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Everything you need to grow, compete, and win — all in one platform.
          </p>
        </div>

    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="bg-gray-50 rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition">
            <FaRocket className="text-orange-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Launch Your Talent</h3>
            <p className="text-gray-600 text-sm">
              Participate in contests that showcase your skills to the world.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition">
            <FaUsers className="text-orange-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Global Community</h3>
            <p className="text-gray-600 text-sm">
              Compete with creators from different countries and industries.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition">
            <FaShieldAlt className="text-orange-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure & Fair</h3>
            <p className="text-gray-600 text-sm">
              Transparent judging system with secure payments.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition">
            <FaLightbulb className="text-orange-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Learn & Improve</h3>
            <p className="text-gray-600 text-sm">
              Gain feedback, experience, and recognition from each contest.
            </p>
          </div>

        </div>

      
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg">
            Join thousands of creators building their future with Create Arena 🚀
          </p>
        </div>

      </div>
    </section>
  );
};

export default ExtraSection;
