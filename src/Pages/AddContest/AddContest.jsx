import React from 'react';
import { useForm } from "react-hook-form";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const AddContest = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const imageHostingKey = import.meta.env.VITE_img_host_key;
  const imageHostingURL = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;




  const { data: dbUser = {}, isLoading } = useQuery({
  queryKey: ['me', user?.email],
  enabled: !!user?.email,
  queryFn: async () => {
    const res = await axiosSecure.get(`/users/me/${user.email}`);
    return res.data;
  },
});




console.log(dbUser, isLoading)

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
        price: data.price,
        prizeMoney: data.prizeMoney,
        taskInstruction: data.taskInstruction,
        deadline: data.deadline,
        image: imageURL,         
        email: user?.email,
        status: "pending",
        createdAt: new Date()
      };

      
      const res = await axiosSecure.post('/contests', contestData);

      if (res.data.insertedId) {
        toast.success("Contest Added Successfully!");
        reset();
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };




  const inputBase =
    "w-full border-0 border-b border-gray-400 rounded-none focus:outline-none focus:border-black px-0 py-2";

  return (
    <div className="max-w-xl mx-auto mt-10 p-8">
      <title>Add Contest | Create Arena</title>
      <h2 className="text-2xl font-semibold mb-9 -mt-8 text-center">
        Add Contest
      </h2>

      <form onSubmit={handleSubmit(handleSendRequest)} className="space-y-6">

        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-xs font-semibold">CONTEST NAME</label>
            <input
              type="text"
              className={inputBase}
              {...register("name", { required: true })}
            />
            {errors.name?.type && <p className='text-red-500 text-xs mt-1'></p>}
          </div>

          <div className="w-full">
            <label className="text-xs font-semibold">TYPE</label>
            <select
              className={inputBase}
              {...register("type", { required: true })}
            >
              <option value="">Select</option>
              <option>Design</option>
              <option>Art</option>
              <option>Marketing</option>
              <option>Development</option>
            </select>
          </div>
        </div>

      
        <div>
          <label className="text-xs font-semibold">IMAGE</label>
          <input
            type="file"
            className={inputBase}
            {...register("image", { required: true })}
          />
        </div>

        <div>
          <label className="text-xs font-semibold">DESCRIPTION</label>
          <textarea
            rows="3"
            className={inputBase}
            {...register("description", { required: true })}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-xs font-semibold">PRICE</label>
            <input
              type="number"
              className={inputBase}
              {...register("price", { required: true })}
            />
          </div>

          <div className="w-full">
            <label className="text-xs font-semibold">PRIZE MONEY</label>
            <input
              type="number"
              className={inputBase}
              {...register("prizeMoney", { required: true })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold">TASK INSTRUCTION</label>
          <textarea
            rows="3"
            className={inputBase}
            {...register("taskInstruction", { required: true })}
          />
        </div>

        <div>
          <label className="text-xs font-semibold">DEADLINE</label>
          <input
            type="date"
            className={inputBase}
            {...register("deadline", { required: true })}
          />
        </div>

        <button
          type="submit"
          className="btn bg-teal-900 text-white w-full rounded-full mt-4"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default AddContest;
