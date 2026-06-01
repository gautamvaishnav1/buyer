import paymentsData from '../../core/storage/DummyPayments.json'
import type {
  PaymentDetail,
  PaymentDocument,
  PaymentLineItem,
  PaymentRecord,
  PaymentStatus,
  PaymentTimelineEvent,
} from './paymentTypes'

const payments = paymentsData as PaymentRecord[]

const parseAmount = (amount: string): number =>
  Number.parseFloat(amount.replace(/[^0-9.]/g, '')) || 0

const formatMoney = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const buyerMeta: Record<
  string,
  { contact: string; email: string; country: string; verified: boolean; since: string }
> = {
  'Acme Corp': {
    contact: 'Sarah Mitchell',
    email: 'procurement@acmecorp.com',
    country: 'United States',
    verified: true,
    since: '2018',
  },
  'Global Traders': {
    contact: 'James Wong',
    email: 'buying@globaltraders.hk',
    country: 'Hong Kong SAR',
    verified: true,
    since: '2016',
  },
  'TechSource Ltd': {
    contact: 'Elena Petrova',
    email: 'orders@techsource.co.uk',
    country: 'United Kingdom',
    verified: true,
    since: '2019',
  },
  'MegaBuy Inc': {
    contact: 'Carlos Mendez',
    email: 'ap@megabuy.mx',
    country: 'Mexico',
    verified: false,
    since: '2021',
  },
  'ProImport Co': {
    contact: 'Aisha Khan',
    email: 'finance@proimport.ae',
    country: 'United Arab Emirates',
    verified: true,
    since: '2017',
  },
}

function buildLineItems(orderId: string, total: number): PaymentLineItem[] {
  const unitA = total * 0.55
  const unitB = total * 0.35
  const unitC = total * 0.1
  return [
    {
      sku: `${orderId}-A1`,
      description: 'Industrial components — bulk lot A',
      qty: 120,
      unitPrice: formatMoney(unitA / 120),
      subtotal: formatMoney(unitA),
    },
    {
      sku: `${orderId}-B2`,
      description: 'Packaging & handling materials',
      qty: 40,
      unitPrice: formatMoney(unitB / 40),
      subtotal: formatMoney(unitB),
    },
    {
      sku: `${orderId}-C3`,
      description: 'Quality inspection surcharge',
      qty: 1,
      unitPrice: formatMoney(unitC),
      subtotal: formatMoney(unitC),
    },
  ]
}

function buildTimeline(status: PaymentStatus, date: string): PaymentTimelineEvent[] {
  const base: PaymentTimelineEvent[] = [
    {
      id: '1',
      title: 'Payment initiated',
      date,
      description: 'Buyer submitted payment instruction on the B2B platform.',
      state: 'completed',
    },
    {
      id: '2',
      title: 'Risk & compliance review',
      date,
      description: 'Automated AML and trade compliance screening in progress.',
      state: status === 'Pending' ? 'active' : 'completed',
    },
  ]

  if (status === 'Completed') {
    base.push({
      id: '3',
      title: 'Funds settled to seller',
      date,
      description: 'Payment cleared and released per trade assurance terms.',
      state: 'completed',
    })
  } else if (status === 'Failed') {
    base.push({
      id: '3',
      title: 'Payment failed',
      date,
      description: 'Bank or card issuer declined the transaction. Buyer notified.',
      state: 'failed',
    })
  } else if (status === 'Refunded') {
    base.push(
      {
        id: '3',
        title: 'Payment captured',
        date,
        description: 'Original payment was successfully received.',
        state: 'completed',
      },
      {
        id: '4',
        title: 'Refund processed',
        date,
        description: 'Full refund issued to buyer payment method.',
        state: 'completed',
      }
    )
  } else {
    base.push({
      id: '3',
      title: 'Awaiting settlement',
      date: '—',
      description: 'Funds will be released after buyer confirmation or Net terms due date.',
      state: 'pending',
    })
  }

  return base
}

function buildDocuments(id: string, orderId: string): PaymentDocument[] {
  return [
    { name: `Commercial_Invoice_${orderId}.pdf`, size: '248 KB', type: 'pdf' },
    { name: `Payment_Receipt_${id}.pdf`, size: '112 KB', type: 'pdf' },
    { name: `Packing_List_${orderId}.pdf`, size: '186 KB', type: 'pdf' },
  ]
}

export function getPaymentById(id: string | undefined): PaymentDetail | null {
  if (!id) return null
  const base = payments.find((p) => p.id === id)
  if (!base) return null

  const totalNum = parseAmount(base.amount)
  const shipping = totalNum * 0.04
  const platform = totalNum * 0.015
  const tax = totalNum * 0.02
  const subtotal = totalNum - shipping - platform - tax
  const meta = buyerMeta[base.buyer] ?? {
    contact: 'Buyer Representative',
    email: 'buyer@example.com',
    country: 'International',
    verified: false,
    since: '2020',
  }

  const termsMap: Record<string, string> = {
    'Credit Card': 'T/T 100% before shipment',
    'Bank Transfer': 'Wire transfer — 30% deposit, 70% before BL',
    'Net 30': 'Net 30 days from invoice date',
    'Purchase Order': 'PO reference — payment within 45 days',
  }

  return {
    ...base,
    status: base.status as PaymentStatus,
    currency: 'USD',
    subtotal: formatMoney(subtotal),
    shippingFee: formatMoney(shipping),
    platformFee: formatMoney(platform),
    tax: formatMoney(tax),
    total: base.amount,
    transactionRef: `TXN-${base.id.replace('PAY', '')}-${base.orderId.replace('ORD', '')}`,
    invoiceNo: `INV-${base.orderId.replace('ORD', '')}-2024`,
    paymentTerms: termsMap[base.method] ?? 'As per contract',
    incoterms: 'FOB Shanghai',
    buyerContact: meta.contact,
    buyerEmail: meta.email,
    buyerCountry: meta.country,
    buyerVerified: meta.verified,
    memberSince: meta.since,
    lineItems: buildLineItems(base.orderId, subtotal),
    timeline: buildTimeline(base.status as PaymentStatus, base.date),
    documents: buildDocuments(base.id, base.orderId),
  }
}

export function getAllPaymentIds(): string[] {
  return payments.map((p) => p.id)
}
