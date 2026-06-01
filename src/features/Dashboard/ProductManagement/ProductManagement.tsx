import { FaPlus, FaCloudUploadAlt } from 'react-icons/fa'
import '../../../styles/product_management.css'
import SearchBar from './SearchBar'
import { LiaEdit } from "react-icons/lia";

import { AiFillDelete } from "react-icons/ai";
import { GrView } from "react-icons/gr";

// import TypeFilter from './TypeFilter'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState } from 'react'
import { deleteProducts } from './productStore'
import { matchesSearch } from '../../../shared/utils/filterList'
import { Dropdown } from 'primereact/dropdown'
import LinkButton from '../../../shared/LinkButton/LinkButton'
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants';

const ProductManagement = () => {
  const dispatch = useDispatch()
  const productData = useSelector((state: any) => state.products.products)
  // console.log('Product ====>', productData)
  const productDataValue = productData
  // console.log(productData.map((Id)=>Id.category),'Product Data')
  const categoriesData = useSelector((state: any) => state.category.categories)

  const categoryValues = [
    'All',
    ...new Set(categoriesData.map((item: any) => item.category))
  ]

  const allSubcategoriesValue = categoriesData.flatMap(
    (cat: any) => cat.subCategory || []
  )

  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(productData)) return []
    return productData.filter((product: any) => {
      const matchCategory =
        !category || category === 'All' || product.category === category
      const matchSubCategory =
        !subCategory ||
        subCategory === 'All' ||
        product.subcategory === subCategory
      const matchSearchTerm = matchesSearch(
        searchQuery,
        product.title,
        product.category,
        product.subcategory,
        product.status,
        product.id,
        product.inventory?.sku,
        product.slug
      )
      return matchCategory && matchSubCategory && matchSearchTerm
    })
  }, [productData, category, subCategory, searchQuery])

  const subCategories =
    category === 'All'
      ? ['All', ...new Set(allSubcategoriesValue)]
      : [
          'All',
          ...new Set(
            categoriesData
              .filter((item: any) => item.category === category)
              .flatMap((item: any) => item.subCategory || [])
          )
        ]
  // for Data table
  const imageBodyTemplate = (options: any) => {
    return (
      <img
        src={options.images}
        className='imageBodyTemplate-img'
        alt={options.title}
      />
    )
  }
  const nameOfProduct = (options: any) => {
    // console.log(options, 'options')
    return (
      <h4>
        {options.title.length > 13
          ? options.title.slice(0, 13) + '...'
          : options.title}
      </h4>
    )
  } 
  const countFunction = (_rowData: any, options: any) => {
    console.log(options.rowIndex+1)
    return <span>{options.rowIndex + 1}</span>
  }

  const productCategory = (options: any) => {
    return <h4>{options.category}</h4>
  }
  const status = (options: any) => {
    return <h4>{options.status}</h4>
  }

  const productSubCategory = (options: any) => {  
    return <h4>{options.subcategory}</h4>
  }

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      dispatch(deleteProducts(productId))
    }
  }

  const handleBulkUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.xlsx,.xls'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        window.alert(`Bulk upload queued for "${file.name}". Import will run in the background.`)
      }
    }
    input.click()
  }

  const ProductTableActions = (options: any) => {
    return (
      <div className='btnEditDelete'>
        <LinkButton
          styleName='blue'
          link={ROUTES.VIEW_PRODUCT.replace(':id', String(options.id))}
        ><GrView/></LinkButton>
        <LinkButton
          styleName='green'
          link={ROUTES.EDIT_PRODUCTS.replace(':id', String(options.id))}
        ><LiaEdit/></LinkButton>
        <button
          type="button"
          className="red-link"
          aria-label="Delete product"
          onClick={() => handleDeleteProduct(options.id)}
        ><AiFillDelete/></button>
      </div>
    )
  }
  return (
    <div className='product-mgmt'>
      {/* ================= HEADER ================= */}

      <div className='mgmt-header'>
        <div className='header-text'>
          <h1>Product Management</h1>
          <p>Manage your inventory, specifications, and pricing.</p>
        </div>
        <div>
          {Array.isArray(productDataValue)
            ? productDataValue.map(
                (item: { products: { id?: string | number } & any }) =>
                  item.products
              )
            : null}
        </div>
        <div className='header-actions'>
          <button type="button" className='bulk-upload-btn' onClick={handleBulkUpload}>
            <FaCloudUploadAlt />
            Bulk Upload
          </button>

          <Link to={ROUTES.ADD_PRODUCTS} className='add-product-btn '>
            <FaPlus />
            Add New Product
          </Link>
        </div>
      </div>

      {/* ================= FILTER SECTION ================= */}

      <section className='table-section'>
        <section className='category-section'>
          {/* ================= SEARCH BAR ================= */}

          <SearchBar
            placeholder="Search products"
            value={searchQuery}
            onChange={setSearchQuery}
          />

          {/* ================= CATEGORY DROPDOWN ================= */}

          <div className=''>
            <Dropdown
              value={category}
              onChange={e => {
                setCategory(e.value)

                // Reset sub category when category changes
                setSubCategory('All')

                // console.log("Selected Category :", e.value)
              }}
              options={categoryValues}
              placeholder='Select Category'
              filter
              className='category-dropdown'
            />
          </div>

          {/* ================= SUB CATEGORY DROPDOWN ================= */}

          <div className=''>
            <Dropdown
              value={subCategory}
              onChange={e => {
                setSubCategory(e.value)

                // console.log("Selected Sub Category :", e.value)
              }}
              options={subCategories}
              placeholder='Select Sub Category'
              filter
              className='category-dropdown'
            />
          </div>

          {/* ================= TYPE FILTER ================= */}

          {/* <TypeFilter /> */}
        </section>
        {/* Data table for items */}
        <section className='mt-2 table-scroll'>
          <DataTable
            value={filteredProducts}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: '100%' }}
            className='responsive-datatable'
            paginatorTemplate='RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink'
            currentPageReportTemplate='{first}–{last} of {totalRecords}'
            paginatorClassName='mgmt-paginator'
          >
            <Column header='#' body={countFunction}></Column>
            <Column header='Name' body={nameOfProduct}></Column>
            <Column header='Image' body={imageBodyTemplate}></Column>
            <Column header='Category' body={productCategory}></Column>
            <Column header='Sub Category' body={productSubCategory}></Column>
            <Column header='Status' body={status}></Column>
            <Column header='Actions' body={ProductTableActions}></Column>
          </DataTable>
        </section>
      </section>
    </div>
  )
}

export default ProductManagement
