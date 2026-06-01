// import { FaFileExport, FaPlus } from 'react-icons/fa'
import '../../styles/product_management.css'
import SearchBar from '../Dashboard/ProductManagement/SearchBar'
// import { LiaEdit } from 'react-icons/lia'
// import { AiFillDelete } from 'react-icons/ai'
import { GrView } from 'react-icons/gr'
// import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'

import { useState } from 'react'
import { matchesSearch } from '../../shared/utils/filterList'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import LinkButton from '../../shared/LinkButton/LinkButton'
import TableData from '../../shared/components/tableData/TableData'
import { ROUTES } from '../../shared/constants'

// ── Mock Payment Data ────────────────────────────────────────────────────────
const generateMockPayments = (count: number) => {
  const statuses = ['Completed', 'Pending', 'Failed', 'Refunded']
  const methods = ['Credit Card', 'Bank Transfer', 'Net 30', 'Purchase Order']
  const buyers = ['Acme Corp', 'Global Traders', 'TechSource Ltd', 'MegaBuy Inc', 'ProImport Co']
  const payments: any[] = []
  for (let i = 1; i <= count; i++) {
    payments.push({
      id: `PAY${3000 + i}`,
      orderId: `ORD${1000 + i}`,
      date: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
      rawDate: new Date(2024, i % 12, (i % 28) + 1),
      buyer: buyers[i % buyers.length],
      amount: `$${(Math.random() * 5000 + 100).toFixed(2)}`,
      method: methods[i % methods.length],
      status: statuses[i % statuses.length],
    })
  }
  return payments
}

const mockPayments = generateMockPayments(35)

const PaymentManagement = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')
  const [dateRange, setDateRange] = useState<Date[] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const statusValues = ['All', 'Completed', 'Pending', 'Failed', 'Refunded']

  const methodValues = [
    'All',
    ...new Set(mockPayments.map((item: any) => item.method))
  ]

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filteredPayments = mockPayments.filter(p => {
    const matchStatus = !statusFilter || statusFilter === 'All' || p.status === statusFilter
    const matchMethod = !methodFilter || methodFilter === 'All' || p.method === methodFilter
    let matchDate = true
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      matchDate = p.rawDate >= dateRange[0] && p.rawDate <= dateRange[1]
    }
    const matchSearchTerm = matchesSearch(
      searchQuery,
      p.id,
      p.orderId,
      p.buyer,
      p.amount,
      p.method,
      p.status,
      p.date
    )
    return matchStatus && matchMethod && matchDate && matchSearchTerm
  })

  // ── Body Templates ─────────────────────────────────────────────────────────
  const countFunction = (_rowData: any, options: any) => {
    return <span>{options.rowIndex + 1}</span>
  }

  const paymentIdBody = (options: any) => <h4>{options.id}</h4>
  const orderIdBody = (options: any) => <h4>{options.orderId}</h4>
  const dateBody = (options: any) => <h4>{options.date}</h4>
  const buyerBody = (options: any) => (
    <h4>{options.buyer.length > 13 ? options.buyer.slice(0, 13) + '...' : options.buyer}</h4>
  )
  const amountBody = (options: any) => <h4>{options.amount}</h4>
  const methodBody = (options: any) => <h4>{options.method}</h4>
  const statusBody = (options: any) => <h4>{options.status}</h4>

  const PaymentTableActions = (options: any) => {
    return (
      <div className='btnEditDelete'>
        <LinkButton
          styleName='blue'
          link={ROUTES.VIEW_PAYMENT.replace(':id', options.id)}
        ><GrView /></LinkButton>
        {/* <LinkButton
          styleName='green'
          link={`edit-payment/${options.id}`}
        ><LiaEdit /></LinkButton>
        <LinkButton
          styleName='red'
          link={`delete-payment/${options.id}`}
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
    header: "Payment ID",
    body: paymentIdBody,
  },
  {
    header: "Order ID",
    body: orderIdBody,
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
    header: "Amount",
    body: amountBody,
  },
  {
    header: "Method",
    body: methodBody,
  },
  {
    header: "Status",
    body: statusBody,
  },
  {
    header: "Actions",
    body: PaymentTableActions,  
  }  
  


]



  return (
    <div className='product-mgmt'>
      {/* ================= HEADER ================= */}

      <div className='mgmt-header'>
        <div className='header-text'>
          <h1>Payment Management</h1>
          <p>Track and manage all payment transactions.</p>
        </div>
        <div className='header-actions'>
          {/* <button className='bulk-upload-btn'>
            <FaFileExport />
            Export CSV
          </button> */}

          {/* <button className='add-product-btn'>
            <FaPlus />
            Record Payment
          </button> */}
        </div>
      </div>

      {/* ================= FILTER SECTION ================= */}

      <section className='table-section'>
        <section className='category-section'>
          {/* ================= SEARCH BAR ================= */}

          <SearchBar
            placeholder="Search payments"
            value={searchQuery}
            onChange={setSearchQuery}
          />

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

          {/* ================= PAYMENT METHOD DROPDOWN ================= */}

          <div className=''>
            <Dropdown
              value={methodFilter}
              onChange={e => setMethodFilter(e.value)}
              options={methodValues}
              placeholder='Select Method'
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

        {/* Data table for payments */}
        <section className='mt-2'>
          <TableData columns={columns} data={filteredPayments}/>
          {/* <DataTable value={filteredPayments} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink">
            <Column header='#' body={countFunction}></Column>
            <Column header='Payment ID' body={paymentIdBody}></Column>
            <Column header='Order ID' body={orderIdBody}></Column>
            <Column header='Date' body={dateBody}></Column>
            <Column header='Buyer' body={buyerBody}></Column>
            <Column header='Amount' body={amountBody}></Column>
            <Column header='Method' body={methodBody}></Column>
            <Column header='Status' body={statusBody}></Column>
            <Column header='Actions' body={PaymentTableActions}></Column>
          </DataTable> */}
        </section>
      </section>
    </div>
  )
}

export default PaymentManagement
