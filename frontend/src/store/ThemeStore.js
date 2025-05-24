import { create } from "zustand";

export const useThemeStore = create((set)=>({
    theme: localStorage.getItem("updatedTheme") || "forest",
    setTheme:(updateTheme)=>{
        set({theme:updateTheme});
        localStorage.setItem("updatedTheme",updateTheme);
    },
}));
