import React from 'react';
import { Link } from 'react-router';
import Logo from '../../Components/Logo';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {

  const {user, logOut} = useAuth()


  const handleLogout = () => {
    logOut()
    .then()
    .catch(error => {
      console.log(error)
    })
  }


const menu = (
  <>
  <Link to="/">
    <li className="nav-glow">Home</li></Link>
  <Link to="/all_contests">
    <li className="nav-glow">All Contests</li>
  </Link>
  <Link to="/leaderboard">
    <li className="nav-glow">Leaderboard</li>
  </Link>


  {
    user && <> 
  <Link to="/add_contest">
    <li className="nav-glow">Add Contest</li>
  </Link>
  <Link to="/dashboard">
    <li className="nav-glow">Dashboard</li>
  </Link>
    </>
  }
  </>
);

    return (
        <div>
           <div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow gap-3 font-semibold">
       
        {menu}

      </ul>
    </div>
    <Logo></Logo>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className=" menu menu-horizontal px-1 gap-5 font-semibold text-[#3D3D3D] text-[16px]">
     
        {menu}

    </ul>
  </div>
  <div className="navbar-end gap-5">


    {
      user ? ( <>
      <Link to="/" onClick={handleLogout} className="btn hover:rounded-4xl hover:font-bold hover:bg-amber-300">Log Out</Link>
      </>
      )
      : ( <>
      <Link to="/register" className="btn hover:rounded-4xl hover:font-bold hover:bg-amber-300">Register</Link>
      <Link to="/login" className="btn hover:rounded-4xl hover:font-bold hover:bg-amber-400">Log In</Link> 
      </>
      )
    }
  </div>
</div>
        </div>
    );
};

export default Navbar;