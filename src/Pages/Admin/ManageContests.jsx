import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";


const ManageContests = () => {
 
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["manageContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contests");
      return res.data;
    },
  });

  const approveContestMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.patch(`/contests/${id}`, { status: "approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["manageContests"]);
      toast.success("Contest Approved!");
    },
  });

  
  const rejectContestMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.patch(`/contests/${id}`, { status: "rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["manageContests"]);
      toast.success("Contest Rejected!");
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <title>Manage Contest | Create Arena</title>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-5">
          <h4 className="text-sm text-gray-500">Pending</h4>
          <p className="text-2xl font-bold text-yellow-500">
            {contests.filter(c => c.status === "pending").length}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h4 className="text-sm text-gray-500">Approved</h4>
          <p className="text-2xl font-bold text-green-500">
            {contests.filter(c => c.status === "approved").length}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h4 className="text-sm text-gray-500">Rejected</h4>
          <p className="text-2xl font-bold text-red-500">
            {contests.filter(c => c.status === "rejected").length}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h4 className="text-sm text-gray-500">Total Contests</h4>
          <p className="text-2xl font-bold text-blue-500">
            {contests.length}
          </p>
        </div>
      </div>

     
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-5 border-b">
          Manage Contests
        </h2>

        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3">Contest Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Prize</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {contests.length > 0 ? (
              contests.map((contest) => (
                <tr
                  key={contest._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {contest.name}
                  </td>
                  <td className="px-6 py-4">{contest.type}</td>
                  <td className="px-6 py-4">{contest.email}</td>
                  <td className="px-6 py-4">${contest.price}</td>
                  <td className="px-6 py-4">${contest.prizeMoney}</td>

             
                  <td className="px-6 py-4">
                    {contest.status === "pending" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">
                        Pending
                      </span>
                    )}

                    {contest.status === "approved" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">
                        Approved
                      </span>
                    )}

                    {contest.status === "rejected" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
                        Rejected
                      </span>
                    )}
                  </td>

                  
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      disabled={contest.status !== "pending"}
                      onClick={() =>
                        approveContestMutation.mutate(contest._id)
                      }
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
                    >
                      Approve
                    </button>

                    <button
                      disabled={contest.status !== "pending"}
                      onClick={() =>
                        rejectContestMutation.mutate(contest._id)
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No contests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageContests;
