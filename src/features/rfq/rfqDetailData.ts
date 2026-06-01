import dummyRFQs from '../../core/storage/DummyRFQs.json'

export interface RfqAttachment {
  name: string
  size: string
  type: 'pdf' | 'image'
}

export interface RfqDetail {
  id: string
  title: string
  datePosted: string
  deadline: string
  timeLeft: string
  status: string
  category: string
  description: string
  requirements: {
    quantity: string
    targetPrice: string
    sourcingType: string
    destination: string
    shippingTerms: string
    paymentTerms: string
  }
  buyer: {
    company: string
    contact: string
    country: string
    countryCode: string
    industry: string
    verified: boolean
    memberSince: string
    totalOrders: number
  }
  attachments: RfqAttachment[]
}

export function getRfqById(rfqId: string): RfqDetail | null {
  const basic = dummyRFQs.find((r: { id: string }) => r.id === rfqId)
  if (!basic) return null

  const numericId = parseInt(rfqId.replace('RFQ', ''), 10) || 2001
  const quantityVal = basic.quantity
  let budgetVal = 5000
  if (basic.budget) {
    budgetVal = parseFloat(basic.budget.replace(/[$,]/g, '')) || 5000
  }
  const unitLow = (budgetVal / quantityVal) * 0.9
  const unitHigh = (budgetVal / quantityVal) * 1.1

  const buyerCountries = [
    { country: 'United States', code: 'US' },
    { country: 'Germany', code: 'DE' },
    { country: 'United Kingdom', code: 'GB' },
    { country: 'Singapore', code: 'SG' },
  ]
  const loc = buyerCountries[numericId % buyerCountries.length]

  return {
    id: rfqId,
    title: `Bulk sourcing request — ${basic.category} (${quantityVal.toLocaleString()} units)`,
    datePosted: basic.date,
    deadline: `Dec ${(numericId % 28) + 1}, 2024`,
    timeLeft: `${12 + (numericId % 10)} Days, ${(numericId % 23) + 1} Hours`,
    status: basic.status,
    category: basic.category,
    description: `Dear Supplier,

We are seeking competitive quotations for "${basic.category}" products. Our company, ${basic.buyer}, requires ${quantityVal.toLocaleString()} units for an upcoming procurement cycle.

Key requirements:
- Product category: ${basic.category}
- Quantity: ${quantityVal.toLocaleString()} units
- Target budget: ${basic.budget} USD (indicative)
- Delivery: Within 30–45 days after order confirmation
- Quality: ISO 9001 / CE certified products preferred

Please provide unit pricing, MOQ, lead time, and payment terms.

Best regards,
Procurement Team
${basic.buyer}`,
    requirements: {
      quantity: `${quantityVal.toLocaleString()} units`,
      targetPrice: `$${unitLow.toFixed(0)} – $${unitHigh.toFixed(0)} / unit`,
      sourcingType:
        numericId % 2 === 0 ? 'Custom Manufacturing' : 'Standard catalog',
      destination:
        numericId % 2 === 0
          ? 'Port of Long Beach, USA'
          : 'Port of Hamburg, Germany',
      shippingTerms: numericId % 2 === 0 ? 'CIF' : 'FOB',
      paymentTerms: 'L/C at sight or T/T (30% deposit, 70% before shipment)',
    },
    buyer: {
      company: basic.buyer,
      contact: 'Procurement Manager',
      country: loc.country,
      countryCode: loc.code,
      industry:
        numericId % 3 === 0
          ? 'Automotive Manufacturing'
          : 'Import & Wholesale Distribution',
      verified: true,
      memberSince: String(2017 + (numericId % 6)),
      totalOrders: 40 + (numericId % 120),
    },
    attachments: [
      {
        name: `RFQ_Specs_${rfqId}.pdf`,
        size: '1.8 MB',
        type: 'pdf',
      },
      {
        name: `Technical_Requirements_${rfqId}.pdf`,
        size: '640 KB',
        type: 'pdf',
      },
      {
        name: `Reference_Product_${rfqId}.jpg`,
        size: '920 KB',
        type: 'image',
      },
    ],
  }
}
