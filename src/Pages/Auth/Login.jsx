import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const axiosSecure = useAxiosSecure()

  const location = useLocation()
  const navigate = useNavigate()
  console.log(location )

    const {signInUser, signInGoogle} = useAuth()
    const {
        register,
        handleSubmit,
        formState: {errors}
    } =  useForm()
      

    const handleLogin = (data) => {
        console.log('after register', data)
        signInUser(data.email, data.password)
        .then(result => {
          console.log(result.user)
          navigate(location?.state || '/')
        })
        .catch(error => {
          console.log(error)
        })
      }
      
      
      const handleGoogleSignIn = () => {
        signInGoogle()
        .then(result => {
          console.log(result.user)
           const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }

        axiosSecure.post('/users', userInfo)
        .then(res => {
          console.log("user data has been stored", res.data)
        })
        
          navigate(location?.state || '/')
      })
      .catch(error => {
      console.log(error)
      })
    }

  return (
    <div className="w-full grid grid-cols-1 justify-center items-center py-10">
                <title>Log In | Create Arena</title>

      <form onSubmit={handleSubmit(handleLogin)} className="w-full max-w-md space-y-6">
        <h4 className="text-4xl text-center mb-12 font-bold">Welcome Back!</h4>
        <p className="-mt-5 text-center mb-10 font-semibold">
          Login to <span className="font-bold text-xl">Create Arena</span>
        </p>

        <div>
          <label className="text-xs font-semibold">EMAIL</label>
          <input
          {...register('email', {required: true, })}
          type="email"
          className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
          {errors.email?.type === 'required' && <p className="text-red-500 text-xs mt-1">Email is Required</p>}
        </div>

    
        <div className="relative">
          <label className="text-xs font-semibold">PASSWORD</label>
          <input
          {...register('password', {required: true, minLength: 6})}
            type={showPassword ? "text" : "password"}
            className="w-full border-b border-gray-300 focus:outline-none py-1 pr-10"
          />
          
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-1 cursor-pointer text-gray-500"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0112 19c-6 0-10-7-10-7a20.8 20.8 0 016.11-6.11"></path>
                <path d="M1 1l22 22"></path>
              </svg>
            )}
          </span>
        </div>
          {errors.password?.type === 'required' && <p className="text-red-500 text-xs -mt-5">Password Required</p>}
          {errors.password?.type === 'minLength' && <p className="text-red-500 text-xs -mt-4">Password Must be 6 Character or longer</p>}

        <div className="text-right -mt-4">
          <Link to="/forgot-password" className="text-secondary underline text-sm">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-secondary text-white font-semibold rounded-full hover:bg-green-500 transition"
        >
          LOGIN
        </button>

        <p className="mt-3 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-secondary font-bold underline">
            Register
          </Link>
        </p>

        <p className="text-center font-bold text-gray-500">OR</p>

      </form>
        <button onClick={handleGoogleSignIn} className="btn max-w-[450px] rounded-3xl bg-gray-200 text-black border-[#e5e5e5]">
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="inline mr-2"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Login with Google
        </button>
    </div>
  );
};

export default Login;
