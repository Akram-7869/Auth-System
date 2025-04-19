import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading ,setResetLink} from "../redux/slices/authSlice";
import Loader from './Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const emailRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [resetLink, setResetLinks] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    dispatch(setLoading(true));

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.success) {
        toast.success('Reset link generated successfully!');
        console.log(data.resetLink);
        const resetlink = data.resetLink;
        const token = resetlink.split('/').pop();
        console.log("toek is", token);
        dispatch(setResetLink(token));
        setResetLinks(token);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-md w-full">
        {!resetLink ? (
          <>
            <h1 className="text-center text-2xl font-bold mb-6">Forgot Password</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  ref={emailRef}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Reset Password
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-600 text-xl font-semibold mb-4">
              🔗 Click the link below to reset your password
            </p>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
              onClick={() => navigate('/reset-password')}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
