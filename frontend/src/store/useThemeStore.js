import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme:  localStorage.getItem("calliera-theme") || "coffee", 
  setTheme: (theme) => {
    localStorage.setItem("calliera-theme", theme);
    set({ theme });
  },
}));
