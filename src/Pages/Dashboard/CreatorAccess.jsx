import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const CreatorAccess = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const axiosSecure= useAxiosSecure()

  
  useEffect(() => {
    document.title = "Creator Access | Create Arena";
  }, []);

  const handleCreatorAccess = (data) => {



    axiosSecure.post('/creator', data)
    .then(res => {
        if(res.data.insertedId){
             Swal.fire({
                position: "top-end",
      title: 'Your Creator Role Application has been Submitted. We will Reach Out In 7 Working Days!',
      icon: 'success',
      showConfirmButton: 'false',
      timer: 2500,
    });
        }
    })
    console.log(data)

    reset()

    
  };

  return (
    <div className="w-full flex justify-center py-10">
      <form
        onSubmit={handleSubmit(handleCreatorAccess)}
        className="w-full max-w-md space-y-6"
      >
        <h4 className="text-4xl text-center mb-15 font-bold">
          Create Your Role
        </h4>


        <div>
          <label className="text-xs font-semibold">CREATOR NAME</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">
              Name is required
            </p>
          )}
        </div>


       
        <div>
          <label className="text-xs font-semibold">CREATOR EMAIL</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              Email is required
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold">PHONE NUMBER</label>
          <input
            type="number"
            {...register("phone", { required: true })}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">
              Number is required
            </p>
          )}
        </div>

  
        <div>
          <label className="text-xs font-semibold">CREATOR AGE</label>
          <input
            type="number"
            {...register("age", { required: true })}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
          {errors.age && (
            <p className="text-xs text-red-500 mt-1">
              Age is required
            </p>
          )}
        </div>

  
        <div>
          <label className="text-xs font-semibold">YOUR CITY</label>
          <input
            type="text"
            {...register("city", { required: true })}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
          {errors.city && (
            <p className="text-xs text-red-500 mt-1">
              City is required
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold">
            Short Bio or Description of Your Interests
          </label>
          <textarea
            rows="3"
            {...register("description", { required: true })}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
                Description / Details Needed
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-secondary text-white font-semibold rounded-full hover:bg-green-800 transition"
        >
          Apply for Creator Role
        </button>
      </form>
    </div>
  );
};

export default CreatorAccess;
