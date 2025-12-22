import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EditContest = () => {
  const { id } = useParams(); // contest ID from route
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    prizeMoney: "",
    deadline: "",
    image: ""
  });

  
  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contests/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setFormData({
        name: data.name || "",
        type: data.type || "",
        price: data.price || "",
        prizeMoney: data.prizeMoney || "",
        deadline: data.deadline ? data.deadline.split("T")[0] : "",
        image: data.image || ""
      });
    }
  });

  
  const updateMutation = useMutation({
    mutationFn: async (updatedData) =>
      axiosSecure.patch(`/contests/${id}`, updatedData),
    onSuccess: () => {
      Swal.fire("Updated!", "Contest updated successfully", "success");
      queryClient.invalidateQueries(["myCreatedContests"]);
      navigate("/my-created-contests"); 
    },
    onError: (err) => {
      Swal.fire("Error!", err.response?.data?.message || "Update failed", "error");
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Contest</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contest Name"
            className="input input-bordered w-full"
            required
          />

          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Contest Type"
            className="input input-bordered w-full"
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Entry Price ($)"
            className="input input-bordered w-full"
            required
          />

          <input
            type="number"
            name="prizeMoney"
            value={formData.prizeMoney}
            onChange={handleChange}
            placeholder="Prize Money ($)"
            className="input input-bordered w-full"
            required
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />

          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="input input-bordered w-full"
          />

          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Updating..." : "Update Contest"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditContest;
