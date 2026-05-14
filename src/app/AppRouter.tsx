import { Route, Routes } from "react-router-dom"
import { ROUTES } from "../shared/constants"
import Dashboard from "../features/Dashboard/Dashboard"
import Header from "../shared/pages/Header"
import Sidebar from "../features/Dashboard/sidebar/Sidebar"



const AppRouter = () => {
  return (
    <>
   <div className="routing-sty ">
    <Sidebar/>
     <Header/>
   </div>
   <Routes>
      <Route path={ROUTES.HOME} element={<Dashboard/>} />
   </Routes>
   </>
  )
}

export default AppRouter