import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import Logo from '../Components/Logo';
import { FaMedal, FaRegCreditCard, FaUsers } from 'react-icons/fa';
import useRole from '../hooks/useRole';


const DashboardLayout = () => {
  const {role} = useRole()
    return (
        <div>
            <div className="drawer lg:drawer-open">
  <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    
    <nav className="navbar w-full bg-base-300">
      <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
      
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
      </label>
        <Link to="/dashboard">
      <div className="px-4 font-semibold text-xl">
        <span className='font-extrabold text-[#FF6900]'>
        Create </span>Arena Dashboard</div>
        </Link>
      {/* <Logo></Logo> */}
    </nav>
    {/* Page content here */}
    <Outlet></Outlet>
    {/* <div className="p-4">Page Content</div> */}
  </div>

  <div className="drawer-side is-drawer-close:overflow-visible">
    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
    <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
      
      <ul className="menu w-full grow gap-5 font-semibold">
        {/* List item */}
        <li>
            {/* <Link to='/'> */}
          <Link to="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
            {/* Home icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span className="is-drawer-close:hidden">Homepage</span>
            {/* <Logo></Logo> */}
          {/* </button> */}
            </Link>
        </li>


        {
          role === "admin" && <>
          
          
          

        <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Users" to="/dashboard/manage_users">
            <FaUsers/>
            <span className='is-drawer-close:hidden'>User Management</span>
            </NavLink>
        </li>









        <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Contests" to="/dashboard/manage_contests">
            <FaMedal/>
            <span className='is-drawer-close:hidden'>Contest Management</span>
            </NavLink>
        </li>


        </>}
       

            {
          role === "creator" && <>
          

          
        <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Created Contest" to="/dashboard/my_created_contest">
            <FaUsers/>
            <span className='is-drawer-close:hidden'>My Created Contest</span>
            </NavLink>
        </li>

          
        <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Submission Task" to="/dashboard/submission_task">
            <FaUsers/>
            <span className='is-drawer-close:hidden'>Submission Task</span>
            </NavLink>
        </li>
        {/* <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Submission Task" to="/dashboard/submission_task">
            <FaUsers/>
            <span className='is-drawer-close:hidden'>Submission Task</span>
            </NavLink>
        </li> */}
          
          

       


       


        </>}


        {
          role === "user" && <>
          <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Profile" to="/dashboard/my_profile">
            <FaMedal/>
            <span className='is-drawer-close:hidden'>My Profile</span>
            </NavLink>
        </li>
          <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Participated Contest" to="/dashboard/my_participate_contest">
            <FaMedal/>
            <span className='is-drawer-close:hidden'>My Participated Contest</span>
            </NavLink>
        </li>
          <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My winning Contest" to="/dashboard/my_winning_contest">
            <FaMedal/>
            <span className='is-drawer-close:hidden'>My Winning Contest</span>
            </NavLink>
        </li>
          
          </>
        }
         


        <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Payment History" to="/dashboard/payment_history">
            <FaRegCreditCard />
            <span className='is-drawer-close:hidden'>Payment History</span>
            </NavLink>
        </li>

      
       
      </ul>
    </div>
  </div>
</div>
        </div>
    );
};

export default DashboardLayout;
