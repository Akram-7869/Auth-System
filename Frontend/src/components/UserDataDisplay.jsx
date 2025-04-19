import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setLoading, logout, setUserRole } from "../redux/slices/authSlice";

export default function UserDataDisplay() {
  const [users, setUsers] = useState([]);
  const { token, userRole, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!token) {
      toast.error('No token found. Please login again.');
      dispatch(logout());
      navigate('/login');
      return;
    }
    
    const fetchUsers = async () => {
      dispatch(setLoading(true));
      
      try {
        const URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${URL}/api/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 401) {
            dispatch(logout());
            navigate('/login');
          }
          
          throw new Error(errorData.message || "Failed to fetch users");
        }
        
        const data = await response.json();
        setUsers(Array.isArray(data.data) ? data.data : []);
        console.log("Users data:", data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch user data");
        console.error("Error fetching user data:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [token, navigate, dispatch, userRole]);

  const generateColorClass = (name) => {
    const colors = [
      "bg-blue-500 dark:bg-blue-600",
      "bg-purple-500 dark:bg-purple-600",
      "bg-green-500 dark:bg-green-600",
      "bg-red-500 dark:bg-red-600",
      "bg-yellow-500 dark:bg-yellow-600",
      "bg-pink-500 dark:bg-pink-600",
      "bg-indigo-500 dark:bg-indigo-600",
      "bg-teal-500 dark:bg-teal-600"
    ];
    
    const nameHash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[nameHash % colors.length];
  };

  const handleLogout = () => {
      dispatch(logout());
      dispatch(setUserRole(null));
      toast.success('Logged out successfully');
      navigate('/login');
    };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white ">Users Dashboard</h1>
          <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
              >
                Logout
        </button>
        </header>
        

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((placeholder) => (
              <div 
                key={placeholder} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg">
            <p className="font-medium">No users found</p>
            <p className="mt-1 text-sm">There seems to be an issue with the system or no users are registered.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div 
                key={user.id || user._id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${generateColorClass(user.name)}`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{user.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      {user.email}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${generateColorClass(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && users.length > 0 && (
          <footer className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>Showing all {users.length} users • Last updated: {new Date().toLocaleString()}</p>
          </footer>
        )}
      </div>
    </div>
  );
}