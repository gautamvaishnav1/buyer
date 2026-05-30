import { useState } from 'react'
// import { FaFileExport, FaPlus } from 'react-icons/fa'
import { GrView } from 'react-icons/gr'
// import { LiaEdit } from 'react-icons/lia'
// import { AiFillDelete } from 'react-icons/ai'
import { FaReply } from "react-icons/fa6";
// import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import LinkButton from '../../shared/LinkButton/LinkButton'
import SearchBar from '../Dashboard/ProductManagement/SearchBar'
import '../../styles/product_management.css'
import '../../styles/inquiry_management.css'
import TableData from '../../shared/components/tableData/TableData'

// ── Mock Inquiry Data ────────────────────────────────────────────────────────
const generateMockInquiries = (count: number) => {
  const statuses = ['New', 'Replied', 'Negotiation', 'Confirmed', 'Closed']
  const priorities = ['High', 'Medium', 'Low']
  const buyers = [
    { name: 'John Doe', company: 'Global Trade Corp' },
    { name: 'Alice Smith', company: 'BuildRight Ltd' },
    { name: 'Robert Brown', company: 'Euro Electronics' },
    { name: 'Sarah Wilson', company: 'Logistics Pro' },
    { name: 'David Chen', company: 'Asia Import Co' },
    { name: 'Maria Garcia', company: 'LatAm Supplies' },
    { name: 'James Taylor', company: 'UK Wholesale Ltd' },
  ]
  const products = [
    'Industrial Safety Gloves', 'Heavy Duty Steel Pipe', 'LED High Bay Light',
    'Standard Pallets', 'Office Furniture Set', 'Wireless Keyboard Pack',
    'Conference Microphone', 'Premium Bond Paper', 'Safety Hard Hat',
  ]

  const inquiries: any[] = []
  for (let i = 1; i <= count; i++) {
    const buyer = buyers[i % buyers.length]
    inquiries.push({
      id: `INQ${5000 + i}`,
      date: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
      rawDate: new Date(2024, i % 12, (i % 28) + 1),
      buyerName: buyer.name,
      company: buyer.company,
      product: products[i % products.length],
      quantity: Math.floor(Math.random() * 5000) + 50,
      budget: `$${(Math.random() * 25000 + 500).toFixed(2)}`,
      priority: priorities[i % priorities.length],
      status: statuses[i % statuses.length],
      lastMessage: [
        'Looking for a quote for bulk order.',
        'Can you offer a discount for 500+ units?',
        'Need samples before placing order.',
        'Please share updated price list.',
        'Interested in long-term supply contract.',
        'Payment has been initiated.',
        'Received the shipment, thanks.',
      ][i % 7],
    })
  }
  return inquiries
}

const mockInquiries = generateMockInquiries(35)

const InquiryManagement = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [dateRange, setDateRange] = useState<Date[] | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  const statusValues = ['All', 'New', 'Replied', 'Negotiation', 'Confirmed', 'Closed']
  const priorityValues = ['All', 'High', 'Medium', 'Low']

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalCount = mockInquiries.length
  const newCount = mockInquiries.filter(i => i.status === 'New').length
  const negotiationCount = mockInquiries.filter(i => i.status === 'Negotiation').length
  const confirmedCount = mockInquiries.filter(i => i.status === 'Confirmed').length
  const closedCount = mockInquiries.filter(i => i.status === 'Closed').length

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filteredInquiries = mockInquiries.filter(inq => {
    // Tab filter
    if (activeTab !== 'all' && inq.status.toLowerCase() !== activeTab) return false
    // Dropdown filters
    const matchStatus = !statusFilter || statusFilter === 'All' || inq.status === statusFilter
    const matchPriority = !priorityFilter || priorityFilter === 'All' || inq.priority === priorityFilter
    let matchDate = true
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      matchDate = inq.rawDate >= dateRange[0] && inq.rawDate <= dateRange[1]
    }
    return matchStatus && matchPriority && matchDate
  })

  // ── Body Templates ─────────────────────────────────────────────────────────
  const countFunction = (_rowData: any, options: any) => (
    <span>{options.rowIndex + 1}</span>
  )

  const inquiryIdBody = (row: any) => <h4>{row.id}</h4>
  const dateBody = (row: any) => <h4>{row.date}</h4>

  const buyerBody = (row: any) => (
    <div className="inq-buyer-cell">
      <div className="inq-avatar">{row.buyerName.charAt(0)}</div>
      <div>
        <h4>{row.buyerName.length > 15 ? row.buyerName.slice(0, 15) + '...' : row.buyerName}</h4>
        {/* <span className="inq-company">{row.company}</span> */}
      </div>
    </div>
  )

  const productBody = (row: any) => (
    <h4>{row.product.length > 18 ? row.product.slice(0, 18) + '...' : row.product}</h4>
  )

  const quantityBody = (row: any) => <h4>{row.quantity.toLocaleString()}</h4>
  const budgetBody = (row: any) => <h4>{row.budget}</h4>

  const priorityBody = (row: any) => (
    <span className={`inq-priority-tag inq-priority-${row.priority.toLowerCase()}`}>
      {row.priority}
    </span>
  )

  const statusBodyTemplate = (row: any) => (
    <span className={`status-tag ${row.status.toLowerCase()}`}>
      {row.status}
    </span>
  )

  const InquiryTableActions = (row: any) => (
    <div className='btnEditDelete'>
      <LinkButton styleName='blue' link={`/seller/view-inquiry/${row.id}`}>
        <GrView />
      </LinkButton>
      <LinkButton styleName='green' link={`/seller/inquiries/reply-inquiry/${row.id}`}>
        <FaReply />
      </LinkButton>
      {/* <LinkButton styleName='red' link={`delete-inquiry/${row.id}`}>
        <AiFillDelete />
      </LinkButton> */}
    </div>
  )

  const columns=[
    {
      header:'#',
      body:countFunction
    },
    {
      header:'Inquiry ID',
      body:inquiryIdBody
    },
    {
      header:'Date',
      body:dateBody
    },
    {
      header:'Buyer',
      body:buyerBody
    },
    {
      header:'Product',
      body:productBody
    },
    {
      header:'Qty',
      body:quantityBody
    },
    {
      header:'Budget',
      body:budgetBody
    },
    {
      header:'Priority',
      body:priorityBody
    },
    {
      header:'Status',
      body:statusBodyTemplate
    },
    {
      header:'Actions',
      body:InquiryTableActions  
    }
  ]
  return (
    <div className='product-mgmt'>
      {/* ================= HEADER ================= */}

      <div className='mgmt-header'>
        <div className='header-text'>
          <h1>Inquiry & Lead Management</h1>
          <p>Track and reply to potential buyers and manage your sales leads.</p>
        </div>
        <div className='header-actions'>
          {/* <button className='bulk-upload-btn'>
            <FaFileExport />
            Export CSV
          </button> */}

          {/* <button className='add-product-btn'>
            <FaPlus />
            New Inquiry
          </button> */}
        </div>
      </div>

      {/* ================= TAB FILTERS ================= */}

      <div className="lead-filters">
        <button className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All Leads ({totalCount})
        </button>
        <button className={`filter-tab ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
          New ({newCount})
        </button>
        <button className={`filter-tab ${activeTab === 'negotiation' ? 'active' : ''}`} onClick={() => setActiveTab('negotiation')}>
          Negotiation ({negotiationCount})
        </button>
        <button className={`filter-tab ${activeTab === 'confirmed' ? 'active' : ''}`} onClick={() => setActiveTab('confirmed')}>
          Confirmed ({confirmedCount})
        </button>
        <button className={`filter-tab ${activeTab === 'closed' ? 'active' : ''}`} onClick={() => setActiveTab('closed')}>
          Closed ({closedCount})
        </button>
      </div>

      {/* ================= FILTER SECTION + TABLE ================= */}

      <section className='table-section'>
        <section className='category-section'>
          {/* ================= SEARCH BAR ================= */}
          <SearchBar placeholder='search inquires' />

          {/* ================= STATUS DROPDOWN ================= */}
          <div>
            <Dropdown
              value={statusFilter}
              onChange={e => setStatusFilter(e.value)}
              options={statusValues}
              placeholder='Select Status'
              filter
              className='category-dropdown'
            />
          </div>

          {/* ================= PRIORITY DROPDOWN ================= */}
          <div>
            <Dropdown
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.value)}
              options={priorityValues}
              placeholder='Select Priority'
              filter
              className='category-dropdown'
            />
          </div>

          {/* ================= DATE FILTER ================= */}
          <div>
            <Calendar
              value={dateRange}
              onChange={e => setDateRange(e.value as Date[])}
              selectionMode='range'
              placeholder='Select Date Range'
              dateFormat='mm/dd/yy'
              showIcon
              className='category-dropdown'
            />
          </div>
        </section>

        {/* Data table for inquiries */}
        <section >
          <TableData data={filteredInquiries} columns={columns}/>
          {/* <DataTable
            value={filteredInquiries}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: '50rem' }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          >
            <Column header='#' body={countFunction}></Column>
            <Column header='Inquiry ID' body={inquiryIdBody}></Column>
            <Column header='Date' body={dateBody}></Column>
            <Column header='Buyer' body={buyerBody}></Column>
            <Column header='Product' body={productBody}></Column>
            <Column header='Qty' body={quantityBody}></Column>
            <Column header='Budget' body={budgetBody}></Column>
            <Column header='Priority' body={priorityBody}></Column>
            <Column header='Status' body={statusBodyTemplate}></Column>
            <Column header='Actions' body={InquiryTableActions}></Column>
          </DataTable> */}

        </section>
      </section>
    </div>
  )
}

export default InquiryManagement
