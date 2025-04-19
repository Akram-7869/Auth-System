import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from "../redux/slices/authSlice";
import Loader from './Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, resetLink} = useSelector((state) => state.auth);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = passwordRef.current.value;

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

  
    if (!resetLink) {
      toast.error('Invalid or missing ResetLink');
      navigate('/forgot-password');
      return;
    }

    dispatch(setLoading(true));

    try {
      const response = await fetch(`http://localhost:3000/api/auth/reset-password/${resetLink}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h1 className="text-center text-2xl font-bold mb-6">Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              New Password
            </label>
            <input
              ref={passwordRef}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter new password"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
