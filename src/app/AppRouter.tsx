import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import { ROUTES } from "../shared/constants"
import Dashboard from "../features/Dashboard/Dashboard"
import Header from "../shared/pages/Header"
import DashboardHome from "../features/Dashboard/DashboardHome"
import ProductManagement from "../features/Dashboard/ProductManagement/ProductManagement"
import ProductEditPage from "../features/Dashboard/ProductManagement/ProductEditPage"
import InquiryManagement from "../features/Dashboard/InquiryManagement"
import SupplierProfile from "../features/Dashboard/SupplierProfile"
import Analytics from "../features/Dashboard/Analytics"
import ViewProduct from "../features/Dashboard/ProductManagement/ViewProduct"
import AddProduct from "../features/Dashboard/AddProduct"

const AppRouter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <Dashboard isSidebarOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path={ROUTES.EDIT_PRODUCTS} element={<ProductEditPage />} />
          <Route path="inquiries" element={<InquiryManagement />} />
          <Route path="verification" element={<SupplierProfile />} />
          <Route path={ROUTES.ANALYTICS} element={<Analytics/>} />
          <Route path={ROUTES.VIEW_PRODUCT} element={<ViewProduct/>} />
          <Route path={ROUTES.ADD_PRODUCTS} element={<AddProduct/>} />
          <Route path="*" element={<div>page not found</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default AppRouter

