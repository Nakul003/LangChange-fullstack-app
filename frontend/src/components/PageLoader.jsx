import React from 'react';
import { LoaderIcon } from "lucide-react";
import { useThemeStore } from '../store/ThemeStore';

const PageLoader = () => {

  const { theme } = useThemeStore()

  return (
    <div className='min-h-screen flex justify-center items-center' data-theme={theme}>
        <LoaderIcon className="animate-spin w-10 h-10 text-primary" />
    </div>
  )
}

export default PageLoader
