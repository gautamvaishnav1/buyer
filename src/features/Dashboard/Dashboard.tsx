import Sidebar from "./sidebar/Sidebar"
import { Outlet } from "react-router-dom"
import "../../styles/dashboard_home.css"

interface DashboardProps {
  isSidebarOpen: boolean
  onClose: () => void
}

const Dashboard = ({ isSidebarOpen, onClose }: DashboardProps) => {
  return (
    <div className="dashboard-app">
      <Sidebar isOpen={isSidebarOpen} onClose={onClose} />

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard