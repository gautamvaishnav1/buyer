import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { addProducts } from "./productStore";
import "../../../styles/product_management.css";

const AddNewProduct = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("basic");

  const [product, setProduct] = useState({
    title: "",
    slug: "",
    category: "",
    subcategory: "",
    status: "active",
    featured: false,
    description: { short: "", long: "" },
    pricing: { basePrice: 0, currency: "INR", gst: 0 },
    inventory: { sku: "", totalStock: 0, minOrderQty: 1 },
    supplier: { name: "", companyName: "", location: "" },
    shipping: {
      weight: 0,
      dimensions: { length: 0, breadth: 0, height: 0 },
      dispatchTimeDays: 1,
    },
    compliance: { hsnCode: "", gstRate: 0, countryOfOrigin: "" },
    returnPolicy: { returnable: false, returnDays: 0 },
  });

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Draft", value: "draft" },
  ];

  const currencyOptions = [
    { label: "INR", value: "INR" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
  ];

  const handleInputChange = (field: string, value: unknown) => {
    setProduct({ ...product, [field]: value });
  };

  const handleNestedChange = (
    section: string,
    field: string,
    value: unknown,
  ) => {
    setProduct({
      ...product,
      [section]: {
        ...(product as Record<string, unknown>)[section],
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    dispatch(addProducts({ ...product, id: Date.now() }));
  };

  return (
    <div className="product-mgmt">
      <div className="edit-header pm-surface">
        <div>
          <h1>Add New Product</h1>
        </div>
        <div className="header-actions">
          <Button
            label="Cancel"
            className="p-button-outlined"
            onClick={() => {}}
          />
          <Button
            label="Save Product"
            className="p-button-success"
            onClick={handleSave}
          />
        </div>
      </div>

      <div className="edit-tabs">
        <Button
          label="Basic Info"
          className={activeTab === "basic" ? "tab-active" : ""}
          onClick={() => setActiveTab("basic")}
        />
        <Button
          label="Pricing"
          className={activeTab === "pricing" ? "tab-active" : ""}
          onClick={() => setActiveTab("pricing")}
        />
        <Button
          label="Inventory"
          className={activeTab === "inventory" ? "tab-active" : ""}
          onClick={() => setActiveTab("inventory")}
        />
      </div>

      <div className="edit-content">
        {activeTab === "basic" && (
          <div className="form-grid">
            <div className="form-section">
              <h3>Product Information</h3>
              <div className="form-group">
                <label>Title</label>
                <InputText
                  value={product.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <InputText
                  value={product.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <Dropdown
                  value={product.category}
                  options={[]}
                  onChange={(e) => handleInputChange("category", e.value)}
                  placeholder="Select Category"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <Dropdown
                  value={product.status}
                  options={statusOptions}
                  onChange={(e) => handleInputChange("status", e.value)}
                  placeholder="Select Status"
                />
              </div>
              <div className="form-group">
                <label>Featured</label>
                <InputSwitch
                  checked={product.featured}
                  onChange={(e) => handleInputChange("featured", e.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Description</h3>
              <div className="form-group">
                <label>Short Description</label>
                <InputTextarea
                  rows={3}
                  value={product.description.short}
                  onChange={(e) =>
                    handleNestedChange("description", "short", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Long Description</label>
                <InputTextarea
                  rows={5}
                  value={product.description.long}
                  onChange={(e) =>
                    handleNestedChange("description", "long", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="form-grid">
            <div className="form-section">
              <h3>Base Pricing</h3>
              <div className="form-group">
                <label>Currency</label>
                <Dropdown
                  value={product.pricing.currency}
                  options={currencyOptions}
                  onChange={(e) =>
                    handleNestedChange("pricing", "currency", e.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Base Price</label>
                <InputNumber
                  value={product.pricing.basePrice}
                  onValueChange={(e) =>
                    handleNestedChange("pricing", "basePrice", e.value)
                  }
                  mode="currency"
                  currency={product.pricing.currency}
                />
              </div>
              <div className="form-group">
                <label>GST Rate (%)</label>
                <InputNumber
                  value={product.pricing.gst}
                  onValueChange={(e) =>
                    handleNestedChange("pricing", "gst", e.value)
                  }
                  suffix="%"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="form-grid">
            <div className="form-section">
              <h3>Inventory Details</h3>
              <div className="form-group">
                <label>SKU</label>
                <InputText
                  value={product.inventory.sku}
                  onChange={(e) =>
                    handleNestedChange("inventory", "sku", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Total Stock</label>
                <InputNumber
                  value={product.inventory.totalStock}
                  onValueChange={(e) =>
                    handleNestedChange("inventory", "totalStock", e.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Minimum Order Quantity</label>
                <InputNumber
                  value={product.inventory.minOrderQty}
                  onValueChange={(e) =>
                    handleNestedChange("inventory", "minOrderQty", e.value)
                  }
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Supplier Information</h3>
              <div className="form-group">
                <label>Supplier Name</label>
                <InputText
                  value={product.supplier.name}
                  onChange={(e) =>
                    handleNestedChange("supplier", "name", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <InputText
                  value={product.supplier.companyName}
                  onChange={(e) =>
                    handleNestedChange(
                      "supplier",
                      "companyName",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewProduct;
