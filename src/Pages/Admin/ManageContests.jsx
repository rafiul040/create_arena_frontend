import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

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

  const deleteContestMutation = useMutation({
  mutationFn: (id) => axiosSecure.delete(`/contests/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries(["manageContests"]);
    toast.success("Contest Deleted!");
  },
});

  
  
  
  
  const handleDeleteContest = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This contest will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContestMutation.mutate(id);
      }
    });
};


  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <title>Manage Contest | Create Arena</title>

    
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-gray-400">Pending Contests</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {contests.filter(c => c.status === "pending").length}
              </h2>
              <span className="badge badge-warning badge-outline">Pending</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-gray-400">Approved Contests</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {contests.filter(c => c.status === "approved").length}
              </h2>
              <span className="badge badge-success badge-outline">Approved</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-gray-400">Rejected Contests</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {contests.filter(c => c.status === "rejected").length}
              </h2>
              <span className="badge badge-error badge-outline">Rejected</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-gray-400">Total Contests</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{contests.length}</h2>
              <span className="badge badge-info badge-outline">All</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-1">Country Campaigns</h2>
          <p className="text-sm text-gray-400 mb-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting
          </p>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Prize</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {contests.map((contest) => (
                  <tr key={contest._id}>
                    <td className="font-medium">{contest.name}</td>
                    <td>{contest.type}</td>
                    <td>{contest.email}</td>
                    <td className="text-center">${contest.price}</td>
                    <td className="text-center">${contest.prizeMoney}</td>

                    <td className="text-center">
                      {contest.status === "pending" && (
                        <span className="badge badge-warning">Pending</span>
                      )}
                      {contest.status === "approved" && (
                        <span className="badge badge-success">Approved</span>
                      )}
                      {contest.status === "rejected" && (
                        <span className="badge badge-error">Rejected</span>
                      )}
                    </td>

                    <td className="text-center space-x-2">
                      <button
                        disabled={contest.status !== "pending"}
                        onClick={() =>
                          approveContestMutation.mutate(contest._id)
                        }
                        className="btn btn-xs btn-success"
                      >
                        Approve
                      </button>

                      <button
                        disabled={contest.status !== "pending"}
                        onClick={() =>
                          rejectContestMutation.mutate(contest._id)
                        }
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>

                      {/* <button
                        onClick={() =>

                          window.confirm()
                           &&
                          deleteContestMutation.mutate(contest._id)
                        }
                        className="btn btn-xs btn-neutral"
                      >
                        Delete
                      </button> */}

                      <button
  onClick={() => handleDeleteContest(contest._id)}
  className="btn btn-sm btn-error"
>
  Delete
</button>

                    </td>
                  </tr>
                ))}

                {contests.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-400">
                      No contests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContests;
