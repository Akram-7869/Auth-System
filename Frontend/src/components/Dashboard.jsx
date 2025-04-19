import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setUserRole, setLoading } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import Loader from "./Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { userRole, token, loading } = useSelector((state) => state.auth);

  useEffect(() => {

    if (!token) {
      toast.error('No token found. Please login again.');
      dispatch(logout());
      dispatch(setUserRole(null));
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const res = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await res.json();
        console.log("check the data", userData);
        
        if (res.ok) {
          setData(userData.data);
          // Update Redux store with fetched user role if needed
          if (userData.data.role && userData.data.role !== userRole) {
            dispatch(setUserRole(userData.data.role));
          }
        } else {
          toast.error(userData.message || 'Failed to fetch user');
          // If token is invalid, logout user
          if (res.status === 401) {
            dispatch(logout());
            dispatch(setUserRole(null));
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        toast.error('Something went wrong');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch, navigate, token]); 

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setUserRole(null));
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              {userRole === "ADMIN" && (
                <button
                  onClick={() => navigate('/usersLists')}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                >
                  Users List
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center">
                {data?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{data?.name}</h2>
                <p className="text-gray-600">{data?.email}</p>
              </div>
            </div>

            <p className="text-gray-700">
              <span className="font-semibold">Role: </span> {data?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;