import { FaArrowLeft, FaPrint, FaDownload, FaEnvelope, FaMapMarkerAlt, FaTruck, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/order_details.css';

type OrderStatus = 'pending' | 'shipped' | 'delivered';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  sku: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  location: string;
}

interface OrderDetail {
  id: string;
  orderDate: string;
  totalAmount: number;
  subTotal: number;
  tax: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod: string;
  customer: {
    name: string;
    company: string;
    email: string;
    phone: string;
    billingAddress: string;
    shippingAddress: string;
    taxId: string;
  };
  items: OrderItem[];
  shipments: Shipment[];
}

// --- Mock Data ---
const mockOrder: OrderDetail = {
  id: 'ORD-123456-B2B',
  orderDate: 'Oct 15, 2024',
  subTotal: 1250.00,
  tax: 62.50,
  shippingFee: 120.00,
  totalAmount: 1432.50,
  status: 'shipped',
  paymentMethod: 'Net 30 / Wire Transfer',
  customer: {
    name: 'Sarah Connor',
    company: 'TechDyne Solutions Inc.',
    email: 'sarah.c@techdyne.example.com',
    phone: '+1 (415) 555-8900',
    taxId: 'US-883920199',
    billingAddress: '400 Cybernetics Way, Suite 300\nSan Francisco, CA 94107\nUnited States',
    shippingAddress: '199 Warehouse Blvd, Dock 4\nOakland, CA 94607\nUnited States'
  },
  items: [
    {
      id: 'ITM001',
      name: 'Industrial Grade Steel Sheets (5mm)',
      quantity: 50,
      price: 20.00,
      sku: 'STEEL-G50'
    },
    {
      id: 'ITM002',
      name: 'High-Tensile Bolts Pack (Box of 500)',
      quantity: 10,
      price: 25.00,
      sku: 'BOLT-HT500'
    }
  ],
  shipments: [
    {
      id: 'SHP001',
      trackingNumber: 'TRK987654321',
      carrier: 'FreightMaster Global',
      status: 'In Transit',
      location: 'Oakland Distribution Center'
    }
  ]
};

export const OrderDetail = () => {
  const order = mockOrder;

  return (
    <div className="order-detail-container">
      
      {/* ── Top Action Bar ── */}
      <div className="detail-actions-bar">
        <Link to="/supplier-dashboard/orders" className="back-link">
          <FaArrowLeft /> Back to Orders
        </Link>
        <div className="action-buttons">
          <button className="btn-outline"><FaEnvelope /> Contact Buyer</button>
          <button className="btn-outline"><FaDownload /> PDF</button>
          <button className="btn-primary"><FaPrint /> Print Invoice</button>
        </div>
      </div>

      {/* ── Invoice Paper ── */}
      <div className="invoice-wrapper">
        
        {/* Header: Branding & Meta */}
        <div className="invoice-header">
          <div className="company-branding">
            <h2>NEXUS B2B SUPPLIES</h2>
            <p>100 Industrial Parkway<br/>Detroit, MI 48202<br/>United States</p>
            <p className="mt-1">Tax ID: US-112233445</p>
          </div>
          
          <div className="order-meta-info">
            <h1>COMMERCIAL INVOICE</h1>
            <div className="meta-grid">
              <span className="meta-label">Invoice No:</span>
              <span className="meta-value">{order.id}</span>
              
              <span className="meta-label">Date:</span>
              <span className="meta-value">{order.orderDate}</span>
              
              <span className="meta-label">Payment Terms:</span>
              <span className="meta-value">{order.paymentMethod}</span>
              
              <span className="meta-label">Status:</span>
              <span className="meta-value">
                <span className={`status-stamp ${order.status}`}>
                  {order.status}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="addresses-section">
          <div className="address-block">
            <h3>Bill To</h3>
            <div className="address-content">
              <strong>{order.customer.company}</strong>
              <p style={{ whiteSpace: 'pre-line' }}>{order.customer.billingAddress}</p>
              <div className="contact-row">
                <FaEnvelope /> {order.customer.email}
              </div>
              <div className="contact-row">
                <FaMapMarkerAlt /> Tax ID: {order.customer.taxId}
              </div>
            </div>
          </div>
          
          <div className="address-block">
            <h3>Ship To</h3>
            <div className="address-content">
              <strong>{order.customer.company}</strong>
              <p style={{ whiteSpace: 'pre-line' }}>{order.customer.shippingAddress}</p>
              <div className="contact-row">
                Attn: {order.customer.name}
              </div>
              <div className="contact-row">
                Phone: {order.customer.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Unit Price</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>
                    <span className="item-name">{item.name}</span>
                    <span className="item-sku">SKU: {item.sku}</span>
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">${item.price.toFixed(2)}</td>
                  <td className="text-right">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="invoice-summary">
          <div className="summary-notes">
            <h4>Important Notes</h4>
            <p>Please include the invoice number ({order.id}) on your wire transfer details to ensure prompt processing. Goods remain the property of Nexus B2B Supplies until paid in full.</p>
          </div>
          
          <div className="summary-totals">
            <div className="totals-row">
              <span>Subtotal:</span>
              <span>${order.subTotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>Shipping & Handling:</span>
              <span>${order.shippingFee.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>Tax (5%):</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="totals-row grand-total">
              <span>Total Due:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipments Info */}
        <div className="shipments-section">
          <h3>Logistics & Tracking</h3>
          {order.shipments.map(shipment => (
            <div key={shipment.id} className="shipment-card">
              <div className="shipment-info">
                <div className="carrier-icon"><FaTruck /></div>
                <div className="shipment-details">
                  <strong>{shipment.carrier} - {shipment.status}</strong>
                  <span>Tracking: {shipment.trackingNumber} • Current Location: {shipment.location}</span>
                </div>
              </div>
              <button className="tracking-btn">
                Track Shipment <FaExternalLinkAlt style={{ marginLeft: '4px', fontSize: '10px' }}/>
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
