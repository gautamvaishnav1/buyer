export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/supplier-dashboard',
  ADD_PRODUCTS: '/add-products',
  EDIT_PRODUCTS: '/edit-products',
  DELETE_PRODUCTS: '/delete-products',
  INQUIRIES: '/inquiries',
  RFQ: '/rfq',
  ORDERS: '/orders',
  PAYMENTS: '/payments',
  CHAT:'/chat',
  USER_CHAT:'/user-chat',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings'
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
