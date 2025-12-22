import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoShieldCheckmark } from "react-icons/io5";
import { FiShieldOff } from "react-icons/fi";
import { FaUserCheck } from "react-icons/fa";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const ITEMS_PER_PAGE = 10;

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);


  const { refetch, data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  const { data: creators = [] } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const res = await axiosSecure.get('/creator');
      return res.data;
    }
  });

  const hasCreatorApplication = (email) =>
    creators.some(c => c.email === email);

 
  const sortedUsers = useMemo(() => {
    return [...users].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [users]);
  
  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentUsers = sortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

 






  const updateRole = (user, role, msg) => {
  axiosSecure
    .patch(`/users/${user._id}/role`, { role })
    .then(res => {
      console.log(res.data); 
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: msg,
        showConfirmButton: false,
        timer: 2000,
      });
      refetch();
    })
    .catch(err => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Role update unsuccessful",
      });
    });
};





  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold">{users.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Admins</p>
          <h2 className="text-3xl font-bold text-green-600">
            {users.filter(u => u.role === 'admin').length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Creators</p>
          <h2 className="text-3xl font-bold text-orange-500">
            {users.filter(u => u.role === 'creator').length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Normal Users</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {users.filter(u => !u.role || u.role === 'user').length}
          </h2>
        </div>
      </div>

    
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-gray-500">
            Showing 10 users per page
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-gray-500">
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th className="text-center">Role</th>
                <th className="text-center">Admin</th>
                <th className="text-center">Creator</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user, i) => {
                const applied = hasCreatorApplication(user.email);

                return (
                  <tr key={user._id} className="hover">
                    <td>{startIndex + i + 1}</td>

                    <td className="flex items-center gap-3">
                      <img
                        src={user.photoURL || 'https://via.placeholder.com/40'}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-medium">
                        {user.displayName || 'N/A'}
                      </span>
                    </td>

                    <td className="text-gray-500">{user.email}</td>

                    <td className="text-center">
                      <span className={`badge ${
                        user.role === 'admin'
                          ? 'badge-success'
                          : user.role === 'creator'
                          ? 'badge-warning'
                          : 'badge-ghost'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>

                    <td className="text-center">
                      {user.role === 'admin' ? (
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => updateRole(user, 'user', 'Admin Removed')}
                        >
                          <FiShieldOff />
                        </button>
                      ) : (
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => updateRole(user, 'admin', 'Admin Assigned')}
                        >
                          <IoShieldCheckmark />
                        </button>
                      )}
                    </td>

                    <td className="text-center">
                      {user.role === 'creator' ? (
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => updateRole(user, 'user', 'Creator Removed')}
                        >
                          <FiShieldOff />
                        </button>
                      ) : applied ? (
                        <button
                          className="btn btn-xs btn-warning"
                          onClick={() => updateRole(user, 'creator', 'Creator Assigned')}
                        >
                          <FaUserCheck />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>



<td className="text-center space-x-2">

  <button
    onClick={() => {
      setSelectedUser(user);
      document.getElementById('user_modal').showModal();
    }}
    className="btn btn-secondary text-white"
  >
    👁️
  </button>

  
</td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>



<dialog id="user_modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg mb-4">User Details</h3>

    {selectedUser && (
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <img
            src={selectedUser.photoURL || 'https://via.placeholder.com/80'}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-semibold text-lg">
              {selectedUser.displayName || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">{selectedUser.email}</p>
          </div>
        </div>

        <p>
          <span className="font-medium">Role:</span>{' '}
          <span className="badge badge-outline">
            {selectedUser.role || 'user'}
          </span>
        </p>
        <p>
          <span className="font-medium">Phone:</span>{' '}
          <span className="badge badge-outline">
            {selectedUser.phone || 'phone'}
          </span>
        </p>

        <p>
          <span className="font-medium">Joined:</span>{' '}
          {new Date(selectedUser.createdAt).toLocaleDateString()}
        </p>
      </div>
    )}

    <div className="modal-action">
      <form method="dialog">
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>









        
        <div className="flex justify-between items-center p-6 bg-gray-50">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <div className="join">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="join-item btn btn-sm"
            >
              Prev
            </button>






            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="join-item btn btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
