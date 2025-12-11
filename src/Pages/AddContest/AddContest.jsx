import React from 'react';
import { useForm } from "react-hook-form";
import useAxiosSecure from '../../hooks/useAxiosSecure';
// import useAuth from '../../hooks/useAuth';

const AddContest = () => {

   const { register, handleSubmit, formState: {errors}} = useForm();


//    const {user} = useAuth()

   const axiosSecure = useAxiosSecure()

   const handleSendRequest = (data) => {
    console.log(data)
    axiosSecure.post('/contests', data)
    .then(res => {
        console.log('after saving add contests', res.data)
    })
   }


  const inputBase =
    "w-full border-0 border-b border-gray-400 rounded-none focus:outline-none focus:border-black px-0 py-2";

  return (
    <div className="max-w-xl mx-auto mt-10 p-8">
      <h2 className="text-2xl font-semibold mb-9 -mt-8 text-center">Add Contest</h2>

      <form onSubmit={handleSubmit(handleSendRequest)} className="space-y-6">

    
        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-xs font-semibold">CONTEST NAME</label>
            <input
              type="text"
              className={inputBase}
              {...register("name", { required: true })}
            />
            {errors.name?.type === "required" && <p className='mt-1 text-red-500 text-xs'>Name Required</p>}
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
                {errors.type?.type === "required" && <p className='mt-1 text-red-500 text-xs'>Type Required</p>}
          </div>
        </div>

        
        <div>
          <label className="text-xs font-semibold">IMAGE</label>
          <input
            type="file"
            className={inputBase}
            {...register("image", { required: true })}
            />
            {errors.image?.type === "required" && <p className='mt-1 text-red-500 text-xs'>Photo Required</p>}
          {}
        </div>


        <div>
          <label className="text-xs font-semibold">DESCRIPTION</label>
          <textarea
            rows="3"
            className={inputBase}
            {...register("description", { required: true })}
            />
            {errors.description?.type === "required" && <p className='mt-1 text-red-500 text-xs'>Description Required</p>}
        </div>

        
        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-xs font-semibold">PRICE</label>
            <input
              type="number"
              className={inputBase}
              {...register("price", { required: true })}
              />
              {errors.price?.type === "required" && <p className='mt-1 text-red-500 text-xs'>Price Required</p>}
          </div>

          <div className="w-full">
            <label className="text-xs font-semibold">PRIZE MONEY</label>
            <input
              type="number"
              className={inputBase}
              {...register("prizeMoney", { required: true })}
              />
              {errors.price?.type === "required" && <p className='mt-1 text-red-500 text-xs'>Prize Money Required</p>}
          </div>
        </div>

        
        <div>
          <label className="text-xs font-semibold">TASK INSTRUCTION</label>
          <textarea
            rows="3"
            className={inputBase}
            {...register("taskInstruction", { required: true })}
            />
            {errors.price?.type === "required" && <p className='mt-1 text-red-500 text-xs'>Task Instruction Required</p>}
        </div>

        
        <div>
          <label className="text-xs font-semibold">DEADLINE</label>
          <input
            type="date"
            className={inputBase}
            {...register("deadline", { required: true })}
            />
            {errors.price?.type === "required" && <p className='mt-1 text-red-500 text-xs'>Deadline Required</p>}
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
