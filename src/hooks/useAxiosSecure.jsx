// import axios from 'axios';
// import React, { useEffect } from 'react';
// import useAuth from './useAuth';
// import { useNavigate } from 'react-router';


// const axiosSecure= axios.create({
//     baseURL: 'http://localhost:3000'
// })
// const useAxiosSecure = () => {
//     const {user, logOut} = useAuth()
//     const navigate = useNavigate()
//     useEffect(() => {
//         const reqInterceptor = axiosSecure.interceptors.request.use(config => {
//             config.headers.Authorization = `Bearer ${user?.accessToken}`
//             return config
//         })


//         const resInterceptor = axiosSecure.interceptors.response.use((response) => {
//             return response
//         }, (error) => {
//             console.log(error)

//             const statusCode = error.status;
//             if(statusCode === 401 || statusCode === 403){
//                 logOut()
//                 .then(() => {
//                     navigate('/login')
//                 })
//             }



//             return Promise.reject(error)
//         })


//         return () => {
//             axiosSecure.interceptors.request.eject(reqInterceptor)
//             axiosSecure.interceptors.response.eject(resInterceptor)
//         }


//     }, [user, logOut, navigate])

//     return axiosSecure
// };

// export default useAxiosSecure;





import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // REQUEST INTERCEPTOR
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await user.getIdToken(); // ✅ ALWAYS VALID TOKEN
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const statusCode = error.response?.status;

        if (statusCode === 401 || statusCode === 403) {
          logOut().then(() => navigate("/login"));
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
