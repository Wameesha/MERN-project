import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Children } from "react";

const Layout = ({children, showSidebar = false}) => {
  return <div className='min-h-screen'>
    <div className='flex'> 
        {showSidebar && <Sidebar/>}

        <div className='flex-1 flex-col'>
            <Navbar />

          <main className="flex-1 overflow-y-auto">
            {children}

          </main>
        </div>

    </div>

  </div>;
}

export default Layout