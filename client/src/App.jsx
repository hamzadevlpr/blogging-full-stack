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
import Editor from './Components/Editor/Editor';
import Article from './Components/Blogs/Article';
import Posts from './Components/Blogs/Posts';
import PostDetail from './Components/Blogs/PostDetail';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/login';
  const user = localStorage.getItem('user');
  return (
    <>

      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/blogs/:slug" element={<PostDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:userId" element={user ? <Users /> : <Navigate to={'/login'} />} />
        <Route path="/*" element={<Error title="Sorry, we couldn't find this page." btnTitle="Return to Homepage" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={'/'} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={'/'} />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/post/add" element={user ? <Article /> : <Navigate to={'/login'} />} />
      </Routes>
      {!isAuthPage && <Footer />}
      <Toaster
        position="top-center"
      />
    </>
  );
}

export default App;
