import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';



const ManageContests = () => {
    const {user} = useAuth()
    const axiosSecure = useAxiosSecure()

    const {data: contests = []} = useQuery({
        queryKey: ['manageUsers', user?.email],
        queryFn: async() => {
            const res = await axiosSecure.get(`/contests?email=${user.email}`)
            return res.data 
        }
    })


    return (
        <div>
            <h2>All of My Users {contests.length}</h2>
            {
                contests.map(user => <p>{user.name}</p>)
            }
        </div>
    );
};

export default ManageContests;