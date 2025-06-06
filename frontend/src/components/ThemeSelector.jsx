import React from 'react'
import { THEMES } from '../constants/index.js';
import { useThemeStore } from '../store/ThemeStore.js';
import { PaletteIcon } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className='dropdown dropdown-end'>
      <button className='btn btn-ghost btn-circle' tabIndex={0}>
        <PaletteIcon className='w-5 h-5' />
      </button>

      <div tabIndex={0} className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border-base-content/10 max-h-80 overflow-y-auto'>
        <div className='space-y-1'>
          {THEMES.map((themeOption) => (
              <button 
              key={themeOption.name} 
              className={` w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                theme === themeOption.name 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-base-content/5"}`
              }
              onClick={()=>setTheme(themeOption.name)}
              >
                < PaletteIcon className='w-4 h-4' />
                <span className='font-medium text-sm'>{themeOption.label}</span>

                <div className='ml-auto flex gap-1'>
                  {themeOption.colors.map((color,idx)=>(
                    <span key={idx} className={`w-2 h-2 rounded-full`} style={{backgroundColor:color}}></span>
                  ))}
                </div>
              </button>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
