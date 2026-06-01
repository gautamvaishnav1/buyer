export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/supplier-dashboard',
  ADD_PRODUCTS: '/seller/add-product',
  EDIT_PRODUCTS: '/seller/products/edit-products/:id',
  DELETE_PRODUCTS: '/seller/products/delete-products',
  INQUIRIES: '/seller/inquiries',
  REPLY_INQUIRY:'/seller/inquiries/reply-inquiry/:id',
  PRODUCTS:'/seller/products',
  RFQ: '/seller/rfq',
  REPLY_RFQ:'/seller/rfq/reply-rfq/:id',
  ORDERS: '/seller/orders',
  ORDER_DETAILS: '/seller/orders/order-details/:id',
  ORDER_STATUSES:'/seller/order-statuses',
  PAYMENT_METHODS:'/seller/payment-methods',
  PAYMENTS: '/seller/payments',
  CHAT:'/seller/chat',
  USER_CHAT:'/seller/user-chat',
  ANALYTICS: '/seller/analytics',
  SETTINGS: '/seller/settings',
  VIEW_PRODUCT:'/seller/products/view-product/:id',
  VIEW_INQUIRY:'/seller/view-inquiry/:id',
  VIEW_RFQ:'/seller/view-rfq/:id',
  VIEW_ORDER:'/seller/orders/view-order/:id',
  VIEW_PAYMENT:'/seller/view-payment/:id',
  VERIFICATION:'/seller/verification',
  PROFILE:'/seller/profile',
  MESSAGE:'/seller/message',
  MESSAGE_BUYER:'/seller/message/buyer/:id'
}

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  NETWORK_ERROR: 'Network error occurred',
  SERVER_ERROR: 'Server error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found'
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
] as const

export const PAYMENT_METHODS = [
  'credit_card',
  'net_30',
  'purchase_order',
  'bank_transfer'
] as const
