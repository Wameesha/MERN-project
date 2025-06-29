import { LoaderIcon } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <LoaderIcon className="size-10 animate-spin text-primary" />
    </div>
  )
}

export default PageLoader