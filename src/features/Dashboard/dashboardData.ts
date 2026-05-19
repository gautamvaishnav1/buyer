/** BRD-aligned types */

export type VerificationTier = "basic" | "verified" | "premium"
export type BadgeApplicationStatus = "pending" | "approved" | "rejected" | "expired"
export type LeadStatus = "new" | "negotiation" | "confirmed" | "closed"
export type PaymentStatus = "pending" | "paid" | "confirmed"
export type ProductListingStatus = "active" | "draft" | "low_stock"

export interface SupplierSnapshot {
  companyName: string
  contactName: string
  verificationTier: VerificationTier
  badgeStatus: BadgeApplicationStatus
  badgeValidUntil: string | null
  rating: number
  reviewCount: number
  currentStarLevel: number
  forecastedStarLevel: number
  starLabel: string
  industry: string
}

export interface PerformanceMetric {
  id: string
  label: string
  value: string
  peerChange: number
  actionLabel?: string
}

export interface KpiMetric {
  id: string
  title: string
  subtitle: string
  value: string
  delta: number
  trend: "up" | "down"
  sparkline: number[]
  variant: "inquiries" | "sales" | "products"
}

export interface RecentProduct {
  id: string
  name: string
  sku: string
  price: string
  moq: string
  listingStatus: ProductListingStatus
  paymentStatus: PaymentStatus
}

export interface RecentInquiry {
  id: string
  buyer: string
  country: string
  subject: string
  quantity: string
  timeAgo: string
  leadStatus: LeadStatus
}

export interface RecentSellingProduct {
  id: string
  name: string
  unitsSold: number
  orderValue: string
  paymentStatus: PaymentStatus
  timeAgo: string
}

export interface DashboardModule {
  id: string
  label: string
  description: string
  icon?: string
}

export const SUPPLIER: SupplierSnapshot = {
  companyName: "Apex Industrial Supplies Pvt. Ltd.",
  contactName: "Rajesh Kumar",
  verificationTier: "verified",
  badgeStatus: "approved",
  badgeValidUntil: "2027-05-15",
  rating: 4.5,
  reviewCount: 248,
  currentStarLevel: 4,
  forecastedStarLevel: 4,
  starLabel: "4-Star Supplier",
  industry: "Industrial Equipment & Safety",
}

export const PERFORMANCE_PERIOD = "Last 7 days"

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  { id: "uv", label: "Unique visitors", value: "1,240", peerChange: 12.4 },
  { id: "inquiries", label: "Inquiries", value: "128", peerChange: 18.4 },
  { id: "messages", label: "Messages", value: "86", peerChange: 8.2 },
  { id: "response", label: "Response time", value: "2.4 hr", peerChange: -15.2 },
  { id: "unread", label: "Unread inquiries", value: "5", peerChange: 0, actionLabel: "Reply now" },
]

export const KPI_METRICS: KpiMetric[] = [
  {
    id: "inquiries",
    title: "Inquiries",
    subtitle: "Number of inquiries",
    value: "128",
    delta: 18.4,
    trend: "up",
    sparkline: [12, 18, 14, 22, 19, 28, 24, 32, 26, 35],
    variant: "inquiries",
  },
  {
    id: "sales",
    title: "Total Sell Products",
    subtitle: "Number of products",
    value: "1,482",
    delta: 12.1,
    trend: "up",
    sparkline: [80, 95, 88, 110, 105, 120, 115, 130, 125, 148],
    variant: "sales",
  },
  {
    id: "products",
    title: "Products",
    subtitle: "Number of products",
    value: "56",
    delta: 3.2,
    trend: "up",
    sparkline: [48, 50, 52, 51, 53, 54, 55, 56, 56, 56],
    variant: "products",
  },
]

export const DASHBOARD_MODULES: DashboardModule[] = [
  { id: "products", label: "Products", description: "Add, edit, bulk upload" },
  { id: "inquiries", label: "Inquiries", description: "Reply & track leads" },
  { id: "rfq", label: "RFQ", description: "Quote requests" },
  { id: "orders", label: "Orders", description: "Fulfillment" },
  { id: "payments", label: "Payments", description: "Track payments" },
  { id: "analytics", label: "Analytics", description: "Insights" },
]

export const SUGGESTIONS = [
  "Post 3 more products with complete specs to improve search visibility.",
  "Your response time is better than 72% of peers — keep replying within 4 hours.",
  "Renew your Verified badge before expiry to maintain higher ranking in search.",
]

export const RECENT_PRODUCTS: RecentProduct[] = [
  { id: "1", name: "Industrial Safety Gloves", sku: "ISG-2041", price: "₹85/pc", moq: "500 pcs", listingStatus: "active", paymentStatus: "confirmed" },
  { id: "2", name: "Heavy Duty Drill Machine", sku: "HDM-8890", price: "₹4,200", moq: "10 units", listingStatus: "active", paymentStatus: "paid" },
  { id: "3", name: "Safety Helmet Pro Series", sku: "SHP-1120", price: "₹320", moq: "100 pcs", listingStatus: "low_stock", paymentStatus: "pending" },
  { id: "4", name: "LED Warehouse Flood Light", sku: "WLF-3302", price: "₹1,850", moq: "50 units", listingStatus: "active", paymentStatus: "confirmed" },
  { id: "5", name: "Hydraulic Pallet Jack", sku: "HPJ-5501", price: "₹28,000", moq: "5 units", listingStatus: "draft", paymentStatus: "pending" },
]

export const RECENT_INQUIRIES: RecentInquiry[] = [
  { id: "1", buyer: "Global Trade Corp", country: "UAE", subject: "Bulk inquiry — Safety Helmets", quantity: "5,000 pcs", timeAgo: "12 min ago", leadStatus: "new" },
  { id: "2", buyer: "EuroBuild GmbH", country: "DE", subject: "RFQ for LED flood lights", quantity: "200 units", timeAgo: "1 hr ago", leadStatus: "negotiation" },
  { id: "3", buyer: "Pacific Imports Ltd", country: "AU", subject: "Drill machines — best price", quantity: "50 units", timeAgo: "3 hrs ago", leadStatus: "confirmed" },
  { id: "4", buyer: "Nordic Supply AS", country: "NO", subject: "Pallet jacks — CIF Oslo", quantity: "30 units", timeAgo: "5 hrs ago", leadStatus: "negotiation" },
  { id: "5", buyer: "Metro Wholesale Inc", country: "US", subject: "Safety gloves annual contract", quantity: "10,000 pcs", timeAgo: "Yesterday", leadStatus: "closed" },
]

export const RECENT_SELLING: RecentSellingProduct[] = [
  { id: "1", name: "Heavy Duty Drill Machine", unitsSold: 48, orderValue: "₹2.0L", paymentStatus: "confirmed", timeAgo: "2 hrs ago" },
  { id: "2", name: "Industrial Safety Gloves", unitsSold: 1200, orderValue: "₹1.0L", paymentStatus: "paid", timeAgo: "5 hrs ago" },
  { id: "3", name: "Safety Helmet Pro Series", unitsSold: 200, orderValue: "₹64K", paymentStatus: "pending", timeAgo: "Yesterday" },
  { id: "4", name: "LED Warehouse Flood Light", unitsSold: 80, orderValue: "₹1.48L", paymentStatus: "confirmed", timeAgo: "2 days ago" },
  { id: "5", name: "Hydraulic Pallet Jack", unitsSold: 12, orderValue: "₹3.36L", paymentStatus: "paid", timeAgo: "3 days ago" },
]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  negotiation: "Negotiation",
  confirmed: "Confirmed",
  closed: "Closed",
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  confirmed: "Confirmed",
}

export const BADGE_STATUS_LABELS: Record<BadgeApplicationStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
}
