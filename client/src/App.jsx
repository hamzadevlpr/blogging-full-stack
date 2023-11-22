import React, { useContext, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import { AuthContext } from './Components/Context/AuthContext';
import Error from './Components/ErrorPages/Error';
import { Signup } from './Components/Auth/Signup';
import { Login } from './Components/Auth/Login';
import Blogs from './Components/Blogs/Blogs';
import Contact from './Components/Contact';
import Users from './Components/Profile/Users';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/login';

  return (
    <>

      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:userId" element={<Users />} />
        <Route path="/*" element={<Error />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {!isAuthPage && <Footer />}
      <Toaster
        position="bottom-right"
      />
    </>
  );
}

export default App;
