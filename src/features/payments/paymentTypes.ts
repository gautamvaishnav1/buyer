export type PaymentStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded'

export interface PaymentRecord {
  id: string
  orderId: string
  date: string
  buyer: string
  amount: string
  method: string
  status: PaymentStatus
}

export interface PaymentLineItem {
  sku: string
  description: string
  qty: number
  unitPrice: string
  subtotal: string
}

export interface PaymentTimelineEvent {
  id: string
  title: string
  date: string
  description: string
  state: 'completed' | 'active' | 'failed' | 'pending'
}

export interface PaymentDocument {
  name: string
  size: string
  type: 'pdf' | 'image'
}

export interface PaymentDetail extends PaymentRecord {
  currency: string
  subtotal: string
  shippingFee: string
  platformFee: string
  tax: string
  total: string
  transactionRef: string
  invoiceNo: string
  paymentTerms: string
  incoterms: string
  buyerContact: string
  buyerEmail: string
  buyerCountry: string
  buyerVerified: boolean
  memberSince: string
  lineItems: PaymentLineItem[]
  timeline: PaymentTimelineEvent[]
  documents: PaymentDocument[]
}
