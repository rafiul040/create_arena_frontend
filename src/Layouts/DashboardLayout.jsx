import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FaMedal, FaRegCreditCard, FaUsers } from 'react-icons/fa';
import useRole from '../hooks/useRole';

const DashboardLayout = () => {
  const { role } = useRole();

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <nav className="navbar w-full bg-base-300">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="my-1.5 inline-block w-6 h-6"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>

            <Link to="/dashboard" className="px-4 font-semibold text-xl">
              <span className="font-extrabold text-[#FF6900]">Create </span>Arena Dashboard
            </Link>
          </nav>

          <Outlet />
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="flex min-h-full flex-col items-start bg-base-200 w-64">
            <ul className="menu w-full grow gap-5 font-semibold p-4">
              <li>
                <Link
                  to="/"
                  className="tooltip tooltip-right"
                  data-tip="Homepage"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="inline-block w-6 h-6 mr-2"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  Homepage
                </Link>
              </li>

              {role === 'admin' && (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/manage_users"
                      className={({ isActive }) =>
                        isActive ? 'active' : ''
                      }
                      title="Manage Users"
                    >
                      <FaUsers className="inline mr-2" />
                      User Management
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/manage_contests"
                      className={({ isActive }) =>
                        isActive ? 'active' : ''
                      }
                      title="Manage Contests"
                    >
                      <FaMedal className="inline mr-2" />
                      Contest Management
                    </NavLink>
                  </li>
                </>
              )}

              {role === 'creator' && (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/my_created_contest"
                      className={({ isActive }) =>
                        isActive ? 'active' : ''
                      }
                      title="My Created Contest"
                    >
                      <FaUsers className="inline mr-2" />
                      My Created Contest
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/submission_task"
                      className={({ isActive }) =>
                        isActive ? 'active' : ''
                      }
                      title="Submission Task"
                    >
                      <FaUsers className="inline mr-2" />
                      Submitted Task
                    </NavLink>
                  </li>
                </>
              )}

              {role === 'user' && (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/my_participate_contest"
                      className={({ isActive }) =>
                        isActive ? 'active' : ''
                      }
                      title="My Participated Contest"
                    >
                      <FaMedal className="inline mr-2" />
                      My Participated Contest
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/my_winning_contest"
                      className={({ isActive }) =>
                        isActive ? 'active' : ''
                      }
                      title="My Winning Contest"
                    >
                      <FaMedal className="inline mr-2" />
                      My Winning Contest
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/my_profile"
                      className={({ isActive }) =>
                        isActive ? 'active' : ''
                      }
                      title="My Profile"
                    >
                      <FaMedal className="inline mr-2" />
                      My Profile
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink
                  to="/dashboard/payment_history"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title="Payment History"
                >
                  <FaRegCreditCard className="inline mr-2" />
                  Payment History
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
