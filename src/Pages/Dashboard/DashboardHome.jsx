import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useRole from '../../hooks/useRole';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { FaWallet, FaTrophy, FaGamepad, FaUsers, FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const DashboardHome = () => {
    const { user } = useAuth();
    const { role, roleLoading } = useRole();
    const axiosSecure = useAxiosSecure();

    // Unified state for all roles
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (roleLoading || !user?.email) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                if (role === 'admin') {
                    // Admin Data Fetching
                    const [usersRes, contestsRes] = await Promise.all([
                        axiosSecure.get('/users'),
                        axiosSecure.get('/contests')
                    ]);
                    setData({
                        users: usersRes.data,
                        contests: contestsRes.data
                    });
                } else if (role === 'creator') {
                    // Creator Data Fetching
                    const contestsRes = await axiosSecure.get(`/my-contests?email=${user.email}`);
                    setData({
                        contests: contestsRes.data
                    });
                } else {
                    // User Data Fetching
                    const [paymentsRes, statsRes] = await Promise.all([
                        axiosSecure.get(`/payments/history/${user.email}`),
                        axiosSecure.get(`/users/${user.email}/stats`)
                    ]);
                    setData({
                        payments: paymentsRes.data,
                        stats: statsRes.data || { won: 0, participated: 0, created: 0 }
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, role, roleLoading, axiosSecure]);

    if (roleLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // --- ADMIN VIEW ---
    if (role === 'admin') {
        const totalUsers = data.users.length;
        const totalContests = data.contests.length;
        const acceptedContests = data.contests.filter(c => c.status === 'approved').length;
        const pendingContests = data.contests.filter(c => c.status === 'pending').length;

        const pieData = {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [{
                data: [
                    acceptedContests,
                    pendingContests,
                    data.contests.filter(c => c.status === 'rejected').length
                ],
                backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
                borderWidth: 0
            }]
        };

        return (
            <div className="p-6 space-y-8 bg-base-100 min-h-screen">
                <title>Admin Dashboard | Create Arena</title>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800">Admin Overview</h1>
                        <p className="text-gray-500">Global system statistics and controls.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Users" value={totalUsers} icon={<FaUsers />} color="blue" />
                    <StatCard title="Total Contests" value={totalContests} icon={<FaClipboardList />} color="purple" />
                    <StatCard title="Active Contests" value={acceptedContests} icon={<FaCheckCircle />} color="green" />
                    <StatCard title="Pending Review" value={pendingContests} icon={<FaClock />} color="orange" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Contest Status Distribution</h2>
                        <div className="h-64 flex justify-center">
                            <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link to="/dashboard/manage_users" className="btn btn-outline btn-primary h-auto py-6 flex flex-col gap-2">
                                <FaUsers className="text-2xl" /> Manage Users
                            </Link>
                            <Link to="/dashboard/manage_contests" className="btn btn-outline btn-secondary h-auto py-6 flex flex-col gap-2">
                                <FaClipboardList className="text-2xl" /> Manage Contests
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- CREATOR VIEW ---
    if (role === 'creator') {
        const myContests = data.contests;
        const approved = myContests.filter(c => c.status === 'approved').length;
        const pending = myContests.filter(c => c.status === 'pending').length;

        return (
            <div className="p-6 space-y-8 bg-base-100 min-h-screen">
                <title>Creator Dashboard | Create Arena</title>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800">Creator Studio</h1>
                        <p className="text-gray-500">Track your contests and submissions.</p>
                    </div>
                    <Link to="/dashboard/adds_contest" className="btn btn-primary">
                        + Add New Contest
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="My Contests" value={myContests.length} icon={<FaTrophy />} color="indigo" />
                    <StatCard title="Live Now" value={approved} icon={<FaCheckCircle />} color="green" />
                    <StatCard title="Under Review" value={pending} icon={<FaClock />} color="orange" />
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Recent Contests</h2>
                        <Link to="/dashboard/my_created_contest" className="btn btn-ghost btn-sm">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                                    <th className="py-4">Name</th>
                                    <th className="py-4">Price</th>
                                    <th className="py-4">Status</th>
                                    <th className="py-4">Participants</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myContests.slice(0, 5).map(c => (
                                    <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="font-bold">{c.name}</td>
                                        <td>${c.price}</td>
                                        <td>
                                            <span className={`badge badge-sm ${c.status === 'approved' ? 'badge-success' : c.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td>{c.participantsCount || 0}</td>
                                    </tr>
                                ))}
                                {myContests.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-4">No contests found. Create one!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // --- USER VIEW ---
    // Extracting stats for User
    const { payments, stats } = data;

    // Bar Chart
    const paymentLabels = payments.slice(0, 10).map(p => p.contestName?.substring(0, 15) + (p.contestName?.length > 15 ? '...' : '') || 'Unknown');
    const paymentData = payments.slice(0, 10).map(p => p.price);
    const barChartData = {
        labels: paymentLabels,
        datasets: [{
            label: 'Payment Amount (৳)',
            data: paymentData,
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
            borderRadius: 4,
        }],
    };

    // Doughnut Chart
    const doughnutData = {
        labels: ['Won', 'Lost'],
        datasets: [{
            data: [stats.won, Math.max(0, stats.participated - stats.won)],
            backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)'],
            borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)'],
            borderWidth: 1,
        }],
    };

    return (
        <div className="p-6 space-y-8 bg-base-100 min-h-screen">
            <title>Dashboard | Create Arena</title>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800">Welcome back, {user?.displayName}!</h1>
                    <p className="text-gray-500 mt-1">Here's your performance overview directly from the arena.</p>
                </div>
                <Link to="/dashboard/my_profile" className="btn btn-primary btn-sm md:btn-md shadow-lg shadow-indigo-200">
                    Edit Profile
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Contests Joined" value={stats.participated} icon={<FaGamepad />} color="indigo" />
                <StatCard title="Contests Won" value={stats.won} icon={<FaTrophy />} color="green" />
                <StatCard title="Total Payments" value={payments.length} icon={<FaWallet />} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                        Recent Payments
                    </h2>
                    <div className="h-64">
                        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { display: false } } }} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                        Win Ratio
                    </h2>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                        Transaction History
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="py-4">Contest</th>
                                <th className="py-4">Amount</th>
                                <th className="py-4">Txn ID</th>
                                <th className="py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.slice(0, 5).map((payment) => (
                                <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="font-bold">{payment.contestName}</td>
                                    <td className="text-indigo-600 font-bold">৳{payment.price}</td>
                                    <td className="font-mono text-xs text-gray-500">{payment.transactionId}</td>
                                    <td><span className="badge badge-success badge-sm text-white">Completed</span></td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr><td colSpan="4" className="text-center py-4 text-gray-500">No transactions</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Helper Component for consistency
const StatCard = ({ title, value, icon, color }) => (
    <div className={`stat bg-white shadow-lg rounded-2xl border border-${color}-50 hover:border-${color}-200 transition-colors`}>
        <div className={`stat-figure text-${color}-500`}>
            <div className="text-4xl opacity-80">{icon}</div>
        </div>
        <div className="stat-title font-semibold text-gray-500">{title}</div>
        <div className={`stat-value text-${color}-600`}>{value}</div>
    </div>
);

export default DashboardHome;