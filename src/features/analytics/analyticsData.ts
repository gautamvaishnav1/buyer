export interface ChartSegment {
  label: string;
  value: number;
}

export interface MonthlyAnalyticsData {
  inquiries: ChartSegment[];
  rfqs: ChartSegment[];
  selling: ChartSegment[];
  uploads: ChartSegment[];
}

export const MONTHLY_ANALYTICS: Record<string, MonthlyAnalyticsData> = {
  "January 2026": {
    inquiries: [
      { label: "New Inquiries", value: 45 },
      { label: "In Negotiation", value: 30 },
      { label: "Confirmed Leads", value: 15 },
      { label: "Closed/Spam", value: 10 }
    ],
    rfqs: [
      { label: "Draft Quotes", value: 12 },
      { label: "Submitted to Buyer", value: 35 },
      { label: "Accepted Quotes", value: 18 },
      { label: "Declined Quotes", value: 8 }
    ],
    selling: [
      { label: "Consumer Electronics", value: 350 },
      { label: "Industrial Machinery", value: 200 },
      { label: "Apparel & Fashion", value: 180 },
      { label: "Home & Garden", value: 120 },
      { label: "Others", value: 90 }
    ],
    uploads: [
      { label: "Approved & Live", value: 40 },
      { label: "Pending Verification", value: 12 },
      { label: "Rejected/Fix Required", value: 4 },
      { label: "Draft Products", value: 8 }
    ]
  },
  "February 2026": {
    inquiries: [
      { label: "New Inquiries", value: 50 },
      { label: "In Negotiation", value: 35 },
      { label: "Confirmed Leads", value: 20 },
      { label: "Closed/Spam", value: 12 }
    ],
    rfqs: [
      { label: "Draft Quotes", value: 15 },
      { label: "Submitted to Buyer", value: 42 },
      { label: "Accepted Quotes", value: 22 },
      { label: "Declined Quotes", value: 10 }
    ],
    selling: [
      { label: "Consumer Electronics", value: 380 },
      { label: "Industrial Machinery", value: 220 },
      { label: "Apparel & Fashion", value: 195 },
      { label: "Home & Garden", value: 130 },
      { label: "Others", value: 85 }
    ],
    uploads: [
      { label: "Approved & Live", value: 45 },
      { label: "Pending Verification", value: 8 },
      { label: "Rejected/Fix Required", value: 2 },
      { label: "Draft Products", value: 10 }
    ]
  },
  "March 2026": {
    inquiries: [
      { label: "New Inquiries", value: 65 },
      { label: "In Negotiation", value: 48 },
      { label: "Confirmed Leads", value: 32 },
      { label: "Closed/Spam", value: 15 }
    ],
    rfqs: [
      { label: "Draft Quotes", value: 20 },
      { label: "Submitted to Buyer", value: 55 },
      { label: "Accepted Quotes", value: 30 },
      { label: "Declined Quotes", value: 12 }
    ],
    selling: [
      { label: "Consumer Electronics", value: 420 },
      { label: "Industrial Machinery", value: 260 },
      { label: "Apparel & Fashion", value: 210 },
      { label: "Home & Garden", value: 145 },
      { label: "Others", value: 100 }
    ],
    uploads: [
      { label: "Approved & Live", value: 55 },
      { label: "Pending Verification", value: 15 },
      { label: "Rejected/Fix Required", value: 5 },
      { label: "Draft Products", value: 12 }
    ]
  },
  "April 2026": {
    inquiries: [
      { label: "New Inquiries", value: 72 },
      { label: "In Negotiation", value: 55 },
      { label: "Confirmed Leads", value: 38 },
      { label: "Closed/Spam", value: 18 }
    ],
    rfqs: [
      { label: "Draft Quotes", value: 18 },
      { label: "Submitted to Buyer", value: 62 },
      { label: "Accepted Quotes", value: 35 },
      { label: "Declined Quotes", value: 15 }
    ],
    selling: [
      { label: "Consumer Electronics", value: 460 },
      { label: "Industrial Machinery", value: 290 },
      { label: "Apparel & Fashion", value: 230 },
      { label: "Home & Garden", value: 160 },
      { label: "Others", value: 110 }
    ],
    uploads: [
      { label: "Approved & Live", value: 60 },
      { label: "Pending Verification", value: 18 },
      { label: "Rejected/Fix Required", value: 3 },
      { label: "Draft Products", value: 15 }
    ]
  },
  "May 2026": {
    inquiries: [
      { label: "New Inquiries", value: 85 },
      { label: "In Negotiation", value: 64 },
      { label: "Confirmed Leads", value: 46 },
      { label: "Closed/Spam", value: 20 }
    ],
    rfqs: [
      { label: "Draft Quotes", value: 25 },
      { label: "Submitted to Buyer", value: 70 },
      { label: "Accepted Quotes", value: 45 },
      { label: "Declined Quotes", value: 14 }
    ],
    selling: [
      { label: "Consumer Electronics", value: 510 },
      { label: "Industrial Machinery", value: 320 },
      { label: "Apparel & Fashion", value: 260 },
      { label: "Home & Garden", value: 180 },
      { label: "Others", value: 125 }
    ],
    uploads: [
      { label: "Approved & Live", value: 68 },
      { label: "Pending Verification", value: 10 },
      { label: "Rejected/Fix Required", value: 2 },
      { label: "Draft Products", value: 8 }
    ]
  },
  "June 2026 (Current)": {
    inquiries: [
      { label: "New Inquiries", value: 92 },
      { label: "In Negotiation", value: 78 },
      { label: "Confirmed Leads", value: 54 },
      { label: "Closed/Spam", value: 24 }
    ],
    rfqs: [
      { label: "Draft Quotes", value: 30 },
      { label: "Submitted to Buyer", value: 85 },
      { label: "Accepted Quotes", value: 52 },
      { label: "Declined Quotes", value: 18 }
    ],
    selling: [
      { label: "Consumer Electronics", value: 580 },
      { label: "Industrial Machinery", value: 350 },
      { label: "Apparel & Fashion", value: 290 },
      { label: "Home & Garden", value: 210 },
      { label: "Others", value: 140 }
    ],
    uploads: [
      { label: "Approved & Live", value: 75 },
      { label: "Pending Verification", value: 14 },
      { label: "Rejected/Fix Required", value: 5 },
      { label: "Draft Products", value: 11 }
    ]
  }
};
