import React from 'react'
import Signup from './components/Signup'
import { Route, BrowserRouter as Router, Routes, Navigate} from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserDataDisplay from './components/UserDataDisplay'
import ProtectedRoute from './components/ProtectedRoute'
import Toast from './components/Toast'
import { Provider } from 'react-redux'
import {store} from "./redux/store/store";
import AdminProtectedRoute from './components/AdminProtectedRoute'
import ResetPassword from './components/ResetPassword'
import ForgotPassword from './components/ForgotPassword'
import ResetProtectedRoute from './components/ResetProtectedRoute'

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Toast/>
    <Routes>
    <Route path='/signUp' element={<Signup />} />
    <Route path='/login' element={<Login />} />
    <Route path='/me' element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path='/usersLists' element={
      <AdminProtectedRoute>
        <UserDataDisplay />
      </AdminProtectedRoute>
    } />
    <Route path='/' element={<Navigate to="/signUp" />} />
    <Route path='/forgot-password' element={<ForgotPassword/>}/>
    <Route path='/reset-password' element= 
    {
      <ResetProtectedRoute>
      <ResetPassword/>
      </ResetProtectedRoute>
    }/>
  </Routes>
  </Router>
  </Provider>
  )
}

export default App