import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import { ROUTES } from "../shared/constants"
import Dashboard from "../features/Dashboard/Dashboard"
import Header from "../shared/pages/Header"

const AppRouter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Routes>
          <Route 
            path={ROUTES.HOME} 
            element={
              <Dashboard 
                isSidebarOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
              />
            } 
          />
      </Routes>
    </>
  )
}

export default AppRouter