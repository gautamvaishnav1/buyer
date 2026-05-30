// import { useState } from "react"
// import { Route, Routes } from "react-router-dom"
// import { ROUTES } from "../shared/constants"
// import Dashboard from "../features/Dashboard/Dashboard"
// import Header from "../shared/pages/Header"
// import DashboardHome from "../features/Dashboard/DashboardHome"
// import ProductManagement from "../features/Dashboard/ProductManagement/ProductManagement"
// import ProductEditPage from "../features/Dashboard/ProductManagement/ProductEditPage"
// import InquiryManagement from "../features/inquiry/InquiryManagement"
// import SupplierProfile from "../features/profile/SupplierProfile"
// import Analytics from "../features/analytics/Analytics"
// import ViewProduct from "../features/Dashboard/ProductManagement/ViewProduct"
// import AddProduct from "../features/Dashboard/AddProduct"
// import { OrderDetail } from "../features/order/OrderDetail"
// import Order from "../features/order/Order"
// import RFQManagement from "../features/rfq/RFQManagement"
// import ViewRFQ from "../features/rfq/ViewRFQ"
// import PaymentManagement from "../features/payments/PaymentManagement"
// import ViewInquiry from "../features/inquiry/ViewInquiry"
// import { ReplyInquiry } from "../features/inquiry/ReplyInquiry"
// import ReplyRFQ from "../features/rfq/ReplyRFQ"
// const AppRouter = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   return (
//     <>
     

//       <Routes>
//         <Route
//           path={ROUTES.HOME}
//           element={
//             <Dashboard isSidebarOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//           }
//         >
           
//           <Route path={ROUTES.HOME} element={<DashboardHome />} />
//           <Route path={ROUTES.PRODUCTS} element={<ProductManagement />} />
//           <Route path={ROUTES.EDIT_PRODUCTS} element={<ProductEditPage />} />
//           <Route path={ROUTES.PROFILE} element={<SupplierProfile />}/>
//           <Route path={ROUTES.INQUIRIES} element={<InquiryManagement />} />
//           <Route path="verification" element={<SupplierProfile />} />
//           <Route path={ROUTES.ANALYTICS} element={<Analytics/>} />
//           <Route path={ROUTES.VIEW_PRODUCT} element={<ViewProduct/>} />
//           <Route path={ROUTES.ADD_PRODUCTS} element={<AddProduct/>} />
//           <Route path={ROUTES.ORDERS} element={<Order/>} />
//           <Route path={ROUTES.ORDER_DETAILS} element={<OrderDetail/>} />
//           <Route path={ROUTES.RFQ} element={<RFQManagement/>} />
//           <Route  path={ROUTES.VIEW_INQUIRY} element={<ViewInquiry/>} />
//           <Route path={ROUTES.VIEW_RFQ} element={<ViewRFQ/>} />
//           <Route path={ROUTES.PAYMENTS} element={<PaymentManagement/>} />
//           <Route path={ROUTES.REPLY_INQUIRY} element={<ReplyInquiry/>}/>
//           <Route  path={ROUTES.REPLY_RFQ} element={<ReplyRFQ/>}        />
//           <Route path="*" element={<div>page not found</div>} />
//         </Route>
//       </Routes>
//     </>
//   )
// }

// export default AppRouter


import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"

import { ROUTES } from "../shared/constants"

import Dashboard from "../features/Dashboard/Dashboard"
// Header imported but used only in commented JSX — kept for future use
// import Header from "../shared/pages/Header"

import DashboardHome from "../features/Dashboard/DashboardHome"

import ProductManagement from "../features/Dashboard/ProductManagement/ProductManagement"
import ProductEditPage from "../features/Dashboard/ProductManagement/ProductEditPage"
import ViewProduct from "../features/Dashboard/ProductManagement/ViewProduct"
import AddProduct from "../features/Dashboard/AddProduct"

import InquiryManagement from "../features/inquiry/InquiryManagement"
import ViewInquiry from "../features/inquiry/ViewInquiry"
import { ReplyInquiry } from "../features/inquiry/ReplyInquiry"

import RFQManagement from "../features/rfq/RFQManagement"
import ViewRFQ from "../features/rfq/ViewRFQ"
import ReplyRFQ from "../features/rfq/ReplyRFQ"

import Order from "../features/order/Order"
import { OrderDetail } from "../features/order/OrderDetail"

import SupplierProfile from "../features/profile/SupplierProfile"
import Analytics from "../features/analytics/Analytics"
import PaymentManagement from "../features/payments/PaymentManagement"

const AppRouter = () => {
  // Desktop => open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth >= 768
  )

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Toggle sidebar only on mobile
  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen((prev) => !prev)
    }
  }

  // Close sidebar only on mobile
  const handleSidebarClose = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Header */}
      {/* <Header onMenuClick={handleMenuClick} /> */}

      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <Dashboard
              isSidebarOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              onMenuClick={handleMenuClick}
            />
          }
        >
          {/* Home */}
          <Route index element={<DashboardHome />} />

          {/* Products */}
          <Route
            path={ROUTES.PRODUCTS}
            element={<ProductManagement />}
          />

          <Route
            path={ROUTES.ADD_PRODUCTS}
            element={<AddProduct />}
          />

          <Route
            path={ROUTES.EDIT_PRODUCTS}
            element={<ProductEditPage />}
          />

          <Route
            path={ROUTES.VIEW_PRODUCT}
            element={<ViewProduct />}
          />

          {/* Inquiries */}
          <Route
            path={ROUTES.INQUIRIES}
            element={<InquiryManagement />}
          />

          <Route
            path={ROUTES.VIEW_INQUIRY}
            element={<ViewInquiry />}
          />

          <Route
            path={ROUTES.REPLY_INQUIRY}
            element={<ReplyInquiry />}
          />

          {/* RFQ */}
          <Route
            path={ROUTES.RFQ}
            element={<RFQManagement />}
          />

          <Route
            path={ROUTES.VIEW_RFQ}
            element={<ViewRFQ />}
          />

          <Route
            path={ROUTES.REPLY_RFQ}
            element={<ReplyRFQ />}
          />

          {/* Orders */}
          <Route
            path={ROUTES.ORDERS}
            element={<Order />}
          />

          <Route
            path={ROUTES.ORDER_DETAILS}
            element={<OrderDetail />}
          />

          {/* Payments */}
          <Route
            path={ROUTES.PAYMENTS}
            element={<PaymentManagement />}
          />

          {/* Analytics */}
          <Route
            path={ROUTES.ANALYTICS}
            element={<Analytics />}
          />

          {/* Profile */}
          <Route
            path={ROUTES.PROFILE}
            element={<SupplierProfile />}
          />

          <Route
            path="verification"
            element={<SupplierProfile />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<div>Page Not Found</div>}
          />
        </Route>
      </Routes>
    </>
  )
}

export default AppRouter