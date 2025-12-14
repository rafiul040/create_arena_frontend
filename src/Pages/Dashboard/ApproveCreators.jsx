import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import React from 'react'; 
import useAxiosSecure from '../../hooks/useAxiosSecure'; 
import Swal from 'sweetalert2'; 
const ApproveCreators = () => { 
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure(); 
 
const { data: creators = [], isLoading, isError, error } = useQuery({
  queryKey: ['creators'],
  queryFn: async () => {
    const res = await axiosSecure.get('/creator');
    return res.data;
  },
});




 
        
        const pendingCreators = creators.filter(c => c.status === 'pending');
const approvedCreators = creators.filter(c => c.status === 'approved');

        const totalRequests = creators.length;








const updateRiderStatus = async (creator, status) => {
  const updateInfo = { status: status, email: creator.email };

  const res = await axiosSecure.patch(`/creator/${creator._id}`, updateInfo);

  if (res.data.modifiedCount) {

   

    queryClient.setQueryData(['creators'], (oldData) =>
  oldData.map((c) =>
    c._id === creator._id  
      ? { ...c, status }
      : c
  )
);




    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: `Creator has been ${status}`,
      timer: 2000,
      showConfirmButton: false,
    });
  }
};







const handleApprove = creator => {
  updateRiderStatus(creator, 'approved')
}
const handleReject = creator => {
  updateRiderStatus(creator, 'rejected')
}

  if (isLoading) return <p className="text-center p-8">Loading creator requests...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 p-8">
        Failed to load creator requests: {error.message}
      </p>
    );

  const StatusCard = ({ title, value, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[180px]">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Manage Creator Requests</h1>

      
      <div className="flex flex-wrap gap-4 mb-8">
        <StatusCard 
          title="Pending Requests" 
          value={pendingCreators.length} 
          colorClass="text-yellow-600" 
        />
        <StatusCard 
          title="Total Requests" 
          value={approvedCreators.length} 
          colorClass="text-gray-800" 
        />
        <StatusCard 
          title="Total Requests" 
          value={totalRequests} 
          colorClass="text-gray-800" 
        />
      </div>

    
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          Manage Pending Creator Requests ({creators.length})
        </h2>

        {creators.length === 0 ? (
          <p className="py-4 text-center text-gray-600">
            No pending creator requests at this time.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Requested
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {creators.map((creator) => (
                  <tr key={creator._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {creator.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {creator.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(creator.createdAt).toLocaleDateString()}
                    </td>
                    <td className='text-gray-500 text-sm text-center'>
                      <p className={`${creator.status === 'approved' ? "text-green-800" : "text-red-500"}`}>
                      {creator.status}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleApprove(creator)}
                          className='btn'
                          >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(creator)}
                         className='btn'
                          
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveCreators;
