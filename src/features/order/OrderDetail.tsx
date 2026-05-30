import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaDownload,
  FaTruck, FaShieldAlt,
  FaFilePdf, FaClock, FaCheckCircle, FaFileInvoice,
  FaCreditCard, FaUserCheck, FaBoxes, FaUpload, 
} from 'react-icons/fa';
import dummyOrders from '../../core/storage/DummyOrders.json';
import dummyOrderDetails from '../../core/storage/DummyOrderDetails.json';
import '../../styles/order_details.css';
import { ROUTES } from '../../shared/constants';

// Types for B2B details
interface CustomSpec {
  logoCustomization: boolean;
  packagingCustomization: boolean;
  oemSpecifications: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  hsCode: string;
  quantity: number;
  unitPrice: number;
  weightKg: number;
  specs: CustomSpec;
  imageColor: string;
}

interface Milestone {
  id: string;
  title: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string;
  transactionId?: string | null;
  paidDate?: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'supplier' | 'buyer';
  content: string;
  timestamp: string;
}

interface DocumentFile {
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  url: string;
}

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // States
  const [orderStatus, setOrderStatus] = useState<string>('Pending');
  const [shippingInfo, setShippingInfo] = useState({
    carrier: 'FreightMaster Global',
    trackingNumber: 'TRK987654321',
    shipDate: 'TBD',
    loadingPort: 'Shanghai Port, China',
    destinationPort: 'Port of Long Beach, USA',
    weight: '450.00 kg',
    incoterms: 'FOB'
  });
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // const [newMessage, setNewMessage] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<DocumentFile[]>([]);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  // showInvoicePrint removed — only used in commented print button
  const [tempCarrier, setTempCarrier] = useState('');
  const [tempTracking, setTempTracking] = useState('');
  const [tempPort, setTempPort] = useState('');
  
  // Custom states for bank slip verification
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Generate dynamic, content-rich B2B order details based on the basic order list or loaded JSON
  const getOrderDetails = () => {
    // 1. Try to find in the details JSON file first
    const fileDetails = dummyOrderDetails.find(o => o.id === id);
    if (fileDetails) {
      // Cast the loaded status to correct types for compatibility
      return {
        ...fileDetails,
        status: fileDetails.status,
        products: fileDetails.products.map(p => ({
          ...p,
          specs: {
            logoCustomization: p.specs.logoCustomization,
            packagingCustomization: p.specs.packagingCustomization,
            oemSpecifications: p.specs.oemSpecifications
          }
        })),
        milestones: fileDetails.milestones.map(m => ({
          ...m,
          status: m.status as 'paid' | 'pending' | 'overdue'
        })),
        documents: fileDetails.documents || []
      };
    }

    // 2. Failsafe Fallback: Generate dynamically for other IDs
    const basicOrder = dummyOrders.find(o => o.id === id);
    
    // Parse amount to float (e.g. "$1234.50" -> 1234.50)
    const amountVal = basicOrder 
      ? parseFloat(basicOrder.amount.replace('$', '').replace(',', ''))
      : 5420.00;
    
    const orderDate = basicOrder ? basicOrder.date : '10/15/2024';
    const buyerName = basicOrder ? basicOrder.buyer : 'Global Traders Inc.';
    const initialStatus = basicOrder ? basicOrder.status : 'Pending';

    // Calculate backward pricing components
    const taxRate = 0.05; // 5%
    const shippingFee = amountVal > 5000 ? 350.00 : 150.00;
    const subtotalWithTax = amountVal - shippingFee;
    const subTotal = parseFloat((subtotalWithTax / (1 + taxRate)).toFixed(2));
    const tax = parseFloat((subTotal * taxRate).toFixed(2));
    
    // Generate logical B2B product items that total up exactly to subTotal
    const products: ProductItem[] = [
      {
        id: 'ITM-88291',
        name: amountVal > 3000 ? 'High-Performance Monocrystalline Solar Panels (450W)' : 'Industrial Brass Globe Valves (2-Inch)',
        sku: amountVal > 3000 ? 'SOLAR-450W-MONO' : 'VALVE-BR-G200',
        hsCode: amountVal > 3000 ? '8541.43.0010' : '8481.80.3000',
        quantity: amountVal > 3000 ? 20 : 50,
        unitPrice: parseFloat((subTotal / (amountVal > 3000 ? 20 : 50)).toFixed(2)),
        weightKg: amountVal > 3000 ? 22.5 : 4.8,
        specs: {
          logoCustomization: true,
          packagingCustomization: amountVal > 3000,
          oemSpecifications: true
        },
        imageColor: amountVal > 3000 ? '#1e3a8a' : '#b45309'
      }
    ];

    // Generate milestones based on amount
    const depositAmt = parseFloat((amountVal * 0.3).toFixed(2));
    const balanceAmt = parseFloat((amountVal * 0.7).toFixed(2));

    const milestones: Milestone[] = [
      {
        id: 'M-1',
        title: '30% Deposit Payment',
        percentage: 30,
        amount: depositAmt,
        dueDate: orderDate,
        status: initialStatus === 'Pending' ? 'pending' : 'paid',
        paymentMethod: 'Bank Wire Transfer (T/T)',
        transactionId: initialStatus === 'Pending' ? undefined : 'TXN-99882210B',
        paidDate: initialStatus === 'Pending' ? undefined : orderDate
      },
      {
        id: 'M-2',
        title: '70% Balance Payment',
        percentage: 70,
        amount: balanceAmt,
        dueDate: 'Due before shipment dispatch',
        status: (initialStatus === 'Delivered') ? 'paid' : 'pending',
        paymentMethod: 'Bank Wire Transfer (T/T) or Letter of Credit (L/C)',
        transactionId: (initialStatus === 'Delivered') ? 'TXN-99884512B' : undefined,
        paidDate: (initialStatus === 'Delivered') ? '11/10/2024' : undefined
      }
    ];

    return {
      id: id || 'ORD1001',
      date: orderDate,
      buyer: buyerName,
      amount: amountVal,
      subTotal,
      tax,
      shippingFee,
      status: initialStatus,
      incoterms: 'FOB',
      loadingPort: 'Shanghai Port, China',
      destinationPort: 'Port of Long Beach, USA',
      weight: '450.00 kg',
      carrier: 'FreightMaster Global',
      trackingNumber: 'TRK987654321',
      shipDate: 'TBD',
      products,
      milestones,
      buyerDetails: {
        company: buyerName,
        contact: 'Sarah Connor',
        email: `s.connor@${buyerName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+1 (555) 019-2834',
        country: 'United States',
        address: '400 Cybernetics Way, Suite 300, Oakland, CA 94607, USA',
        taxId: 'US-883910023',
        tier: 'Gold Tier Buyer',
        verified: true
      },
      documents: [
        {
          name: `PROFORMA_INVOICE_${id || 'ORD1001'}.pdf`,
          size: '142 KB',
          uploadedBy: 'Supplier (You)',
          date: orderDate,
          url: '#'
        },
        {
          name: `BUYER_SPEC_DRAWING_${id || 'ORD1001'}.pdf`,
          size: '2.1 MB',
          uploadedBy: 'Buyer',
          date: orderDate,
          url: '#'
        }
      ]
    };
  };

  const details = getOrderDetails();

  // Initialize state once the order changes
  useEffect(() => {
    if (details) {
      setOrderStatus(details.status);
      
      setShippingInfo({
        carrier: details.carrier,
        trackingNumber: details.trackingNumber,
        shipDate: details.shipDate,
        loadingPort: details.loadingPort,
        destinationPort: details.destinationPort,
        weight: details.weight,
        incoterms: details.incoterms
      });

      setUploadedDocs(details.documents);
    }

    // Set initial chat history
    setChatMessages([
      {
        id: '1',
        sender: 'buyer',
        content: `Hi, we have initiated the order process for ${details.id}. Can you please review the custom logo placement and send the Proforma Invoice (PI)?`,
        timestamp: '10:15 AM'
      },
      {
        id: '2',
        sender: 'supplier',
        content: `Hello, thanks for your order! Yes, we have uploaded the draft PI. The custom branding logo will be laser-etched according to your drawing specs. Please confirm and transfer the 30% deposit so we can release this to production.`,
        timestamp: '10:32 AM'
      }
    ]);
  }, [id]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Stepper helper classes
  const getStepStatusClass = (step: number) => {
    // Steps mapping:
    // 1: Pending (Draft PI / Order Created)
    // 2: Deposit Paid (Order Confirmed / In Production)
    // 3: Production Finished
    // 4: Shipped
    // 5: Delivered (Completed)
    
    if (orderStatus === 'Pending') {
      if (step === 1) return 'active';
      return '';
    }
    if (orderStatus === 'Processing') {
      if (step < 3) return 'completed';
      if (step === 3) return 'active';
      return '';
    }
    if (orderStatus === 'Shipped') {
      if (step < 4) return 'completed';
      if (step === 4) return 'active';
      return '';
    }
    if (orderStatus === 'Delivered') {
      return 'completed';
    }
    return '';
  };

  // Get active step index for progress bar length
  const getProgressBarPercentage = () => {
    if (orderStatus === 'Pending') return 0;
    if (orderStatus === 'Processing') return 50;
    if (orderStatus === 'Shipped') return 75;
    if (orderStatus === 'Delivered') return 100;
    return 0;
  };

  // Status transitions
  const handleProgressOrder = () => {
    if (orderStatus === 'Pending') {
      setOrderStatus('Processing');
      // Simulate buyer payment confirmed notice
      setChatMessages(prev => [
        ...prev,
        {
          id: String(prev.length + 1),
          sender: 'supplier',
          content: 'I have confirmed your Proforma Invoice, and we have received your deposit bank slip. Production has commenced.',
          timestamp: 'Just Now'
        }
      ]);
    } else if (orderStatus === 'Processing') {
      // Shipped transition needs logistics details. Open Modal.
      setTempCarrier(shippingInfo.carrier);
      setTempTracking(shippingInfo.trackingNumber);
      setTempPort(shippingInfo.destinationPort);
      setShowShipmentModal(true);
    } else if (orderStatus === 'Shipped') {
      setOrderStatus('Delivered');
      setChatMessages(prev => [
        ...prev,
        {
          id: String(prev.length + 1),
          sender: 'supplier',
          content: 'The freight carrier reports the container is cleared and delivered at destination. We have marked the order completed.',
          timestamp: 'Just Now'
        }
      ]);
    }
  };

  // Save shipping from modal
  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingInfo(prev => ({
      ...prev,
      carrier: tempCarrier,
      trackingNumber: tempTracking,
      destinationPort: tempPort,
      shipDate: new Date().toLocaleDateString()
    }));
    setOrderStatus('Shipped');
    setShowShipmentModal(false);

    // Simulate shipping message
    setChatMessages(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        sender: 'supplier',
        content: `Goods dispatched. Shipped via ${tempCarrier} under Waybill: ${tempTracking}. Custom documents uploaded.`,
        timestamp: 'Just Now'
      }
    ]);

    // Add Commercial Invoice & Bill of Lading to docs vault
    setUploadedDocs(prev => [
      ...prev,
      {
        name: `COMMERCIAL_INVOICE_${details.id}.pdf`,
        size: '128 KB',
        uploadedBy: 'Supplier (You)',
        date: new Date().toLocaleDateString(),
        url: '#'
      },
      {
        name: `BILL_OF_LADING_${details.id}.pdf`,
        size: '890 KB',
        uploadedBy: 'Supplier (You)',
        date: new Date().toLocaleDateString(),
        url: '#'
      }
    ]);
  };

  // Cancel order handler
  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order? This will notify the buyer.')) {
      setOrderStatus('Cancelled');
      setChatMessages(prev => [
        ...prev,
        {
          id: String(prev.length + 1),
          sender: 'supplier',
          content: 'This order has been cancelled by the supplier. Reversal of any transaction funds will be mediated by Trade Assurance.',
          timestamp: 'Just Now'
        }
      ]);
    }
  };

  // const handleSendMessage = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newMessage.trim()) return;

  //   const msg: ChatMessage = {
  //     id: String(chatMessages.length + 1),
  //     sender: 'supplier',
  //     content: newMessage,
  //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //   };

  //   setChatMessages([...chatMessages, msg]);
  //   setNewMessage('');

  //   // Simulate a brief buyer auto-reply after 2 seconds for interactivity
  //   setTimeout(() => {
  //     setChatMessages(prev => [
  //       ...prev,
  //       {
  //         id: String(prev.length + 1),
  //         sender: 'buyer',
  //         content: 'Understood. We are tracking this closely in our system. Thank you for the update.',
  //         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //       }
  //     ]);
  //   }, 2000);
  // };

  // Document upload mockup
  const triggerMockUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const newDoc: DocumentFile = {
          name: file.name.toUpperCase().replace(/\s+/g, '_'),
          size: `${Math.round(file.size / 1024)} KB`,
          uploadedBy: 'Supplier (You)',
          date: new Date().toLocaleDateString(),
          url: '#'
        };
        setUploadedDocs(prev => [...prev, newDoc]);
        
        // Notify chat
        setChatMessages(prev => [
          ...prev,
          {
            id: String(prev.length + 1),
            sender: 'supplier',
            content: `Uploaded new contract document: ${file.name}`,
            timestamp: 'Just Now'
          }
        ]);
      }
    };
    input.click();
  };

  // View Receipt handler
  const handleViewReceipt = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowReceiptModal(true);
  };

  // Quick order action button text based on status
  const getActionButtonText = () => {
    switch (orderStatus) {
      case 'Pending': return 'Approve PI & Begin Production';
      case 'Processing': return 'Upload Waybill & Ship Goods';
      case 'Shipped': return 'Mark Cargo as Delivered';
      default: return 'Order Completed';
    }
  };

  return (
    <div className="order-detail-container">
      
      {/* ── Action Navigation Bar ── */}
      <div className="detail-actions-bar">
        <Link to={ROUTES.ORDERS} className="back-link">
          <FaArrowLeft /> Back to Orders
        </Link>
        <div className="action-buttons">
          {/* <button className="btn-action-outline" onClick={() => window.print()}>
            <FaPrint /> Print Invoice
          </button> */}
          {/* <button className="btn-action-outline" onClick={() => alert('PDF generation started... Link will be sent in chat.')}>
            <FaDownload /> Download Contract
          </button> */}
          {orderStatus !== 'Delivered' && orderStatus !== 'Cancelled' && (
            <button className="btn-action-outline text-danger" onClick={handleCancelOrder}>
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* ── Stepper: Trade Assurance Progress ── */}
      <div className="stepper-card">
        <div className="stepper-header">
          <div className="stepper-title">
            <FaShieldAlt style={{ color: 'var(--text-warning)', fontSize: '20px' }} />
            <h3>Trade Assurance Order Timeline</h3>
          </div>
          
          <div className="stepper-actions">
            {orderStatus !== 'Delivered' && orderStatus !== 'Cancelled' && (
              <button 
                className="stepper-btn"
                onClick={handleProgressOrder}
              >
                {getActionButtonText()}
              </button>
            )}
            {orderStatus === 'Cancelled' && (
              <span className="status-badge cancelled">Cancelled</span>
            )}
            {orderStatus === 'Delivered' && (
              <span className="status-badge delivered"><FaCheckCircle /> Order Closed</span>
            )}
          </div>
        </div>

        {/* Stepper Track */}
        <div className="stepper-track">
          <div 
            className="stepper-track-progress" 
            style={{ width: `${getProgressBarPercentage()}%` }}
          ></div>
          
          <div className={`stepper-step ${getStepStatusClass(1)}`}>
            <div className="step-node">1</div>
            <div className="step-info">
              <span className="step-label">Draft PI</span>
              <span className="step-date">{details.date}</span>
            </div>
          </div>

          <div className={`stepper-step ${getStepStatusClass(2)}`}>
            <div className="step-node">2</div>
            <div className="step-info">
              <span className="step-label">Deposit Confirmed</span>
              <span className="step-date">
                {orderStatus !== 'Pending' ? details.date : 'Awaiting payment'}
              </span>
            </div>
          </div>

          <div className={`stepper-step ${getStepStatusClass(3)}`}>
            <div className="step-node">3</div>
            <div className="step-info">
              <span className="step-label">In Production</span>
              <span className="step-date">
                {orderStatus === 'Processing' || orderStatus === 'Shipped' || orderStatus === 'Delivered' ? 'In progress' : 'Scheduled'}
              </span>
            </div>
          </div>

          <div className={`stepper-step ${getStepStatusClass(4)}`}>
            <div className="step-node">4</div>
            <div className="step-info">
              <span className="step-label">Cargo Dispatched</span>
              <span className="step-date">
                {orderStatus === 'Shipped' || orderStatus === 'Delivered' ? shippingInfo.shipDate : 'Pending logistics'}
              </span>
            </div>
          </div>

          <div className={`stepper-step ${getStepStatusClass(5)}`}>
            <div className="step-node">5</div>
            <div className="step-info">
              <span className="step-label">Closed / Completed</span>
              <span className="step-date">
                {orderStatus === 'Delivered' ? 'Completed' : 'Awaiting receipt'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Grid Layout ── */}
      <div className="detail-content-grid">
        
        {/* Main Column */}
        <div className="main-column">
          
          {/* Card 1: B2B Order Details */}
          <div className="detail-card">
            <div className="card-title-bar">
              <h3>
                <FaFileInvoice style={{ color: 'var(--primary-red)' }} />
                Commercial PI & Trade Terms
              </h3>
              <div className="trade-assurance-badge">
                <FaShieldAlt /> Trade Assurance Protected
              </div>
            </div>

            <div className="meta-info-grid">
              <div className="meta-info-item">
                <label>Order Contract ID</label>
                <span>{details.id}</span>
              </div>
              <div className="meta-info-item">
                <label>Contract Date</label>
                <span>{details.date}</span>
              </div>
              <div className="meta-info-item">
                <label>Trade Assurance Coverage</label>
                <span style={{ color: 'var(--text-success)' }}>Fully Secured (100% Refundable)</span>
              </div>
              <div className="meta-info-item">
                <label>Order Status Stamp</label>
                <span className={`status-badge ${orderStatus.toLowerCase()}`}>{orderStatus}</span>
              </div>
              <div className="meta-info-item">
                <label>Incoterms Agreement</label>
                <span>{shippingInfo.incoterms} - Port of Loading: {shippingInfo.loadingPort}</span>
              </div>
              <div className="meta-info-item">
                <label>Destination Port</label>
                <span>{shippingInfo.destinationPort}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Product Specifications Table */}
          <div className="detail-card">
            <div className="card-title-bar">
              <h3>
                <FaBoxes style={{ color: 'var(--primary-red)' }} />
                Customized Product Specifications
              </h3>
              <span className="text-sm font-bold text-heading">
                Total Weight: {shippingInfo.weight}
              </span>
            </div>

            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product & Specification Details</th>
                    <th>HS Code</th>
                    <th className="text-center">Customizations</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {details.products.map(prod => (
                    <tr key={prod.id}>
                      <td>
                        <div className="product-cell-detail">
                          <div 
                            className="product-thumbnail" 
                            style={{ backgroundColor: prod.imageColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}
                          >
                            <FaBoxes />
                          </div>
                          <div className="product-text-info">
                            <span className="product-title">{prod.name}</span>
                            <div className="product-sku-row">
                              <span className="product-sku">SKU: {prod.sku}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><code>{prod.hsCode}</code></td>
                      <td className="text-center">
                        <div className="flex flex-center gap-1">
                          {prod.specs.logoCustomization && <span className="spec-badge logo">Custom Logo</span>}
                          {prod.specs.packagingCustomization && <span className="spec-badge pack">Custom Package</span>}
                          {prod.specs.oemSpecifications && <span className="spec-badge custom">OEM Spec</span>}
                        </div>
                      </td>
                      <td className="text-center font-bold text-heading">{prod.quantity} units</td>
                      <td className="text-right font-medium">${prod.unitPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td className="text-right font-bold text-heading">${(prod.quantity * prod.unitPrice).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations and Notes */}
            <div className="summary-container">
              <div className="important-contract-notes">
                <h4>B2B Shipping & Production Notes</h4>
                <p>
                  1. Production will begin immediately following confirmation of the 30% deposit bank slip. <br/>
                  2. Quality Inspection certificate (CE/ISO) to be uploaded in the document center before loading. <br/>
                  3. Freight calculations are fixed based on FOB port terms.
                </p>
              </div>

              <div className="invoice-calculations">
                <div className="calc-row">
                  <span>Items Subtotal:</span>
                  <span>${details.subTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="calc-row">
                  <span>Logistics/FOB Freight:</span>
                  <span>${details.shippingFee.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="calc-row">
                  <span>Customs Clearance/V.A.T (5%):</span>
                  <span>${details.tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="calc-row bold-total">
                  <span>Grand Total (USD):</span>
                  <span>${details.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Payments & Milestones */}
          <div className="detail-card">
            <div className="card-title-bar">
              <h3>
                <FaCreditCard style={{ color: 'var(--primary-red)' }} />
                B2B Payment Milestones (T/T Escrow)
              </h3>
            </div>

            <div className="milestones-list">
              {details.milestones.map((ms, index) => {
                // Adjust status dynamically based on current order status state
                let currentStatus = ms.status;
                let txId = ms.transactionId;
                let paidD = ms.paidDate;

                if (index === 0 && orderStatus !== 'Pending') {
                  currentStatus = 'paid';
                  txId = txId || 'TXN-99882210B';
                  paidD = paidD || details.date;
                }
                if (index === 1 && orderStatus === 'Delivered') {
                  currentStatus = 'paid';
                  txId = txId || 'TXN-99884512B';
                  paidD = paidD || new Date().toLocaleDateString();
                }

                return (
                  <div key={ms.id} className={`milestone-item ${currentStatus === 'paid' ? 'paid' : ''}`}>
                    <div className="milestone-icon-indicator">
                      {currentStatus === 'paid' ? <FaCheckCircle /> : <FaClock />}
                    </div>
                    
                    <div className="milestone-details">
                      <div className="milestone-header-row">
                        <span className="milestone-title">{ms.title}</span>
                        <span className="milestone-amt">${ms.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
                      </div>
                      
                      <div className="milestone-meta-desc">
                        {currentStatus === 'paid' ? (
                          <span>
                            Paid via {ms.paymentMethod} on {paidD}. Transaction Ref: <code>{txId}</code>.
                          </span>
                        ) : (
                          <span>
                            {ms.dueDate}. Preferred method: {ms.paymentMethod}.
                          </span>
                        )}
                      </div>
                    </div>

                    {currentStatus !== 'paid' && (
                      <button 
                        className="milestone-action-btn"
                        onClick={() => handleViewReceipt(ms)}
                      >
                        Verify Slip
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="side-column">
          
          {/* Side Card 1: Buyer Business Card */}
          <div className="detail-card">
            <div className="card-title-bar">
              <h3>
                <FaUserCheck style={{ color: 'var(--primary-red)' }} />
                Buyer Information
              </h3>
            </div>

            <div className="buyer-profile-card">
              <div className="buyer-avatar-placeholder">
                {details.buyerDetails.contact.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="buyer-basic-details">
                <span className="buyer-company-name">{details.buyerDetails.company}</span>
                <span className="buyer-contact-name">{details.buyerDetails.contact}</span>
                <div className="buyer-verifications">
                  <span className="buyer-badge-tag gold-buyer">{details.buyerDetails.tier}</span>
                  <span className="buyer-badge-tag">Verified Business</span>
                </div>
              </div>
            </div>

            <div className="buyer-field-list">
              <div className="buyer-field">
                <label>Business Email</label>
                <span>{details.buyerDetails.email}</span>
              </div>
              <div className="buyer-field">
                <label>Office Phone</label>
                <span>{details.buyerDetails.phone}</span>
              </div>
              <div className="buyer-field">
                <label>Ship-to Region</label>
                <span>{details.buyerDetails.country}</span>
              </div>
              <div className="buyer-field">
                <label>Company Tax ID</label>
                <span><code>{details.buyerDetails.taxId}</code></span>
              </div>
              <div className="buyer-field">
                <label>Delivery Destination Address</label>
                <span style={{ fontSize: '11px', lineHeight: '1.4' }}>{details.buyerDetails.address}</span>
              </div>
            </div>
          </div>

          {/* Side Card 2: Interactive Buyer Message Portal */}
          {/* <div className="detail-card">
            <div className="card-title-bar">
              <h3>
                <FaComments style={{ color: 'var(--primary-red)' }} />
                Buyer Chat Portal
              </h3>
            </div>

            <div className="chat-container">
              <div className="chat-header">
                <div className="chat-buyer-indicator">
                  <div className="online-dot"></div>
                  <span className="chat-title-text">{details.buyerDetails.contact}</span>
                </div>
                <span className="text-xs text-muted">Active negotiation</span>
              </div>

              <div className="chat-body">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-msg-row ${msg.sender === 'supplier' ? 'sent' : 'received'}`}>
                    <div className="chat-msg-bubble">
                      {msg.content}
                    </div>
                    <span className="chat-msg-meta">{msg.timestamp}</span>
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>

              <form className="chat-footer" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder="Ask a question or share details..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button type="submit" className="chat-send-btn">
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div> */}

          {/* Side Card 3: Logistics Customs & Documents Vault */}
          <div className="detail-card">
            <div className="card-title-bar">
              <h3>
                <FaTruck style={{ color: 'var(--primary-red)' }} />
                Logistics & Documents
              </h3>
            </div>

            <div className="logistics-card-layout">
              {/* Tracking Block */}
              <div className="logistics-tracking-block">
                <div className="logistics-summary">
                  <FaTruck style={{ fontSize: '20px', color: 'var(--text-gray)' }} />
                  <div className="logistics-desc">
                    <strong>{shippingInfo.carrier}</strong>
                    {orderStatus === 'Shipped' || orderStatus === 'Delivered' ? (
                      <span>Waybill: <code>{shippingInfo.trackingNumber}</code></span>
                    ) : (
                      <span>Logistics pending dispatch</span>
                    )}
                  </div>
                </div>
                {orderStatus !== 'Pending' && orderStatus !== 'Cancelled' && (
                  <button 
                    className="tracking-external-btn"
                    onClick={() => {
                      if (orderStatus === 'Processing') {
                        setTempCarrier(shippingInfo.carrier);
                        setTempTracking(shippingInfo.trackingNumber);
                        setTempPort(shippingInfo.destinationPort);
                        setShowShipmentModal(true);
                      } else {
                        alert(`Tracking ${shippingInfo.trackingNumber} with carrier ${shippingInfo.carrier}`);
                      }
                    }}
                  >
                    {orderStatus === 'Processing' ? 'Add Tracking' : 'Track Shipment'}
                  </button>
                )}
              </div>

              {/* Documents Vault */}
              <div className="documents-section">
                <span className="text-xs font-bold text-heading uppercase">Contract Documents ({uploadedDocs.length})</span>
                {uploadedDocs.map((doc, idx) => (
                  <div key={idx} className="doc-vault-item">
                    <div className="doc-info">
                      <FaFilePdf className="doc-icon" />
                      <div className="doc-meta">
                        <span className="doc-name" title={doc.name}>
                          {doc.name.length > 22 ? doc.name.slice(0, 20) + '...' : doc.name}
                        </span>
                        <span className="doc-size">{doc.size} • By {doc.uploadedBy}</span>
                      </div>
                    </div>
                    <div className="doc-actions">
                      <button 
                        className="doc-dl-btn" 
                        onClick={() => alert(`Downloading file: ${doc.name}`)}
                        title="Download Document"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload Action */}
                <div className="upload-dropzone" onClick={triggerMockUpload}>
                  <FaUpload />
                  <span className="upload-text">Upload Custom Clearance Docs</span>
                  <span className="upload-subtext">PDF, DOCX up to 10MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal Dialog: Shipment Tracking Update ── */}
      {showShipmentModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4>Dispatched Cargo Waybill Details</h4>
              <button 
                className="modal-close-btn"
                onClick={() => setShowShipmentModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveShipping}>
              <div className="form-group">
                <label>Ocean / Air Freight Carrier</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. DHL, FedEx, Cosco Shipping, Maersk"
                  value={tempCarrier}
                  onChange={e => setTempCarrier(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Bill of Lading / Air Waybill (AWB) Tracking Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. TRK987654321"
                  value={tempTracking}
                  onChange={e => setTempTracking(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Destination Discharge Port</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. Port of Rotterdam, Port of Hamburg"
                  value={tempPort}
                  onChange={e => setTempPort(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-action-outline"
                  onClick={() => setShowShipmentModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-action-primary"
                >
                  Submit & Mark Order Shipped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Dialog: Bank Wire Transfer Receipt Verification ── */}
      {showReceiptModal && selectedMilestone && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4>Bank Slip Verification</h4>
              <button 
                className="modal-close-btn"
                onClick={() => setShowReceiptModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <FaFilePdf style={{ fontSize: '48px', color: '#c0392b' }} />
                <span className="font-bold text-heading">BANK_WIRE_RECEIPT_{details.id}.pdf</span>
                <span className="text-xs text-muted">Uploaded by Buyer (Sarah Connor)</span>
              </div>

              <div className="buyer-field-list" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="buyer-field">
                  <label>Milestone Target</label>
                  <span>{selectedMilestone.title}</span>
                </div>
                <div className="buyer-field">
                  <label>Total Deposit Due</label>
                  <span className="font-bold">${selectedMilestone.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
                </div>
                <div className="buyer-field">
                  <label>Declared Transaction Ref</label>
                  <span><code>TXN-99882210B</code></span>
                </div>
                <div className="buyer-field">
                  <label>Swift Bank Code</label>
                  <span>CHASUS33XXX</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-action-outline text-danger" 
                  onClick={() => {
                    alert('Receipt flagged as invalid. The buyer has been notified to re-upload.');
                    setShowReceiptModal(false);
                  }}
                >
                  Reject Slip
                </button>
                <button 
                  className="btn-action-primary" 
                  onClick={() => {
                    alert('Bank wire transfer slip approved! Funds credited to Escrow escrow.');
                    // Progress order status if Pending
                    if (orderStatus === 'Pending') {
                      setOrderStatus('Processing');
                    }
                    setShowReceiptModal(false);
                  }}
                >
                  Approve Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
