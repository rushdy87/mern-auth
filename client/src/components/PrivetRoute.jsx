import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const PrivetRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivetRoute;
