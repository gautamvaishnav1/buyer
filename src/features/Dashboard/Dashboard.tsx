// import Sidebar from "./sidebar/Sidebar"
// import { Outlet } from "react-router-dom"
// import "../../styles/dashboard_home.css"

// interface DashboardProps {
//   isSidebarOpen: boolean
//   onClose: () => void
// }

// const Dashboard = ({ isSidebarOpen, onClose }: DashboardProps) => {
//   return (
//     <div className='dashboard'>
//       <Sidebar isOpen={isSidebarOpen} onClose={onClose} />

  
//      <main className="dashboard-content">
        // <Outlet />
      // </main>
//     </div>
//   )
// }

// export default Dashboard



import Sidebar from "./sidebar/Sidebar"
import { Outlet } from "react-router-dom"

import "../../styles/dashboard_home.css"
import Header from "../../shared/pages/Header"

interface DashboardProps {
  isSidebarOpen: boolean
  onClose: () => void
  onMenuClick: () => void
}

const Dashboard = ({
  isSidebarOpen,
  onClose,
  onMenuClick,
}: DashboardProps) => {
  return (
    <>
      {/* Header */}
     

      <div className="dashboard-layout">
         <Header onMenuClick={onMenuClick} />
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={onClose}
        />

        {/* Main Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default Dashboard