// import { createBrowserRouter } from "react-router";
// import RootLayout from "../Layouts/RootLayout";
// import Home from "../Pages/Home/Home";
// import AuthLayout from "../Layouts/AuthLayout";
// import Login from "../Pages/Auth/Login";
// import Register from "../Pages/Auth/Register";
// import DashboardHome from "../Pages/Dashboard/DashboardHome";
// import AddContest from "../Pages/AddContest/AddContest";
// import AllContests from "../Pages/AllContests/AllContests";
// import Leaderboard from "../Pages/Leaderboard/Leaderboard";
// import PrivateRoute from "./PrivateRoute";
// import DashboardLayout from "../Layouts/DashboardLayout";
// import ManageUsers from "../Pages/Admin/ManageUsers";
// import ManageContests from "../Pages/Admin/ManageContests";
// import ContestDetails from "../Pages/AllContests/ContestDetails";
// import Payment from "../Pages/AllContests/Payment";













// export const router = createBrowserRouter([
//     {
//         path: '/',
//         Component: RootLayout,
//         children: [
//             {
//                 index: true,
//                 Component: Home
//             },
//             // {
//             //     path: 'dashboard',
//             //     Component: DashboardHome
//             // },
//             {
//                 path: 'add_contest',
//                 // Component: AddContest
//                 element: <PrivateRoute>
//                     <AddContest></AddContest>
//                 </PrivateRoute>
//             },
//             {
//                 path: 'all_contests',
//                 Component: AllContests
//             },
//             {
//                 path: 'contests/:contestId',
//                 Component: ContestDetails
//             }
// ,
//             {
//                 path: '/payment/:id',
//                 Component: Payment
//             },
//             {
//                 path: 'leaderboard',
//                 element: <PrivateRoute>
//                     <Leaderboard></Leaderboard>
//                 </PrivateRoute>
//             },
//         ]
//     },
//     {
//         path: '/',
//         Component: AuthLayout,
//         children: [
//             {
//                 path: "login",
//                 Component: Login
//             },
//             {
//                 path: "register",
//                 Component: Register
//             },
//         ]
//     },
//     {
//         path: 'dashboard',
//         element: <PrivateRoute>
//             <DashboardLayout></DashboardLayout>
//         </PrivateRoute>,
//         children: [
//             {
//                 index: true,
//                 Component: DashboardHome
//             },
//             {
//                 path: "manage_users",
//                 Component: ManageUsers
//             },
//             {
//                 path: "manage_contests",
//                 Component: ManageContests
//             },
//         ]
//     },
// ])
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

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
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
        path: 'all_contests',
        Component: AllContests
      },
      {
        path: 'contests/:contestId',
        Component: ContestDetails
      },
      {
        path: 'payment/:contestId',
        Component: Payment
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
        Component: ManageUsers
      },
      {
        path: "manage_contests",
        Component: ManageContests
      }
    ]
  }
]);
