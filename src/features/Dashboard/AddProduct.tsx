import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { InputSwitch } from 'primereact/inputswitch'
import { FileUpload } from 'primereact/fileupload'
import { Button } from 'primereact/button'
import dummyProducts from '../../core/storage/DummyProduct_10.json'
import { addProducts } from './ProductManagement/productStore'
import '../../styles/product_management.css'

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

const AddProduct = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch()


  const [activeTab, setActiveTab] = useState('basic')

  const [product, setProduct] = useState<Product>(() => {
    const today = new Date().toISOString().split('T')[0]
    return {
      id: Date.now(),
      title: '',
      slug: '',
      category: '',
      status: 'active',
      featured: false,
      description: {
        short: '',
        long: ''
      },
      images: [],
      thumbnail: '',
      pricing: {
        basePrice: 0,
        currency: 'INR',
        gst: 18
      },
      bulkPricing: [{ minQty: 0, pricePerUnit: 0 }],
      inventory: {
        sku: '',
        totalStock: 0,
        minOrderQty: 1
      },
      supplier: {
        name: '',
        companyName: '',
        location: ''
      },
      shipping: {
        weight: 0,
        dimensions: {
          length: 0,
          breadth: 0,
          height: 0
        },
        dispatchTimeDays: 0
      },
      returnPolicy: {
        returnable: true,
        returnDays: 7
      },
      compliance: {
        hsnCode: '',
        gstRate: 18,
        countryOfOrigin: 'India'
      },
      createdAt: today,
      updatedAt: today,
      subcategory: ''
    }
  })

  const [bulkPricing, setBulkPricing] = useState<Array<{ minQty: number; pricePerUnit: number }>>([{ minQty: 0, pricePerUnit: 0 }])

  const categoriesData = useMemo(() => {
    const categories = (dummyProducts as Array<Partial<Product> & { category?: string }>).map((item) => item.category).filter(Boolean) as string[]
    return [...new Set(categories)]
  }, [])


  const handleInputChange = <K extends keyof Product>(field: K, value: Product[K]) => {
    if (!product) return
    setProduct({ ...product, [field]: value })
  }

  const handleNestedChange = <S extends keyof Product, F extends keyof Product[S]>(
    section: S,
    field: F,
    value: Product[S][F]
  ) => {
    if (!product) return

    const sectionValue = product[section]

    if (typeof sectionValue !== 'object' || sectionValue === null) return

    setProduct({
      ...product,
      [section]: {
        ...(sectionValue as Record<string, unknown>),
        [field as string]: value
      } as Product[S]
    })
  }



  const handleDimensionChange = (field: keyof Product['shipping']['dimensions'], value: number) => {
    if (!product) return
    setProduct({
      ...product,
      shipping: {
        ...product.shipping,
        dimensions: {
          ...product.shipping.dimensions,
          [field]: value
        }
      }
    })
  }


  const addBulkPricingTier = () => {
    setBulkPricing([...bulkPricing, { minQty: 0, pricePerUnit: 0 }])
  }

  const updateBulkPricing = (index: number, field: string, value: number) => {
    const updated = [...bulkPricing]
    updated[index] = { ...updated[index], [field]: value }
    setBulkPricing(updated)
  }

  const removeBulkPricingTier = (index: number) => {
    setBulkPricing(bulkPricing.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!product) {
      return;
    }
    // Prepare product data for saving
    const productData = {
      ...product,
      bulkPricing: bulkPricing.filter(tier => tier.minQty > 0 && tier.pricePerUnit > 0)
    }
      
    // Dispatch add product action
    dispatch(addProducts(productData))
      
    // Navigate back to products list
    navigate('/dashboard/products')
  }

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Draft', value: 'draft' }
  ]

  const currencyOptions = [
    { label: 'INR', value: 'INR' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' }
  ]

  if (!product) return <div className="p-6">Loading...</div>

  return (
    <div className="product-edit-page">
      <div className="edit-header">
        <div>
          <h1>Add Product</h1>
          <p className="text-muted">Create a new product</p>
        </div>
        <div className="header-actions">
          <Button label="Cancel" className="p-button-outlined" onClick={() => navigate('/dashboard/products')} />
          <Button label="Save Product" className="p-button-success" onClick={handleSave} />
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
        {activeTab === 'basic' && (
          <div className="form-grid">
            <div className="form-section">
              <h3>Product Information</h3>
              <div className="form-group">
                <label>Title</label>
                <InputText  value={product.title} onChange={(e) => handleInputChange('title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <InputText value={product.slug} onChange={(e) => handleInputChange('slug', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <Dropdown value={product.category} options={categoriesData.map(c => ({ label: c, value: c }))}
                  onChange={(e) => handleInputChange('category', e.value)} placeholder="Select Category" />
              </div>
              <div className="form-group">
                <label>Subcategory</label>
                <InputText value={product.subcategory} onChange={(e) => handleInputChange('subcategory', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <Dropdown value={product.status} options={statusOptions}
                  onChange={(e) => handleInputChange('status', e.value)} placeholder="Select Status" />
              </div>
              <div className="form-group">
                <label>Featured</label>
                <InputSwitch checked={product.featured} onChange={(e) => handleInputChange('featured', e.value)} />
              </div>
            </div>

            <div className="form-section">
              <h3>Description</h3>
              <div className="form-group">
                <label>Short Description</label>
                <InputTextarea rows={3} value={product.description.short}
                  onChange={(e) => handleNestedChange('description', 'short', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Long Description</label>
                <InputTextarea rows={5} value={product.description.long}
                  onChange={(e) => handleNestedChange('description', 'long', e.target.value)} />
              </div>
            </div>

            <div className="form-section">
              <h3>Media</h3>
              <div className="form-group">
                <label>Thumbnail URL</label>
                <InputText value={product.thumbnail} onChange={(e) => handleInputChange('thumbnail', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Additional Images</label>
                <FileUpload mode="basic" name="images" accept="image/*" multiple />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="form-grid">
            <div className="form-section">
              <h3>Base Pricing</h3>
              <div className="form-group">
                <label>Currency</label>
                <Dropdown value={product.pricing.currency} options={currencyOptions}
                  onChange={(e) => handleNestedChange('pricing', 'currency', e.value)} />
              </div>
              <div className="form-group">
                <label>Base Price</label>
                <InputNumber value={product.pricing.basePrice}
                  onValueChange={(e) => handleNestedChange('pricing', 'basePrice', e.value ?? 0)} mode="currency"
                  currency={product.pricing.currency} />
              </div>
              <div className="form-group">
                <label>GST Rate (%)</label>
                <InputNumber
                  value={product.pricing.gst}
                  onValueChange={(e) => handleNestedChange('pricing', 'gst', e.value ?? 0)}
                  suffix="%"
                />
              </div>

            </div>

            <div className="form-section">
              <h3>Bulk Pricing Tiers</h3>
              {bulkPricing.map((tier, index) => (
                <div key={index} className="bulk-tier">
              <div className="form-group">
                <label>Min Quantity</label>
                <InputNumber
                  value={tier.minQty}
                  onValueChange={(e) => updateBulkPricing(index, 'minQty', e.value ?? 0)}
                />

              </div>

                  <div className="form-group">
                    <label>Price Per Unit</label>
                    <InputNumber value={tier.pricePerUnit}
                    onValueChange={(e) => updateBulkPricing(index, 'pricePerUnit', e.value ?? 0)}
                      mode="currency" currency={product.pricing.currency} />
                  </div>
                  <Button icon="pi pi-trash" className="p-button-danger p-button-rounded"
                    onClick={() => removeBulkPricingTier(index)} />
                </div>
              ))}
              <Button label="Add Tier" icon="pi pi-plus" className="p-button-outlined mt-2"
                onClick={addBulkPricingTier} />
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="form-grid">
            <div className="form-section">
              <h3>Inventory Details</h3>
              <div className="form-group">
                <label>SKU</label>
                <InputText value={product.inventory.sku}
                  onChange={(e) => handleNestedChange('inventory', 'sku', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Total Stock</label>
                <InputNumber value={product.inventory.totalStock}
                  onValueChange={(e) => handleNestedChange('inventory', 'totalStock', e.value ?? 0)} />
              </div>
              <div className="form-group">
                <label>Minimum Order Quantity</label>
                <InputNumber value={product.inventory.minOrderQty}
                  onValueChange={(e) => handleNestedChange('inventory', 'minOrderQty', e.value ?? 0)} />
              </div>
            </div>

            <div className="form-section">
              <h3>Supplier Information</h3>
              <div className="form-group">
                <label>Supplier Name</label>
                <InputText value={product.supplier.name}
                  onChange={(e) => handleNestedChange('supplier', 'name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <InputText value={product.supplier.companyName}
                  onChange={(e) => handleNestedChange('supplier', 'companyName', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <InputText value={product.supplier.location}
                  onChange={(e) => handleNestedChange('supplier', 'location', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="form-grid">
            <div className="form-section">
              <h3>Shipping Information</h3>
              <div className="form-group">
                <label>Weight (kg)</label>
                <InputNumber value={product.shipping.weight}
                  onValueChange={(e) => handleNestedChange('shipping', 'weight', e.value ?? 0)} suffix=" kg" />
              </div>
              <div className="form-group">
                <label>Dispatch Time (Days)</label>
                <InputNumber value={product.shipping.dispatchTimeDays}
                  onValueChange={(e) => handleNestedChange('shipping', 'dispatchTimeDays', e.value ?? 0)} />
              </div>
            </div>

            <div className="form-section">
              <h3>Package Dimensions (cm)</h3>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Length</label>
                  <InputNumber value={product.shipping.dimensions.length}
                    onValueChange={(e) => handleDimensionChange('length', e.value ?? 0)} />
                </div>
                <div className="form-group">
                  <label>Breadth</label>
                  <InputNumber value={product.shipping.dimensions.breadth}
                    onValueChange={(e) => handleDimensionChange('breadth', e.value ?? 0)} />
                </div>
                <div className="form-group">
                  <label>Height</label>
                  <InputNumber value={product.shipping.dimensions.height}
                    onValueChange={(e) => handleDimensionChange('height', e.value ?? 0)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="form-grid">
            <div className="form-section">
              <h3>Compliance Details</h3>
              <div className="form-group">
                <label>HSN Code</label>
                <InputText value={product.compliance.hsnCode}
                  onChange={(e) => handleNestedChange('compliance', 'hsnCode', e.target.value)} />
              </div>
              <div className="form-group">
                <label>GST Rate (%)</label>
                <InputNumber value={product.compliance.gstRate}
                  onValueChange={(e) => handleNestedChange('compliance', 'gstRate', e.value ?? 0)} suffix="%" />
              </div>
              <div className="form-group">
                <label>Country of Origin</label>
                <InputText value={product.compliance.countryOfOrigin}
                  onChange={(e) => handleNestedChange('compliance', 'countryOfOrigin', e.target.value)} />
              </div>
            </div>

            <div className="form-section">
              <h3>Return Policy</h3>
              <div className="form-group">
                <label>Returnable</label>
                <InputSwitch checked={product.returnPolicy.returnable}
                  onChange={(e) => handleNestedChange('returnPolicy', 'returnable', e.value)} />
              </div>
              <div className="form-group">
                <label>Return Days</label>
                <InputNumber value={product.returnPolicy.returnDays}
                  onValueChange={(e) => handleNestedChange('returnPolicy', 'returnDays', e.value ?? 0)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddProduct