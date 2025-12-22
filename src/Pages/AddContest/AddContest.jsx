import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const AddContest = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const imageHostingKey = import.meta.env.VITE_img_host_key;
  const imageHostingURL = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

  const { data: dbUser = {}, isLoading } = useQuery({
    queryKey: ['me', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const handleSendRequest = async (data) => {
    try {
      const imageFile = data.image[0];

      const formData = new FormData();
      formData.append("image", imageFile);

      const imgRes = await axios.post(imageHostingURL, formData);
      const imageURL = imgRes.data.data.url;

      const contestData = {
        name: data.name,
        type: data.type,
        description: data.description,
        price: parseFloat(data.price),
        prizeMoney: parseFloat(data.prizeMoney),
        taskDetails: data.taskInstruction, 
        deadline: data.deadline,
        image: imageURL,
        creatorEmail: user?.email,
        status: "pending",
        createdAt: new Date()
      };

      const res = await axiosSecure.post('/contests', contestData);

      if (res.data.message === "Contest created") {
        toast.success("Contest Added Successfully! ");
        reset();
        
      
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! ");
    }
  };

  const inputBase =
    "w-full border-0 border-b-2 border-gray-400 rounded-none focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-0 py-3 text-lg transition-all duration-200";

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <title>Add Contest | Create Arena</title>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Create New Contest
          </h1>
          <p className="text-xl text-gray-600">Fill all details to create your contest</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-teal-100">
          <form onSubmit={handleSubmit(handleSendRequest)} className="space-y-8">
          
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🎯 Contest Name
                </label>
                <input
                  type="text"
                  className={inputBase}
                  placeholder="Enter contest title..."
                  {...register("name", { 
                    required: "Contest name is required!" 
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🏷️ Contest Type
                </label>
                <select
                  className={inputBase}
                  {...register("type", { 
                    required: "Please select contest type!" 
                  })}
                >
                  <option value="">Select Contest Type</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Art">🖌️ Art</option>
                  <option value="Marketing">📈 Marketing</option>
                  <option value="Development">💻 Development</option>
                  <option value="Writing">✍️ Writing</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🖼️ Contest Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full max-w-md text-sm"
                {...register("image", { 
                  required: "Please upload contest image!" 
                })}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
              )}
            </div>

            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📝 Contest Description
              </label>
              <textarea
                rows="4"
                className={`${inputBase} resize-none`}
                placeholder="Describe your contest in detail..."
                {...register("description", { 
                  required: "Contest description is required!",
                  maxLength: {
                    value: 1000,
                    message: "Description cannot exceed 1000 characters!"
                  }
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  💰 Entry Fee ($)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  className={inputBase}
                  placeholder="0.00"
                  {...register("price", { 
                    required: "Entry fee is required!",
                    min: { value: 1, message: "Minimum $1" },
                    valueAsNumber: true
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🏆 Prize Money ($)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  className={inputBase}
                  placeholder="0.00"
                  {...register("prizeMoney", { 
                    required: "Prize money is required!",
                    min: { value: 1, message: "Minimum $1" },
                    valueAsNumber: true
                  })}
                />
                {errors.prizeMoney && (
                  <p className="text-red-500 text-sm mt-1">{errors.prizeMoney.message}</p>
                )}
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                 Task Instructions
              </label>
              <textarea
                rows="5"
                className={`${inputBase} resize-none`}
                placeholder="What should participants create? Provide clear instructions..."
                {...register("taskInstruction", { 
                  required: "Task instructions are required!",
                  maxLength: {
                    value: 2000,
                    message: "Instructions cannot exceed 2000 characters!"
                  }
                })}
              />
              {errors.taskInstruction && (
                <p className="text-red-500 text-sm mt-1">{errors.taskInstruction.message}</p>
              )}
            </div>

          
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                 Contest Deadline
              </label>
              <input
                type="datetime-local"
                className={inputBase}
                {...register("deadline", { 
                  required: "Deadline is required!",
                  validate: {
                    futureDate: (value) => {
                      const selectedDate = new Date(value);
                      return selectedDate > new Date() || "Deadline must be in future!";
                    }
                  }
                })}
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
              )}
            </div>

        
            <button
              type="submit"
              className="btn btn-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white w-full rounded-3xl text-xl font-bold shadow-xl hover:from-teal-700 hover:to-emerald-700 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
               Create Contest Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContest;
