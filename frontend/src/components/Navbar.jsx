import React from 'react';
import toast from "react-hot-toast";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react"

import useAuthUser from "../hooks/useAuthUser.js";
import { Link, useLocation } from "react-router"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api.js';
import ThemeSelector from "./ThemeSelector.jsx"

const Navbar = () => {

  const { authUser } = useAuthUser();
  const location = useLocation()
  const isChatPage = location.pathname?.startsWith("/chat");
  const queryClient = useQueryClient();

  const { mutate:logoutMutation } = useMutation({
    mutationFn:logout,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["authUser"]});
      toast.success("Logout successfully");
    }
  })

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container items-center flex mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Logo */}

            <div className={`pl-5 ${isChatPage ? "lg:block" : "lg:hidden"}`}>
              <Link to={"/"} className='flex items-center gap-2.5'>
                <ShipWheelIcon className='w-9 h-9 text-primary' />
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                  LangChange
                </span>
              </Link>
            </div>
        <div className='flex items-center justify-end w-full'>

          
          {/* Go to Notifications Page */}

          <div className='flex items-center gap-3 sm:gap-4'>
            <Link to={"/notifications"}>
              <button className='btn btn-ghost btn-circle'>
                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
              </button>
            </Link>
          </div>

          {/* Select Theme */}

          < ThemeSelector />

          <div className='avatar'>
            <div className='w-9 rounded-full'>
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
            < LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
