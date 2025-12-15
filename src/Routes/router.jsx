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
import PaymentHistory from "../Pages/Dashboard/PaymentHistory";
import CreatorAccess from "../Pages/Dashboard/CreatorAccess";
import ApproveCreators from "../Pages/Dashboard/ApproveCreators";
import AdminRoute from "./AdminRoute";
import Profile from "../Pages/Profile/Profile";
import Forbidden from "../Pages/Shared/Forbidden";
import MyCreatedContest from "../Pages/Dashboard/CreatorsDashboard/MyCreatedContest";
import SubmissionTask from "../Pages/Dashboard/CreatorsDashboard/SubmissionTask";
import EditContest from "../Pages/Dashboard/CreatorsDashboard/EditContest";
import ContestParticipants from "../Pages/Dashboard/CreatorsDashboard/ContestParticipants";
import MyContestParticipate from "../Pages/Dashboard/User/MyContestParticipate";
import MyWinningContes from "../Pages/Dashboard/User/MyWinningContes";
import MyProfile from "../Pages/Dashboard/User/MyProfile";
// import MyContestParticipate from "../Pages/Dashboard/User/MyContestParticipate";
// import MyProfile from "../Pages/Dashboard/User/MyProfile";
// import MyWinningContes from "../Pages/Dashboard/User/MyWinningContes";
// import MyProfile from './../Pages/Dashboard/User/MyProfile';


export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    errorElement: <Forbidden/>,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'add_contest',
        element: (
          <PrivateRoute>
            <AddContest />
          </PrivateRoute>
        )
      },
      {
        path: 'creator_access',
        element: (
          <PrivateRoute>
            <CreatorAccess />
          </PrivateRoute>
        )
      },
      {
        path: 'all_contests',
        Component: AllContests
      },
      {
        path: 'contests/:contestId',
        element: <PrivateRoute>
          <ContestDetails/>
        </PrivateRoute>
      },
      {
        path: 'payment/:contestId',
        element: <PrivateRoute>

          <Payment/>
        </PrivateRoute> 
      },
      {
        path: 'payment-success',
        Component: PaymentSuccess
      },
      {
        path: 'payment-cancelled',
        Component: PaymentCancelled
      },
      {
        path: 'profile',
        element: <PrivateRoute>
          <Profile></Profile>
        </PrivateRoute>
          
        },
        {
          path: 'leaderboard',
          element: (
            <PrivateRoute>
            <Leaderboard />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    errorElement: <Forbidden/>,
    children: [
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register
      }
    ]
  },
  {
    path: 'dashboard',
    errorElement: <Forbidden/>,
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome
      },
      {
        path: "manage_users",
        element: <AdminRoute>
          <ManageUsers></ManageUsers>
        </AdminRoute>
      },
      {
        path: "manage_contests",
        element: <AdminRoute>
          <ManageContests></ManageContests>
        </AdminRoute>
      },
      {
        path: "my_created_contest",
        element: <PrivateRoute>
          <MyCreatedContest></MyCreatedContest>
        </PrivateRoute>
      },
      {
        path: "payment_history",
        Component: PaymentHistory
      },
      {
        path: "approve_creators",
         element: <AdminRoute>
          <ApproveCreators></ApproveCreators>
        </AdminRoute>
      },
      {
        path: "submission_task",
         element: <PrivateRoute>
          <SubmissionTask></SubmissionTask>
        </PrivateRoute>
      },
      {
        path: "my_profile",
         element: <PrivateRoute>
          <MyProfile></MyProfile>
        </PrivateRoute>
      },
      {
        path: "my_winning_contest",
         element: <PrivateRoute>
          <MyWinningContes></MyWinningContes>
        </PrivateRoute>
      },
      {
        path: "my_participate_contest",
         element: <PrivateRoute>
          <MyContestParticipate/>
        </PrivateRoute>
      },
      // {
      //   path: "edit_contest",
      //    element: <PrivateRoute>
      //     <EditContest></EditContest>
      //   </PrivateRoute>
      // },
    ]
  }
]);


