import { LoaderIcon } from 'lucide-react'
import { useThemeStore } from "../store/useThemeStore.js";
import React from 'react'

const PageLoader = () => {

  const {theme} = useThemeStore();
  return (
    <div className="flex items-center justify-center min-h-screen" data-theme={theme}>
        <LoaderIcon className="size-10 animate-spin text-primary" />
    </div>
  )
}

export default PageLoader