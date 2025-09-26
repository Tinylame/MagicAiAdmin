import { createHashRouter, Navigate } from 'react-router-dom';
import HomeView from "@pages/HomeView";
import Login from "@pages/Login";
import Home from "@pages/Home";
import Conventional from "@pages/Conventional";
import Cost from "@pages/Cost";
import Invoice from "@pages/Invoice";
import Permission from "@pages/Permission";
import Recharge from "@pages/Recharge";
import Withdrawal from "@pages/Withdrawal";
import User from "@pages/User";
import Merchant from "@pages/Merchant";
import Feedback from "@pages/Feedback";
import RequireAuth from './RequireAuth.jsx'
import NProgress from '../utils/nprogress';
import DyData from '@pages/DyData';
import React from 'react';
import InvitationCode from "@pages/InvitationCode";
import Certification from "@pages/Certification";

// 包装组件，在组件挂载时显示进度条
const withProgress = (Component) => {
  const WrappedComponent = (props) => {
    React.useEffect(() => {
      NProgress.start();
      const timer = setTimeout(() => NProgress.done(), 200);
      return () => {
        clearTimeout(timer);
        NProgress.done();
      };
    }, []);
    return React.createElement(Component, props);
  };
  return WrappedComponent;
};

const router = createHashRouter([
 
    {
        path: "/",
        element:<RequireAuth><HomeView /></RequireAuth> ,
        children:[
            {
                index: true,
                element: <Navigate to="/home" replace />,
            },
            {
                path: "/home",
                element: React.createElement(withProgress(Home)),
            },
            {
                path: "/conventional",
                element: React.createElement(withProgress(Conventional)),
            },
            {
                path: "/cost",
                element: React.createElement(withProgress(Cost)),
            },
            {
                path: "/invoice",
                element: React.createElement(withProgress(Invoice)),
            },
            {
                path: "/permission",
                element: React.createElement(withProgress(Permission)),
            },
            {
                path: "/recharge",
                element: React.createElement(withProgress(Recharge)),
            },
            {
                path: "/withdrawal",
                element: React.createElement(withProgress(Withdrawal)),
            },
            {
                path: "/user",
                element: React.createElement(withProgress(User)),
            },
            {
                path: "/merchant",
                element: React.createElement(withProgress(Merchant)),
            },
            {
                path: "/feedback",
                element: React.createElement(withProgress(Feedback)),
            },
            {
                path: "/dyData",
                element: React.createElement(withProgress(DyData)),
            },
            {
                path: "/invitationCode",
                element: React.createElement(withProgress(InvitationCode)),
            },
            {
                path: "/Certification",
                element: React.createElement(withProgress(Certification)),
            }

        ]
    },
    {
        path: "/login",
        element: React.createElement(withProgress(Login)),
    },
]);

export default router;