import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import dummyProducts from '../../../core/storage/DummyProduct_10.json'
import '../../../styles/product_management.css'
import { Button } from 'primereact/button'

type Product = {
  id: number
  title: string
  slug: string
  category: string
  status: string
  featured: boolean
  description: {
    short: string
    long: string
  }
  images: string[]
  thumbnail: string
  pricing: {
    basePrice: number
    currency: string
    gst: number
  }
  bulkPricing: Array<{ minQty: number; pricePerUnit: number }>
  inventory: {
    sku: string
    totalStock: number
    minOrderQty: number
  }
  supplier: {
    name: string
    companyName: string
    location: string
  }
  shipping: {
    weight: number
    dimensions: {
      length: number
      breadth: number
      height: number
    }
    dispatchTimeDays: number
  }
  returnPolicy: {
    returnable: boolean
    returnDays: number
  }
  compliance: {
    hsnCode: string
    gstRate: number
    countryOfOrigin: string
  }
  createdAt: string
  updatedAt: string
  subcategory: string
}

const ViewProduct = () => {
  const { id } = useParams<{id:string}>()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState<string>('basic')
  useEffect(() => {
    const foundProduct = dummyProducts.find((p: Product) => p.id === parseInt(id || '0'))
    if (foundProduct) {
      setProduct(foundProduct)
    }
  }, [id])

  if (!product) return <div className="p-6">Loading...</div>

  return (
    <div className="product-mgmt">
      <div className="edit-header">
        <div>
          <h1 className='text-sm'>{product.title}</h1>
          {/* <p className="text-muted">Product ID: {product.id}</p> */}
        </div>
      </div>

      <div className="edit-tabs">
          <Button label="Basic Info" className={activeTab === 'basic' ? 'tab-active' : ''} onClick={() => setActiveTab('basic')} />
          <Button label="Pricing" className={activeTab === 'pricing' ? 'tab-active' : ''} onClick={() => setActiveTab('pricing')} />
          <Button label="Inventory" className={activeTab === 'inventory' ? 'tab-active' : ''} onClick={() => setActiveTab('inventory')} />
          <Button label="Shipping" className={activeTab === 'shipping' ? 'tab-active' : ''} onClick={() => setActiveTab('shipping')} />
          <Button label="Compliance" className={activeTab === 'compliance' ? 'tab-active' : ''} onClick={() => setActiveTab('compliance')} />
      </div>

      <div className="edit-content">
        <div className="form-grid">
          <div className="form-section">
            <h3>Product Information</h3>
            <div className="form-group">
              <label>Title</label>
              <p className="text-xs text-black">{product.title}</p>
            </div>
            <div className="form-group">
              <label>Slug</label>
              <p className="text-xs text-black">{product.slug}</p>
            </div>
            <div className="form-group">
              <label>Category</label>
              <p className="text-xs text-black">{product.category}</p>
            </div>
            <div className="form-group">
              <label>Subcategory</label>
              <p className="text-xs text-black">{product.subcategory}</p>
            </div>
            <div className="form-group">
              <label>Status</label>
              <span className={product.status === 'active' ? 'text-success' : 'text-danger'}>
                {product.status}
              </span>
            </div>
            <div className="form-group">
              <label>Featured</label>
              <span className={product.featured ? 'text-success' : 'text-muted'}>
                {product.featured ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="form-section">
            <h3>Description</h3>
            <div className="form-group">
              <label>Short Description</label>
              <p className="text-xs text-black">{product.description.short}</p>
            </div>
            <div className="form-group">
              <label>Long Description</label>
              <p className="text-xs text-black">{product.description.long}</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Media</h3>
            <div className="form-group">
              <label>Thumbnail</label>
              <img src={product.thumbnail} alt={product.title} className="width-60 h-auto rounded-sm" />
            </div>
            <div className="form-group">
              <label>Additional Images</label>
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, index) => (
                  <img key={index} src={img} alt={`${product.title} ${index + 1}`} className="width-75 h-auto rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-section">
            <h3>Base Pricing</h3>
            <div className="form-group">
              <label>Currency</label>
              <p className="text-xs text-black">{product.pricing.currency}</p>
            </div>
            <div className="form-group">
              <label>Base Price</label>
              <p className="text-xs text-black">{product.pricing.basePrice} {product.pricing.currency}</p>
            </div>
            <div className="form-group">
              <label>GST Rate (%)</label>
              <p className="text-xs text-black">{product.pricing.gst}%</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Bulk Pricing Tiers</h3>
            {product.bulkPricing.map((tier, index) => (
              <div key={index} className="bulk-tier">
                <div className="form-group">
                  <label>Min Quantity</label>
                  <p className="text-xs text-black">{tier.minQty}</p>
                </div>
                <div className="form-group">
                  <label>Price Per Unit</label>
                  <p className="text-xs text-black">{tier.pricePerUnit} {product.pricing.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-section">
            <h3>Inventory Details</h3>
            <div className="form-group">
              <label>SKU</label>
              <p className="text-xs text-black">{product.inventory.sku}</p>
            </div>
            <div className="form-group">
              <label>Total Stock</label>
              <p className="text-xs text-black">{product.inventory.totalStock}</p>
            </div>
            <div className="form-group">
              <label>Minimum Order Quantity</label>
              <p className="text-xs text-black">{product.inventory.minOrderQty}</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Supplier Information</h3>
            <div className="form-group">
              <label>Supplier Name</label>
              <p className="text-xs text-black">{product.supplier.name}</p>
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <p className="text-xs text-black">{product.supplier.companyName}</p>
            </div>
            <div className="form-group">
              <label>Location</label>
              <p className="text-xs text-black">{product.supplier.location}</p>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-section">
            <h3>Shipping Information</h3>
            <div className="form-group">
              <label>Weight (kg)</label>
              <p className="text-xs text-black">{product.shipping.weight} kg</p>
            </div>
            <div className="form-group">
              <label>Dispatch Time (Days)</label>
              <p className="text-xs text-black">{product.shipping.dispatchTimeDays} days</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Package Dimensions (cm)</h3>
            <div className="form-grid-3">
              <div className="form-group">
                <label>Length</label>
                <p className="text-xs text-black">{product.shipping.dimensions.length} cm</p>
              </div>
              <div className="form-group">
                <label>Breadth</label>
                <p className="text-xs text-black">{product.shipping.dimensions.breadth} cm</p>
              </div>
              <div className="form-group">
                <label>Height</label>
                <p className="text-xs text-black">{product.shipping.dimensions.height} cm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-section">
            <h3>Compliance Details</h3>
            <div className="form-group">
              <label>HSN Code</label>
              <p className="text-xs text-black">{product.compliance.hsnCode}</p>
            </div>
            <div className="form-group">
              <label>GST Rate (%)</label>
              <p className="text-xs text-black">{product.compliance.gstRate}%</p>
            </div>
            <div className="form-group">
              <label>Country of Origin</label>
              <p className="text-xs text-black">{product.compliance.countryOfOrigin}</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Return Policy</h3>
            <div className="form-group">
              <label>Returnable</label>
              <p className="text-xs text-black">{product.returnPolicy.returnable ? 'Yes' : 'No'}</p>
            </div>
            <div className="form-group">
              <label>Return Days</label>
              <p className="text-xs text-black">{product.returnPolicy.returnDays} days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProduct