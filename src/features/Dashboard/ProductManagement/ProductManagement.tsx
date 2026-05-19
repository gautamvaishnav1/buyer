// import { useState } from 'react'
import { FaPlus, FaCloudUploadAlt } from 'react-icons/fa'
import '../../../styles/product_management.css'
import SearchBar from './SearchBar';
import SubCategoryFilter from './SubCategoryFilter';
import TypeFilter from './TypeFilter';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';




const ProductManagement = () => {
   
  const Products=useSelector((state:any)=>state.products.products)
  const categories=[...new Set(Products.map((item:any)=>item.category))]
  const categoryOptions = categories.map(cat => ({ name: cat }))

  const [category, setCategory] = useState('All')
  const [subCategory , setSubCategory ] = useState('All')
    const subCategories = category === 'All' 
    ? [...new Set(Products.map((item:any) => item.subCategory))]
    : [...new Set(
        Products
          .filter((item:any) => item.category === category)
          .map((item:any) => item.subCategory)
      )]

  // const [products] = useState<Product[]>([
  //   { id: '1', name: 'Industrial Safety Gloves', category: 'Safety Gear', price: '$2.50 - $4.00', moq: '500 pairs', status: 'Confirmed', image: 'https://images.unsplash.com/photo-1581092921461-7d157390fd51?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  //   { id: '2', name: 'Heavy Duty Steel Pipe', category: 'Construction', price: '$15.00 - $22.00', moq: '100 units', status: 'Pending', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  //   { id: '3', name: 'LED High Bay Light', category: 'Electronics', price: '$45.00', moq: '50 pcs', status: 'Confirmed', image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  // ])

  return (
    <div className="product-mgmt">
      <div className="mgmt-header">
        <div className="header-text">
          <h1>Product Management</h1>
          <p>Manage your inventory, specifications, and pricing.</p>
        </div>
        <div className="header-actions">
          <button className="bulk-upload-btn"><FaCloudUploadAlt /> Bulk Upload</button>
          <button className="add-product-btn"><FaPlus /> Add New Product</button>
        </div>
      </div>
      {/* Second section Category filter search bar and sub category filter */}
     <section className='category-section'>
      <SearchBar />

{/*Category Filter  */}
          <div className="card flex-center">
  <Dropdown
    value={category}
    onChange={(e) => {
      setCategory(e.value)
      setSubCategory("All")
    }}
    options={categoryOptions}
    optionLabel="name"
    placeholder="Select Category"
    filter
    className="category-dropdown"
  />
</div>

        <SubCategoryFilter data={subCategories} subCategory={subCategory} setSubCategory={setSubCategory} />
       <TypeFilter/>
     </section>

      {/* <div className="product-stats">
        <div className="p-stat"><span>Total Products</span> <strong>148</strong></div>
        <div className="p-stat"><span>Verified Products</span> <strong>124</strong> <FaCheckCircle className="v-icon" /></div>
        <div className="p-stat"><span>Low Stock</span> <strong>03</strong></div>
      </div> */}

      {/* <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Info</th>
              <th>Category</th>
              <th>Pricing / MOQ</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="table-product-info">
                    <img src={product.image} alt={product.name} className="table-product-img" />
                    <div className="name-wrap">
                       <span className="p-name">{product.name}</span>
                       <span className="p-sku">SKU: IND-{product.id}00X</span>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>
                  <div className="pricing-wrap">
                    <span className="p-price">{product.price}</span>
                    <span className="p-moq">Min. Order: {product.moq}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${product.status.toLowerCase()}`}>{product.status}</span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="edit-btn" title="Edit"><FaEdit /></button>
                    <button className="delete-btn" title="Delete"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* <div className="verification-promo">
        <div className="promo-content">
          <h3>Get the Verified Supplier Badge</h3>
          <p>Boost your trust score and increase inquiries by up to 60% with our verification process.</p>
        </div>
        <button className="apply-btn">Apply for Verification</button>
      </div> */}

     
    </div>
  )
}

export default ProductManagement
