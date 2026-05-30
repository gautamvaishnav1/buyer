// import {  FaPlus } from 'react-icons/fa'
import '../../styles/product_management.css'
import SearchBar from '../Dashboard/ProductManagement/SearchBar'
// import { LiaEdit } from 'react-icons/lia'
// import { AiFillDelete } from 'react-icons/ai'
import { GrView } from 'react-icons/gr'
import { FaReply } from "react-icons/fa6";
// import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'

import { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import LinkButton from '../../shared/LinkButton/LinkButton'
import TableData from '../../shared/components/tableData/TableData'

// ── Mock RFQ Data ────────────────────────────────────────────────────────────
const generateMockRFQs = (count: number) => {
  const statuses = ['Open', 'Quoted', 'Negotiating', 'Closed', 'Expired']
  const buyers = ['Acme Corp', 'Global Traders', 'TechSource Ltd', 'MegaBuy Inc', 'ProImport Co']
  const categories = ['Electronics', 'Office Furniture', 'Safety Equipment', 'IT Equipment', 'Office Supplies']
  const rfqs: any[] = []
  for (let i = 1; i <= count; i++) {
    rfqs.push({
      id: `RFQ${2000 + i}`,
      date: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
      rawDate: new Date(2024, i % 12, (i % 28) + 1),
      buyer: buyers[i % buyers.length],
      category: categories[i % categories.length],
      quantity: Math.floor(Math.random() * 500) + 10,
      budget: `$${(Math.random() * 10000 + 500).toFixed(2)}`,
      status: statuses[i % statuses.length],
    })
  }
  return rfqs
}

const mockRFQs = generateMockRFQs(35)

const RFQManagement = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateRange, setDateRange] = useState<Date[] | null>(null)

  const statusValues = ['All', 'Open', 'Quoted', 'Negotiating', 'Closed', 'Expired']

  const categoryValues = [
    'All',
    ...new Set(mockRFQs.map((item: any) => item.category))
  ]
// __________________________________________________________ from redux______________________




  // ── Filtered data ──────────────────────────────────────────────────────────
  // const filteredRFQs = mockRFQs.filter(r => {
  //   const matchStatus = !statusFilter || statusFilter === 'All' || r.status === statusFilter
  //   const matchCategory = !categoryFilter || categoryFilter === 'All' || r.category === categoryFilter
  //   const matchDate = dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1] ? r.rawDate >= dateRange[0] && r.rawDate <= dateRange[1] : true
  //   return matchStatus && matchCategory && matchDate
  // })

  // ── Body Templates ─────────────────────────────────────────────────────────
  const countFunction = (_rowData: any, options: any) => {
    return <span>{options.rowIndex + 1}</span>
  }

  const rfqIdBody = (options: any) => <h4>{options.id}</h4>
  const dateBody = (options: any) => <h4>{options.date}</h4>
  const buyerBody = (options: any) => (
    <h4>{options.buyer.length > 13 ? `${options.buyer.slice(0, 13)}...` : options.buyer}</h4>
  )
  const categoryBody = (options: any) => <h4>{options.category}</h4>
  const quantityBody = (options: any) => <h4>{options.quantity}</h4>
  const budgetBody = (options: any) => <h4>{options.budget}</h4>
  const statusBody = (options: any) => <h4>{options.status}</h4>

  


  const RFQTableActions = (options: any) => {
    
    return (
      <div className='btnEditDelete'>
        <LinkButton
          styleName='blue'
          link={`/seller/view-rfq/${options.id}`}
        ><GrView /></LinkButton>
        <LinkButton
          styleName='green'
          link={`/seller/rfq/reply-rfq/${options.id}`}
        > <FaReply/></LinkButton>
        {/* <LinkButton
          styleName='red'
          link={`delete-rfq/${options.id}`}
        ><AiFillDelete /></LinkButton> */}
      </div>
    )
  }

    const columns = [
  {
    header: "#",
    body: countFunction,
  },
  {
    header: "RFQ ID",
    body: rfqIdBody,
  },
  {
    header: "Date",
    body: dateBody,
  },
  {
    header: "Buyer",
    body: buyerBody,
  },
  {
    header: "Category",
    body: categoryBody,
  },
  {
    header: "Quantity",
    body: quantityBody,
  },
  {
    header: "Budget",
    body: budgetBody,
  },
  {
    header: "Status",
    body: statusBody,
  },
  {
    header: "Actions",
    body: RFQTableActions,
  },
];
  return (
    <div className='product-mgmt'>
      {/* ================= HEADER ================= */}

      <div className='mgmt-header'>
        <div className='header-text'>
          <h1>RFQ Management</h1>
          <p>Manage requests for quotation from buyers.</p>
        </div>
        <div className='header-actions'>
          {/* <button className='bulk-upload-btn'>
            <FaFileExport />
            Export CSV
          </button> */}

          {/* <button className='add-product-btn'>
            <FaPlus />
            New RFQ
          </button> */}
        </div>
      </div>

      {/* ================= FILTER SECTION ================= */}

      <section className='table-section'>
        <section className='category-section'>
          {/* ================= SEARCH BAR ================= */}

          <SearchBar placeholder='search rfq' />

          {/* ================= STATUS DROPDOWN ================= */}

          <div className=''>
            <Dropdown
              value={statusFilter}
              onChange={e => setStatusFilter(e.value)}
              options={statusValues}
              placeholder='Select Status'
              filter
              className='category-dropdown'
            />
          </div>

          {/* ================= CATEGORY DROPDOWN ================= */}

          <div className=''>
            <Dropdown
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.value)}
              options={categoryValues}
              placeholder='Select Category'
              filter
              className='category-dropdown'
            />
          </div>

          {/* ================= DATE FILTER ================= */}

          <div className=''>
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

        {/* Data table for RFQs */}
        <TableData data={mockRFQs} columns={columns} />
       
      </section>
    </div>
  )
}

export default RFQManagement
