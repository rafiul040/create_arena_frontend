import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';
import useAxiosSecure from '../../hooks/useAxiosSecure';



const Register = () => {
      const [showPassword, setShowPassword] = useState(false);
      const navigate = useNavigate();
      const axiosSecure = useAxiosSecure()
    const {registerUser, signInGoogle, updateUserProfile} = useAuth()
    const {
        register,
        handleSubmit,
        formState: {errors}
    } =  useForm()
      






    const handleRegistration = (data) => {
        const profileImg = data.photo[0]
        registerUser(data.email, data.password)
        .then(() => {



          const formData = new FormData();
          formData.append('image', profileImg);

          const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_host_key}`

          axios.post(imageAPIURL, formData)
          .then(res => {
            const photoURL = res.data.data.url

            const userInfo = {
              email: data.email,
              displayName: data.name,
              photoURL: photoURL,
            }
            axiosSecure.post('/users', userInfo)
            .then(res => {
              if(res.data.insertedId){
                console.log('user created in the data base' )
              }
            })


            const userProfile = {
              displayName : data.name,
              photoURL : photoURL
            }

            updateUserProfile(userProfile)
            .then(() => {
              console.log('user profile updated done')
            })
            .catch(error => {
              console.log(error)
            })

          })

           toast.success("Account created successfully! ");

      setTimeout(() => {
        navigate("/");
      }, 2000); 
        })
        .catch(error => {
          console.log(error)
        })
    }

    const handleGoogleSignIn = () => {
      signInGoogle()
      .then(result => {
        toast.success("Register with Google! ");
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
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch(errors => {
        console.log(errors)
      })
    }
    
    return (
        <div>
          <title>Register | Create Arena</title>
        <div className="w-full justify-center py-3 grid grid-cols-1 lg:ml-20">
      <form onSubmit={handleSubmit(handleRegistration)} className="w-full max-w-md space-y-6 -mt-7">
        <h4 className='text-4xl text-center mb-9 font-bold'>Create an Account</h4>
        <p className='-mt-5 text-center mb-10 font-semibold'>Register With  <span className='font-bold text-xl'>Create Arena</span></p>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold">FIRST NAME</label>
            <input type="text" className="w-full border-b border-gray-300 focus:outline-none py-1" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold">LAST NAME</label>
            <input type="text" className="w-full border-b border-gray-300 focus:outline-none py-1"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold">IMAGE</label>
          <input
            type="file"
            {...register('photo', {required: true})}
            className="w-full border-0 border-b border-gray-400 rounded-none focus:outline-none focus:border-black px-0 py-2"
          />
        </div>    
        <div>
          <label className="text-xs font-semibold">EMAIL</label>
          <input
            type="email"
            {...register('email', {required: true})}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
            />
            {errors.email?.type === "required" && <p className='text-xs text-red-500 mt-1'> Email is Required.</p>}
        </div>
        <div>
          <label className="text-xs font-semibold">PHONE NUMBER</label>
          <input
            type="number"
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
        </div>
         <div className="relative">
          <label className="text-xs font-semibold">PASSWORD</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^(){}[\]_+=\-<>.,;:]).{6,}$/

            })}
            className="w-full border-b border-gray-300 focus:outline-none py-1 pr-10"
          />
          {errors.password?.type === 'required' && <p className='text-xs text-red-500 mt-1'>Password is Required</p>}
          {errors.password?.type === 'minLength' && <p className='text-xs text-red-500 mt-1'>Password Must be 6 Characters or longer</p>}
          {errors.password?.type === 'pattern' && <p className='text-xs text-red-500 mt-1'>Must have uppercase lowercase symbol and number</p>}
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
         <div className="relative">
          <label className="text-xs font-semibold">CONFIRM PASSWORD</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register('confirmPassword', {required: true})}
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


    
        <button
          type="submit"
          className="w-full py-2 bg-secondary text-white font-semibold rounded-full hover:bg-green-800 transition"
        >
          SUBMIT
        </button>
      <p className='mt-3'>Already Have an Account? <Link to="/login" className='text-secondary font-bold underline'>Login</Link> </p>

      <p className='text-center font-bold text-gray-500'>OR</p>
<div>
</div>
      </form>
      
      <button onClick={handleGoogleSignIn} className="btn max-w-[450px] rounded-3xl bg-gray-200 text-black border-[#e5e5e5]">
  <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
  Register with Google
</button>
      {/* </div> */}
    </div>
        </div>
    );
};

export default Register;