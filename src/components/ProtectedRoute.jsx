import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuth, user } = useSelector((state) => state.auth);

  return (
    isAuth ? user && <Outlet /> : <Navigate to="/login" state={{from : location}} replace />
  )
};

export default ProtectedRoute;
