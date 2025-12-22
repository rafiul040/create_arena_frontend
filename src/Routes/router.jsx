
import React from "react";
import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import AddContest from "../Pages/AddContest/AddContest";
import AllContests from "../Pages/AllContests/AllContests";
import Leaderboard from "../Pages/Leaderboard/Leaderboard";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import ManageUsers from "../Pages/Admin/ManageUsers";
import ManageContests from "../Pages/Admin/ManageContests";
import ContestDetails from "../Pages/AllContests/ContestDetails";
import Payment from "../Pages/AllContests/Payment";
import PaymentSuccess from "../Pages/AllContests/PaymentSuccess";
import PaymentCancelled from "../Pages/AllContests/PaymentCancelled";
import CreatorAccess from "../Pages/Dashboard/CreatorAccess";
import ApproveCreators from "../Pages/Dashboard/ApproveCreators";
import AdminRoute from "./AdminRoute";
import Profile from "../Pages/Profile/Profile";
import Forbidden from "../Pages/Shared/Forbidden";
import MyCreatedContest from "../Pages/Dashboard/CreatorsDashboard/MyCreatedContest";
import SubmissionTask from "../Pages/Dashboard/CreatorsDashboard/SubmissionTask";
import MyContestParticipate from "../Pages/Dashboard/User/MyContestParticipate";
import MyWinningContes from "../Pages/Dashboard/User/MyWinningContes";
import MyProfile from "../Pages/Dashboard/User/MyProfile";
import MyPaymentHistory from "../Pages/Dashboard/MyPaymentHistory";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Forbidden />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "add_contest",
        element: (
          <PrivateRoute>
            <AddContest />
          </PrivateRoute>
        ),
      },
      {
        path: "creator_access",
        element: (
          <PrivateRoute>
            <CreatorAccess />
          </PrivateRoute>
        ),
      },
      { path: "all_contests", element: <AllContests /> },
      {
        path: "contests/:contestId",
        element: (
          <PrivateRoute>
            <ContestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "payment/:contestId",
        element: (
        
            <Payment />
          
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "leaderboard",
        element: (
          <PrivateRoute>
            <Leaderboard />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <Forbidden />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <Forbidden />,
    children: [
      { index: true, element: <DashboardHome /> },
      {
        path: "manage_users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage_contests",
        element: (
          <AdminRoute>
            <ManageContests />
          </AdminRoute>
        ),
      },
      {
        path: "my_created_contest",
        element: (
          <PrivateRoute>
            <MyCreatedContest />
          </PrivateRoute>
        ),
      },
      {
        path: "payment_history",
        element: (
          <PrivateRoute>
            <MyPaymentHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "approve_creators",
        element: (
          <AdminRoute>
            <ApproveCreators />
          </AdminRoute>
        ),
      },
      {
        path: "submission_task",
        element: (
          <PrivateRoute>
            <SubmissionTask />
          </PrivateRoute>
        ),
      },
      {
        path: "my_profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "my_winning_contest",
        element: (
          <PrivateRoute>
            <MyWinningContes />
          </PrivateRoute>
        ),
      },
      {
        path: "my_participate_contest",
        element: (
          <PrivateRoute>
            <MyContestParticipate />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-success",
        element: (
          // <PrivateRoute>
            <PaymentSuccess />
          // {/* </PrivateRoute> */}
        ),
      },
      {
        path: "payment-cancelled",
        element: (
          <PrivateRoute>
            <PaymentCancelled />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
