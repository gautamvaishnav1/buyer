import { FaPlus, FaCloudUploadAlt } from 'react-icons/fa'
import '../../../styles/product_management.css'
import SearchBar from './SearchBar'
import { LiaEdit } from "react-icons/lia";

import { AiFillDelete } from "react-icons/ai";
import { GrView } from "react-icons/gr";

// import TypeFilter from './TypeFilter'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import LinkButton from '../../../shared/LinkButton/LinkButton'

const ProductManagement = () => {
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
  const countFunction = ( rowData:any,options: any) => {
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

  const ProductTableActions = (options: any) => {
    // console.log(options.id, 'options')

    return (
      <div className='btnEditDelete'>
        <LinkButton
          styleName='blue'
          link={`view-product/${options.id}`}
         
        ><GrView/></LinkButton>
        <LinkButton
          styleName='green'
          link={`edit-products/${options.id}`}
          
        ><LiaEdit/></LinkButton>
        <LinkButton
          styleName='red'
          link={`delete-products/${options.id}`}
          // text={`Delete`}
        ><AiFillDelete/></LinkButton>
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
          <button className='bulk-upload-btn'>
            <FaCloudUploadAlt />
            Bulk Upload
          </button>

          <button className='add-product-btn'>
            <FaPlus />
            Add New Product
          </button>
        </div>
      </div>

      {/* ================= FILTER SECTION ================= */}

      <section className='table-section'>
        <section className='category-section'>
          {/* ================= SEARCH BAR ================= */}

          <SearchBar />

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
        <section className='mt-2'>
          <DataTable value={productData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink">
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
