import Sidebar from "./sidebar/Sidebar"
import "../../styles/dashboard_home.css"

interface DashboardProps {
  isSidebarOpen: boolean
  onClose: () => void
}

const Dashboard = ({ isSidebarOpen, onClose }: DashboardProps) => {
  return (
    <div className="dashboard-app">
      <Sidebar isOpen={isSidebarOpen} onClose={onClose} />
    </div>
  )
}

export default Dashboard
