import { FaFileExport, FaPlus } from 'react-icons/fa'
import '../../styles/product_management.css'
import SearchBar from '../Dashboard/ProductManagement/SearchBar'
import { LiaEdit } from 'react-icons/lia'
import { AiFillDelete } from 'react-icons/ai'
import { GrView } from 'react-icons/gr'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import LinkButton from '../../shared/LinkButton/LinkButton'

// ── Mock Order Data ──────────────────────────────────────────────────────────
const generateMockOrders = (count: number) => {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered']
  const buyers = ['Acme Corp', 'Global Traders', 'TechSource Ltd', 'MegaBuy Inc', 'ProImport Co']
  const orders: any[] = []
  for (let i = 1; i <= count; i++) {
    orders.push({
      id: `ORD${1000 + i}`,
      date: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
      rawDate: new Date(2024, i % 12, (i % 28) + 1),
      buyer: buyers[i % buyers.length],
      amount: `$${(Math.random() * 5000 + 100).toFixed(2)}`,
      items: Math.floor(Math.random() * 20) + 1,
      status: statuses[i % statuses.length],
    })
  }
  return orders
}

const mockOrders = generateMockOrders(35)

const Order = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const [buyerFilter, setBuyerFilter] = useState('')
  const [dateRange, setDateRange] = useState<Date[] | null>(null)

  const statusValues = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered']

  const buyerValues = [
    'All',
    ...new Set(mockOrders.map((item: any) => item.buyer))
  ]

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filteredOrders = mockOrders.filter(o => {
    const matchStatus = !statusFilter || statusFilter === 'All' || o.status === statusFilter
    const matchBuyer = !buyerFilter || buyerFilter === 'All' || o.buyer === buyerFilter
    let matchDate = true
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      matchDate = o.rawDate >= dateRange[0] && o.rawDate <= dateRange[1]
    }
    return matchStatus && matchBuyer && matchDate
  })

  // ── Body Templates ─────────────────────────────────────────────────────────
  const countFunction = (_rowData: any, options: any) => {
    return <span>{options.rowIndex + 1}</span>
  }

  const orderIdBody = (options: any) => {
    return <h4>{options.id}</h4>
  }

  const dateBody = (options: any) => {
    return <h4>{options.date}</h4>
  }

  const buyerBody = (options: any) => {
    return (
      <h4>
        {options.buyer.length > 13
          ? options.buyer.slice(0, 13) + '...'
          : options.buyer}
      </h4>
    )
  }

  const itemsBody = (options: any) => {
    return <h4>{options.items}</h4>
  }

  const amountBody = (options: any) => {
    return <h4>{options.amount}</h4>
  }

  const statusBody = (options: any) => {
    return <h4>{options.status}</h4>
  }

  const OrderTableActions = (options: any) => {
    return (
      <div className='btnEditDelete'>
        <LinkButton
          styleName='blue'
          link={`order-details/${options.id}`}
        ><GrView /></LinkButton>
        <LinkButton
          styleName='green'
          link={`order-edit/${options.id}`}
        ><LiaEdit /></LinkButton>
        <LinkButton
          styleName='red'
          link={`order-delete/${options.id}`}
        ><AiFillDelete /></LinkButton>
      </div>
    )
  }

  return (
    <div className='product-mgmt'>
      {/* ================= HEADER ================= */}

      <div className='mgmt-header'>
        <div className='header-text'>
          <h1>Order Management</h1>
          <p>Track, manage, and process all your B2B orders.</p>
        </div>
        <div className='header-actions'>
          <button className='bulk-upload-btn'>
            <FaFileExport />
            Export CSV
          </button>

          <button className='add-product-btn'>
            <FaPlus />
            New Order
          </button>
        </div>
      </div>

      {/* ================= FILTER SECTION ================= */}

      <section className='table-section'>
        <section className='category-section'>
          {/* ================= SEARCH BAR ================= */}

          <SearchBar />

          {/* ================= STATUS DROPDOWN ================= */}

          <div className=''>
            <Dropdown
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.value)
              }}
              options={statusValues}
              placeholder='Select Status'
              filter
              className='category-dropdown'
            />
          </div>

          {/* ================= BUYER DROPDOWN ================= */}

          <div className=''>
            <Dropdown
              value={buyerFilter}
              onChange={e => {
                setBuyerFilter(e.value)
              }}
              options={buyerValues}
              placeholder='Select Buyer'
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

        {/* Data table for orders */}
        <section className='mt-2'>
          <DataTable value={filteredOrders} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink">
            <Column header='#' body={countFunction}></Column>
            <Column header='Order ID' body={orderIdBody}></Column>
            <Column header='Date' body={dateBody}></Column>
            <Column header='Buyer' body={buyerBody}></Column>
            <Column header='Items' body={itemsBody}></Column>
            <Column header='Amount' body={amountBody}></Column>
            <Column header='Status' body={statusBody}></Column>
            <Column header='Actions' body={OrderTableActions}></Column>
          </DataTable>
        </section>
      </section>
    </div>
  )
}

export default Order