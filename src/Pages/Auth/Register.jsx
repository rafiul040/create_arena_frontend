import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { registerUser, signInGoogle, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

 
  const handleRegistration = async (data) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      const profileImg = data.photo[0];

      
      await registerUser(data.email, data.password);

      
      const formData = new FormData();
      formData.append("image", profileImg);

      const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_host_key}`;
      const imgRes = await axios.post(imageAPIURL, formData);

      const photoURL = imgRes?.data?.data?.url;
      if (!photoURL) throw new Error("Image upload failed");

  
      await updateUserProfile({
        displayName: fullName,
        photoURL,
      });

      
      const userInfo = {
        email: data.email,
        displayName: fullName,
        photoURL,
        phone: data.phone || "",
      };

      await axiosSecure.post("/users", userInfo);

      toast.success("Account created successfully 🎉");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed ❌");
    }
  };

  
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInGoogle();

      const userInfo = {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };

      await axiosSecure.post("/users", userInfo);

      toast.success("Registered with Google 🎉");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Google sign-in failed ❌");
    }
  };

  return (
    <div className="w-full justify-center py-3 grid grid-cols-1 lg:ml-20">
      <form
        onSubmit={handleSubmit(handleRegistration)}
        className="w-full max-w-md space-y-6"
      >
        <h4 className="text-4xl text-center font-bold">
          Create an Account
        </h4>

        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold">FIRST NAME</label>
            <input
              {...register("firstName", { required: true })}
              className="w-full outline-none border-b py-1"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">First name is required</p>
            )}
          </div>

          <div className="flex-1">
            <label className="text-xs font-semibold">LAST NAME</label>
            <input
              {...register("lastName", { required: true })}
              className="w-full border-b outline-none py-1"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">Last name is required</p>
            )}
          </div>
        </div>

        
        <div>
          <label className="text-xs font-semibold">IMAGE</label>
          <input
            type="file"
            {...register("photo", { required: true })}
            className="w-full border-b outline-none py-2"
          />
          {errors.photo && (
            <p className="text-xs text-red-500">Image is required</p>
          )}
        </div>

      
        <div>
          <label className="text-xs font-semibold">EMAIL</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full border-b outline-none py-1"
          />
          {errors.email && (
            <p className="text-xs text-red-500">Email is required</p>
          )}
        </div>

        
        <div>
          <label className="text-xs font-semibold">PHONE</label>
          <input
            type="number"
            {...register("phone")}
            className="w-full border-b outline-none py-1"
          />
        </div>

        
        <div className="relative">
          <label className="text-xs font-semibold">PASSWORD</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: true,
              minLength: 6,
              pattern:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).{6,}$/,
            })}
            className="w-full border-b outline-none py-1 pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-1 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

          {errors.password && (
            <p className="text-xs text-red-500">
              Password must be strong
            </p>
          )}
        </div>

        
        {/* <div>
          <label className="text-xs font-semibold">CONFIRM PASSWORD</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="w-full border-b outline-none py-1"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div> */}

    
        <button
          type="submit"
          className="w-full py-2 bg-secondary text-white font-semibold rounded-full"
        >
          SUBMIT
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary font-bold underline">
            Login
          </Link>
        </p>

        <p className="text-center font-bold text-gray-500">OR</p>

  
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2 bg-gray-200 rounded-3xl"
        >
          Register with Google
        </button>
      </form>
    </div>
  );
};

export default Register;
