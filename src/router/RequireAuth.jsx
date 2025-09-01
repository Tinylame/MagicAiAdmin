// 路由守卫组件

import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("admin-token");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;