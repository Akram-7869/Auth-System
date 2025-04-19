import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setLoading, loginSuccess, authError, setUserRole, logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user} = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/me');
    }
  }, [isAuthenticated, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      role: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(setLoading(true));
    
    try {
      const URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(data.data.role);
        dispatch(loginSuccess(data.data.token));
        dispatch(setUser(data.data.role));
        toast.success('Signup successful!');
        navigate('/me');
      } else {
        dispatch(authError());
        toast.error(data.message || 'Signup failed');
      }
    } catch (error) {
      dispatch(authError());
      toast.error('Something went wrong. Please try again.');
    }finally {
      dispatch(setLoading(false)); 
    }
  };

  return (
    <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <img
            className="mx-auto h-12 w-auto"
            src="https://www.svgrepo.com/show/499664/user-happy.svg"
            alt="Signup"
          />
          <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign up for an account
          </h2>

          <form className="space-y-6" onSubmit={handleOnSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                type="text"
                required
                onChange={handleOnChange}
                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                onChange={handleOnChange}
                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                onChange={handleOnChange}
                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              />
            </div>

            <div className="border rounded-md p-4 w-full mx-auto max-w-2xl">
              <h4 className="block text-sm font-medium text-gray-700 mb-2">Select Your Role</h4>
              <label className="flex items-center bg-gray-100 text-gray-700 rounded-md px-3 py-2 mb-2 hover:bg-indigo-300 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="STAFF"
                  checked={formData.role === 'STAFF'}
                  onChange={handleRoleChange}
                />
                <span className="pl-2">STAFF</span>
              </label>

              <label className="flex items-center bg-gray-100 text-gray-700 rounded-md px-3 py-2 mb-2 hover:bg-indigo-300 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="SUPERVISOR"
                  checked={formData.role === 'SUPERVISOR'}
                  onChange={handleRoleChange}
                />
                <span className="pl-2">SUPERVISOR</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;