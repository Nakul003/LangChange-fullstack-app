import React from 'react';
import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import useAuthUser from './hooks/useAuthUser.js';
import { useThemeStore } from './store/ThemeStore.js';

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import OnBoardingPage from "./pages/OnBoardingPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import Error404Page from './pages/Error404Page.jsx';
import PageLoader from './components/PageLoader.jsx';
import Layout from './components/Layout.jsx';

const App = () => {

  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnboarded;
  if (isLoading) return (
    <PageLoader />  
  )

  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>

        <Route path='/'element={ isAuthenticated && isOnBoarded ? (<Layout showSidebar={true}>< HomePage /></Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboard"} />) } />

        <Route path='/signup'element={ !isAuthenticated ? < SignUpPage /> : <Navigate to={isOnBoarded ? "/" : "/onboard"} /> } />

        <Route path='/login'element={ !isAuthenticated ? <LogInPage /> : <Navigate to={isOnBoarded ? "/" : "/onboard"} /> } />

        <Route path='/onboard'element={ isAuthenticated ? (!isOnBoarded ? <OnBoardingPage /> : < Navigate to={"/"} />) : <Navigate to={"/login"} /> } />

        <Route path='/notifications'element={ isAuthenticated && isOnBoarded ? (<Layout showSidebar={true}>< NotificationsPage /></Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboard"} />) } />

        <Route path='/chat/:id'element={ isAuthenticated && isOnBoarded ? (<Layout showSidebar={false}>< ChatPage /></Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboard"} />)} />

        <Route path='/call/:id'element={ isAuthenticated && isOnBoarded ? (<CallPage />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboard"} />)} />

        <Route path='*'element={<Error404Page />} />
        
      </Routes>
      <Toaster />
    </div>
  )
}

export default App