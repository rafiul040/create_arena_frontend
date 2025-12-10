import React from "react";
import { SocialIcon } from "react-social-icons";
import Logo from "../../Components/Logo";

const Footer = () => {
  return (
    <div className="mt-70">
      <footer className="relative rounded-t-2xl bg-[#111] text-white pt-24 pb-16">

        
        <div className="text-center -mt-26 mb-15">
          <Logo></Logo>
        </div>

        
        <div className="absolute -top-14 left-0 w-full">
          <svg className="w-full h-14" viewBox="0 0 1440 270" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#111"
              d="
                M0,0 
                H520 
                Q540,50 600,50 
                H840 
                Q900,50 920,0 
                H1440 
                V320 
                H0 
                Z
              "
            />
          </svg>
        </div>

        <div className="container mx-auto px-8">

        
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10">

            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">ABOUT US</h3>
              <p className="text-gray-300">
                CreateArena is a modern creative contest platform that helps creators launch competitions, discover talent, and participate in exciting challenges across design, writing, business ideas and more. Join, compete, and showcase your skills!
              </p>
            </div>

        
            <div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">GET IN TOUCH</h3>
              <p className="text-gray-300 mb-4">
                We’re currently settling at our physical office. Meanwhile, , please share your email below.We’re here to help. Send us a message and we’ll get back soon.
              </p>

              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-l-md bg-gray-800 text-gray-200 outline-none border border-gray-700"
                />
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 rounded-r-md">
                  Submit
                </button>
              </div>
            </div>

            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">SOCIAL</h3>
              <ul className="space-y-2">
                <li><a className="text-gray-300 hover:text-white" href="#">Dribbble</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">LinkedIn</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">Instagram</a></li>
              </ul>
            </div>

            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">OTHER</h3>
              <ul className="space-y-2">
                <li><a className="text-gray-300 hover:text-white" href="#">Story & Info</a></li>
              </ul>
            </div>

          </div>

          
          <div className="border-t border-gray-700 mt-12 pt-10 flex justify-center">
            <div className="flex space-x-6">

             
              <a className="icon-box">
                <span className="text-white font-semibold text-lg">
                    <SocialIcon url="https://www.linkedin.com/in/rafiulislam040/" />
                </span>
              </a>

              <a className="icon-box">
                <span className="text-white font-semibold text-lg">
                    <SocialIcon url="https://www.facebook.com/rafiulislam22" />
                </span>
              </a>
              <a className="icon-box">
                <span className="text-white font-semibold text-sm">
                    <SocialIcon url="https://x.com/rafiulX" />
                </span>
              </a>
              <a className="icon-box">
                <span className="text-white font-semibold text-lg">
                    <SocialIcon url="https://github.com/rafiul040" />
                </span>
              </a>
              <a className="icon-box">
                <span className="text-white font-semibold text-lg">
                    <SocialIcon url="https://www.youtube.com/@comradegaming8960" />
                </span>
              </a>

            
              

            
              

            </div>
          </div>

        </div>

      </footer>
    </div>
  );
};

export default Footer;
