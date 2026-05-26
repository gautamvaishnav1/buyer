import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import dummyProducts from "../../../core/storage/DummyProduct_10.json";
import { updateProduct } from "./productStore";
import "../../../styles/product_management.css";

type Product = {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  description: {
    short: string;
    long: string;
  };
  images: string[];
  thumbnail: string;
  pricing: {
    basePrice: number;
    currency: string;
    gst: number;
  };
  bulkPricing: Array<{ minQty: number; pricePerUnit: number }>;
  inventory: {
    sku: string;
    totalStock: number;
    minOrderQty: number;
  };
  supplier: {
    name: string;
    companyName: string;
    location: string;
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      breadth: number;
      height: number;
    };
    dispatchTimeDays: number;
  };
  returnPolicy: {
    returnable: boolean;
    returnDays: number;
  };
  compliance: {
    hsnCode: string;
    gstRate: number;
    countryOfOrigin: string;
  };
  createdAt: string;
  updatedAt: string;
  subcategory: string;
};

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [bulkPricing, setBulkPricing] = useState<Array<{ minQty: number; pricePerUnit: number }>>([]);
  const [productCode, setProductCode] = useState("");
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [isInsuranceRequired, setIsInsuranceRequired] = useState(false);

  // Redux Categories
  type CategoryState = { categories: Array<{ category: string } & Record<string, unknown>> };
  const categoriesData = useSelector((state: { category: CategoryState }) => state.category.categories) || [];
  const categoryValues = [...new Set(categoriesData.map((item) => item.category))];

  // Default Categories if redux is empty
  const defaultCategories = ["Electronics", "Apparel & Shoes", "Machinery", "Home & Garden", "Packaging & Paper"];
  const displayCategories = categoryValues.length > 0 ? categoryValues : defaultCategories;

  // AI Chat State
  const [chatInput, setChatInput] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "system"; text: string; time: string }>>([
    {
      sender: "system",
      text: "Welcome back! I have successfully loaded your B2B product records. I am ready to help you optimize pricing, generate descriptive copy, or autocomplete fields. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    const foundProduct = dummyProducts.find((p: Product) => p.id === parseInt(id || "0"));
    if (!foundProduct) return;
    setProduct(foundProduct as Product);
    setBulkPricing(foundProduct.bulkPricing || []);
    setProductCode(foundProduct.inventory.sku || "");
    // Default mock insurance based on weight/price
    setIsInsuranceRequired(foundProduct.pricing.basePrice > 5000);
  }, [id]);

  const handleInputChange = <T,>(field: keyof Product, value: T) => {
    if (!product) return;
    setProduct({ ...product, [field]: value } as Product);
  };

  const handleNestedChange = <S extends keyof Product, F extends keyof Product[S]>(
    section: S,
    field: F,
    value: Product[S][F]
  ) => {
    if (!product) return;
    setProduct({
      ...product,
      [section]: {
        ...(product[section] as Product[S]),
        [field]: value,
      },
    } as Product);
  };

  const handleDimensionChange = (field: keyof Product["shipping"]["dimensions"], value: number) => {
    if (!product) return;
    setProduct({
      ...product,
      shipping: {
        ...product.shipping,
        dimensions: {
          ...product.shipping.dimensions,
          [field]: value,
        },
      },
    });
  };

  const addBulkPricingTier = () => {
    setBulkPricing([...bulkPricing, { minQty: 10, pricePerUnit: 0 }]);
    addSystemChatMessage("✨ New bulk price tier slot added. Configure minimum units and specific discounted prices.");
  };

  const updateBulkPricing = (index: number, field: string, value: number) => {
    const updated = [...bulkPricing];
    updated[index] = { ...updated[index], [field]: value };
    setBulkPricing(updated);
  };

  const removeBulkPricingTier = (index: number) => {
    setBulkPricing(bulkPricing.filter((_, i) => i !== index));
    addSystemChatMessage("🗑️ Wholesale pricing tier removed.");
  };

  const handleSave = () => {
    if (product) {
      dispatch(updateProduct({ ...product, bulkPricing }));
      navigate("/dashboard/products");
    }
  };

  // Helper to add chat messages
  const addSystemChatMessage = (text: string) => {
    setAiMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setTimeout(() => {
      const el = document.getElementById("ai-chat-log-panel");
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  };

  // Mock AI Complete Form from Catalog Code
  const handleAiCompleteForm = () => {
    if (!product) return;
    setProductCode("ECCO-MX-109");
    setProduct({
      ...product,
      title: "ECCO MX M Men's Sneaker Black (Catalog Sync)",
      slug: "ecco-mx-m-mens-sneaker-black",
      category: "Apparel & Shoes",
      subcategory: "Outdoor Footwear",
      description: {
        short: "• Motocross-inspired traction outsole\n• Breathable, premium neoprene-like textile structure\n• Quick-fit toggle lacing system",
        long: "Engineered for heavy-duty city walking and light trail exploration, the ECCO MX M Sneaker is built on a robust, motocross-influenced polyurethane outsole that delivers extreme traction. Recommended for volume supply lines.",
      },
      pricing: { ...product.pricing, basePrice: 6499, currency: "INR" },
      inventory: { ...product.inventory, sku: "ECCO-MX-109-BLK", totalStock: 350, minOrderQty: 10 },
      shipping: {
        weight: 0.95,
        dimensions: { length: 32, breadth: 21, height: 12 },
        dispatchTimeDays: 2,
      },
      compliance: { hsnCode: "64039990", gstRate: 18, countryOfOrigin: "India" },
    });
    setBulkPricing([
      { minQty: 10, pricePerUnit: 6000 },
      { minQty: 50, pricePerUnit: 5500 },
    ]);
    setShowAiDrawer(false);
    addSystemChatMessage("✨ Scan completed! Auto-matched this product's record to Catalog ECCO-MX-109 and loaded optimized specs, descriptions, packaging sizes, HSN code, and competitive bulk pricing curves!");
  };

  // Mock AI Autofill (Logitech Mouse)
  const handleAiAutofill = () => {
    if (!product) return;
    setProduct({
      ...product,
      title: "Logitech MX Master 3S Wireless Mouse (AI Optimised)",
      slug: "logitech-mx-master-3s-wireless-mouse",
      category: "Electronics",
      subcategory: "Input Devices",
      description: {
        short: "• 8,000 DPI track-anywhere optical sensor\n• Ultra-quiet MagSpeed electromagnetic scrolling\n• Multi-OS easy-switch flow control",
        long: "Remastered flagship wireless mouse. Features silent click feedback, a high-precision 8K DPI sensor capable of tracking on glass, and high-speed electromagnetic scrolling. Perfect for professional office inventory.",
      },
      pricing: { ...product.pricing, basePrice: 9495, currency: "INR" },
      inventory: { ...product.inventory, sku: "LOGI-MX3S-GRY", totalStock: 800, minOrderQty: 20 },
      shipping: {
        weight: 0.32,
        dimensions: { length: 18, breadth: 14, height: 8 },
        dispatchTimeDays: 2,
      },
      compliance: { hsnCode: "84716060", gstRate: 18, countryOfOrigin: "China" },
    });
    setBulkPricing([
      { minQty: 20, pricePerUnit: 9000 },
      { minQty: 100, pricePerUnit: 8400 },
    ]);
    addSystemChatMessage("✨ AI Optimisation Complete! Product fields and bulk pricing tables have been updated with verified industrial standard metrics.");
  };

  // Mock AI Description Text Generation
  const handleAiGenerateText = (type: "short" | "long" | "seo") => {
    if (!product) return;
    addSystemChatMessage(`🤖 Generating professional e-commerce ${type === "seo" ? "SEO keyword optimizations" : type === "short" ? "B2B bullet points" : "long descriptions"} for "${product.title}"...`);

    setTimeout(() => {
      if (type === "short") {
        const text = `• Premium commercial grade build quality\n• High performance reliability designed for enterprise B2B use\n• Full compliance with safety standards and certified packaging`;
        handleNestedChange("description", "short", text);
        addSystemChatMessage("✨ Short description updated with clean, impact-oriented bullet points!");
      } else if (type === "long") {
        const text = `High-durability commercial product engineered specifically for volume enterprise distribution. Features reinforced exterior casing, lightweight optimized internal architecture, and standard modular connections. Complete package includes localized documentation, retail warranty cards, and shock-resistant transport packaging.`;
        handleNestedChange("description", "long", text);
        addSystemChatMessage("✨ Full length B2B technical specification copy has been generated and inserted!");
      } else {
        const generatedSlug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        setProduct((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            slug: generatedSlug,
            description: {
              short: `• Optimized search keyword listing for B2B supply: ${prev.title}\n` + prev.description.short,
              long: `Sought-after wholesale inventory catalog item. Ideal for volume importers: ` + prev.description.long,
            },
          };
        });
        addSystemChatMessage(`✨ SEO Complete! Drafted optimized URL slug: "/${generatedSlug}" and integrated rich indexing keywords into your description blocks.`);
      }
    }, 700);
  };

  // Mock AI Pricing Model Analysis
  const handleAiPricingModel = () => {
    if (!product) return;
    const currentPrice = product.pricing.basePrice || 1000;
    const bullet1 = Math.round(currentPrice * 0.95);
    const bullet2 = Math.round(currentPrice * 0.88);
    setBulkPricing([
      { minQty: product.inventory.minOrderQty || 10, pricePerUnit: bullet1 },
      { minQty: (product.inventory.minOrderQty || 10) * 5, pricePerUnit: bullet2 },
    ]);
    addSystemChatMessage(
      `📊 Wholesale pricing recommendation calculated:\n` +
      `• Base Unit Cost: ${product.pricing.currency === "INR" ? "₹" : "$"} ${currentPrice}\n` +
      `• Tier 1 (MOQ: ${product.inventory.minOrderQty}): ${product.pricing.currency === "INR" ? "₹" : "$"} ${bullet1}/unit (5% off)\n` +
      `• Tier 2 (${(product.inventory.minOrderQty || 10) * 5}+ units): ${product.pricing.currency === "INR" ? "₹" : "$"} ${bullet2}/unit (12% off)\n` +
      `• Recommended pricing curves have been auto-injected into your Bulk Pricing table below!`
    );
  };

  // Prompt Chat Submissions
  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput("");
    setAiMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      if (lower.includes("fill") || lower.includes("auto") || lower.includes("complete") || lower.includes("optimise")) {
        handleAiAutofill();
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("discount") || lower.includes("bulk")) {
        handleAiPricingModel();
      } else if (lower.includes("desc") || lower.includes("write") || lower.includes("seo") || lower.includes("copy")) {
        handleAiGenerateText("seo");
      } else if (lower.includes("ecco")) {
        handleAiCompleteForm();
      } else {
        addSystemChatMessage("I can recognize your commands! Type 'optimise' to apply Logitech specs, 'ecco' to load catalog matching sneakers, or 'pricing' to suggest wholesale pricing tier discounts.");
      }
    }, 600);
  };

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Draft", value: "draft" },
  ];

  const currencyOptions = [
    { label: "INR (₹)", value: "INR" },
    { label: "USD ($)", value: "USD" },
    { label: "EUR (€)", value: "EUR" },
  ];

  if (!product) return <div className="p-6">Loading product details...</div>;

  return (
    <div className="product-mgmt">
      {/* Header Bar */}
      <div className="edit-header pm-surface">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
          <Button
            icon="pi pi-arrow-left"
            className="p-button-text p-button-plain p-button-rounded"
            onClick={() => navigate("/dashboard/products")}
            aria-label="Back to Products"
          />
          <div>
            <h1>Edit Product Listing</h1>
            <p className="text-muted">Manage B2B inventory specifications and custom wholesale discount tiers</p>
          </div>
        </div>
        <div className="header-actions">
          <Button
            label="Cancel"
            className="p-button-outlined"
            onClick={() => navigate("/dashboard/products")}
          />
          <Button
            label="Save Changes"
            className="p-button-success"
            onClick={handleSave}
          />
        </div>
      </div>

      <div className="product-mgmt-container">
        {/* Left Column: Input Form Cards */}
        <div className="product-form-column">
          
          {/* Card 1: Identification & Auto-Match */}
          <div className="pm-form-card">
            <h2>
              <i className="pi pi-id-card" style={{ marginRight: "var(--sp-2)", color: "var(--text-success)" }}></i>
              Product Identification
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Code / SKU Suffix (e.g. Type 'ECCO')</label>
                <div className="input-with-action">
                  <InputText
                    value={productCode}
                    onChange={(e) => {
                      setProductCode(e.target.value);
                      if (e.target.value.toLowerCase().includes("ecco")) {
                        setShowAiDrawer(true);
                      }
                    }}
                    placeholder="Enter SKU Code or type 'ECCO'"
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowAiDrawer(!showAiDrawer)}
                    title="Find Catalog Match"
                  >
                    ✨
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Product Catalog ID (Unique Reference)</label>
                <div className="p-inputgroup">
                  <InputText value={`PRD-${product.id}`} disabled style={{ background: "#f4f4f6", opacity: 0.8 }} />
                  <Button icon="pi pi-copy" className="p-button-outlined p-button-plain" title="Copy ID" />
                </div>
              </div>
            </div>

            {/* Catalog AI Matches Drawer */}
            {showAiDrawer && (
              <div className="ai-autocomplete-drawer">
                <div className="ai-drawer-header">
                  <span>✨ AI Catalog Scanner Matches</span>
                  <div>Select catalog listing to auto-complete form fields</div>
                </div>
                <table className="ai-match-table">
                  <thead>
                    <tr>
                      <th>Catalog SKU</th>
                      <th>Product Title</th>
                      <th>Market Value</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>ECCO-MX-109</code></td>
                      <td>ECCO MX M Men's Sneaker Black</td>
                      <td>₹6,499.00</td>
                      <td style={{ textAlign: "right" }}>
                        <Button
                          label="Complete the Form"
                          className="p-button-success p-button-sm"
                          style={{ padding: "4px 10px", fontSize: "10px" }}
                          onClick={handleAiCompleteForm}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="ai-drawer-actions">
                  <Button label="Close Scanner" className="p-button-text p-button-plain p-button-sm" onClick={() => setShowAiDrawer(false)} />
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Basic Product Listing Information */}
          <div className="pm-form-card">
            <h2>
              <i className="pi pi-info-circle" style={{ marginRight: "var(--sp-2)", color: "var(--text-success)" }}></i>
              Basic Listing Details
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Listing Title</label>
                <InputText
                  value={product.title}
                  onChange={(e) => {
                    handleInputChange("title", e.target.value);
                    handleInputChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  placeholder="e.g. Logitech MX Master 3S Mouse"
                />
              </div>
              <div className="form-group">
                <label>SEO URL Slug / Slug Path</label>
                <InputText
                  value={product.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="e.g. logitech-mx-master-3s-mouse"
                />
              </div>
            </div>

            <div className="form-grid mt-2">
              <div className="form-group">
                <label>Main Category</label>
                <Dropdown
                  value={product.category}
                  options={displayCategories.map((c) => ({ label: c, value: c }))}
                  onChange={(e) => handleInputChange("category", e.value)}
                  placeholder="Select Category"
                />
              </div>
              <div className="form-group">
                <label>Subcategory</label>
                <InputText
                  value={product.subcategory}
                  onChange={(e) => handleInputChange("subcategory", e.target.value)}
                  placeholder="e.g. Computer Accessories"
                />
              </div>
            </div>

            <div className="form-grid mt-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="form-group">
                <label>Catalog Visibility Status</label>
                <Dropdown
                  value={product.status}
                  options={statusOptions}
                  onChange={(e) => handleInputChange("status", e.value)}
                />
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "8px" }}>Featured Supplier Spotlight</label>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                  <InputSwitch
                    checked={product.featured}
                    onChange={(e) => handleInputChange("featured", e.value)}
                  />
                  <span className="text-muted" style={{ fontSize: "11px" }}>Show on corporate business profile</span>
                </div>
              </div>
            </div>

            {/* Media/Thumbnail Url */}
            <div className="form-group mt-2">
              <label>Thumbnail URL</label>
              <InputText value={product.thumbnail} onChange={(e) => handleInputChange("thumbnail", e.target.value)} />
            </div>
            <div className="form-group mt-2">
              <label>Additional Images</label>
              <FileUpload mode="basic" name="images" accept="image/*" multiple />
            </div>
          </div>

          {/* Card 3: B2B Descriptions & AI Generator */}
          <div className="pm-form-card">
            <h2>
              <i className="pi pi-file-edit" style={{ marginRight: "var(--sp-2)", color: "var(--text-success)" }}></i>
              Descriptions & Specifications
            </h2>
            {/* <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ margin: 0 }}>Short Description (B2B Highlights)</label>
                <Button
                  label="✨ Generate bullets with AI"
                  className="p-button-text p-button-sm p-button-success"
                  style={{ fontSize: "10px", padding: 0 }}
                  onClick={() => handleAiGenerateText("short")}
                />
              </div>
              <InputTextarea
                rows={3}
                value={product.description.short}
                onChange={(e) => handleNestedChange("description", "short", e.target.value)}
                placeholder="Bullet points of key selling features, raw components, or compliance grades..."
              />
            </div> */}
            <div className="form-group mt-2">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ margin: 0 }}>Detailed B2B Technical Description</label>
                <Button
                 
                  className="p-button-text p-button-sm p-button-success"
                  style={{ fontSize: "10px", padding: 0 }}
                  onClick={() => handleAiGenerateText("long")}
                />
              </div>
              <InputTextarea
                rows={6}
                value={product.description.long}
                onChange={(e) => handleNestedChange("description", "long", e.target.value)}
                placeholder="Deep product manual specs, compliance marks, packaging details, and warranty terms..."
              />
            </div>
          </div>

          {/* Card 4: Base Pricing, Sku Inventory & Bulk Tiers */}
          <div className="pm-form-card">
            <h2>
              <i className="pi pi-wallet" style={{ marginRight: "var(--sp-2)", color: "var(--text-success)" }}></i>
              Pricing & Sku Management
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Billing Currency</label>
                <Dropdown
                  value={product.pricing.currency}
                  options={currencyOptions}
                  onChange={(e) => handleNestedChange("pricing", "currency", e.value)}
                />
              </div>
              <div className="form-group">
                <label>Wholesale Base Price (Per Unit)</label>
                <InputNumber
                  value={product.pricing.basePrice}
                  onValueChange={(e) => handleNestedChange("pricing", "basePrice", e.value)}
                  mode="currency"
                  currency={product.pricing.currency}
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="form-group">
                <label>Manufacturer SKU Suffix</label>
                <InputText
                  value={product.inventory.sku}
                  onChange={(e) => handleNestedChange("inventory", "sku", e.target.value)}
                  placeholder="e.g. MFG-SKU-904"
                />
              </div>
            </div>

            <div className="form-grid mt-2">
              <div className="form-group">
                <label>Available Stock Balance</label>
                <InputNumber
                  value={product.inventory.totalStock}
                  onValueChange={(e) => handleNestedChange("inventory", "totalStock", e.value)}
                />
              </div>
              <div className="form-group">
                <label>Minimum Purchase MOQ (Units)</label>
                <InputNumber
                  value={product.inventory.minOrderQty}
                  onValueChange={(e) => handleNestedChange("inventory", "minOrderQty", e.value)}
                />
              </div>
            </div>

            {/* Bulk Pricing Tiers */}
            <div className="form-group mt-4">
              <label style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-7)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Wholesale Quantity Discount Tiers</span>
                <Button
                
                  className="p-button-text p-button-sm p-button-success"
                  style={{ fontSize: "10px", padding: 0 }}
                  onClick={handleAiPricingModel}
                />
              </label>
              <div style={{ marginTop: "var(--sp-2)" }}>
                {bulkPricing.map((tier, index) => (
                  <div key={index} className="bulk-tier">
                    <div className="form-group">
                      <label>Min Quantity</label>
                      <InputNumber
                        value={tier.minQty}
                        onValueChange={(e) => updateBulkPricing(index, "minQty", e.value || 0)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Price Per Unit</label>
                      <InputNumber
                        value={tier.pricePerUnit}
                        onValueChange={(e) => updateBulkPricing(index, "pricePerUnit", e.value || 0)}
                        mode="currency"
                        currency={product.pricing.currency}
                      />
                    </div>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger p-button-rounded p-button-outlined"
                      style={{ height: "34px", width: "34px" }}
                      onClick={() => removeBulkPricingTier(index)}
                      title="Remove Discount Tier"
                    />
                  </div>
                ))}
                <Button
                  label="Add Price Tier"
                  icon="pi pi-plus"
                  className="p-button-outlined p-button-sm mt-2"
                  onClick={addBulkPricingTier}
                />
              </div>
            </div>
          </div>

          {/* Card 5: Logistics & Regulatory Compliance */}
          <div className="pm-form-card">
            <h2>
              <i className="pi pi-truck" style={{ marginRight: "var(--sp-2)", color: "var(--text-success)" }}></i>
              Logistics & Regulatory Compliance
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Unit Gross Weight (kg)</label>
                <InputNumber
                  value={product.shipping.weight}
                  onValueChange={(e) => handleNestedChange("shipping", "weight", e.value)}
                  suffix=" kg"
                  minFractionDigits={2}
                />
              </div>
              <div className="form-group">
                <label>Average Handling Dispatch Days</label>
                <InputNumber
                  value={product.shipping.dispatchTimeDays}
                  onValueChange={(e) => handleNestedChange("shipping", "dispatchTimeDays", e.value)}
                  suffix=" days"
                />
              </div>
            </div>

            {/* Package dimensions */}
            <div className="form-group mt-2">
              <label>Package Dimensions (cm)</label>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Length</label>
                  <InputNumber
                    value={product.shipping.dimensions.length}
                    onValueChange={(e) => handleDimensionChange("length", e.value || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Breadth</label>
                  <InputNumber
                    value={product.shipping.dimensions.breadth}
                    onValueChange={(e) => handleDimensionChange("breadth", e.value || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Height</label>
                  <InputNumber
                    value={product.shipping.dimensions.height}
                    onValueChange={(e) => handleDimensionChange("height", e.value || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Custom Interactive B2B Shipping Insurance Radio Cards */}
            <div className="form-group mt-2">
              <label>Maritime / Overland Logistics Cargo Insurance</label>
              <div className="insurance-cards-grid">
                <div
                  className={`insurance-card ${!isInsuranceRequired ? "active" : ""}`}
                  onClick={() => setIsInsuranceRequired(false)}
                >
                  <div className="insurance-card-header">
                    Optional Coverage
                    <div className="radio-circle"><div className="radio-circle-inner"></div></div>
                  </div>
                  <div className="insurance-card-desc">
                    Standard shipment liability caps apply. Importer is solely responsible for extra cargo damage policies.
                  </div>
                </div>

                <div
                  className={`insurance-card ${isInsuranceRequired ? "active" : ""}`}
                  onClick={() => setIsInsuranceRequired(true)}
                >
                  <div className="insurance-card-header">
                    Mandatory Bulk Protection
                    <div className="radio-circle"><div className="radio-circle-inner"></div></div>
                  </div>
                  <div className="insurance-card-desc">
                    Supplier guarantees complete loss protection during sea/air transit. Essential for high-value orders exceeding ₹50,000.
                  </div>
                </div>
              </div>
            </div>

            <div className="form-grid mt-4">
              <div className="form-group">
                <label>Global HSN Code</label>
                <InputText
                  value={product.compliance.hsnCode}
                  onChange={(e) => handleNestedChange("compliance", "hsnCode", e.target.value)}
                  placeholder="e.g. 84716060"
                />
              </div>
              <div className="form-group">
                <label>Applied GST Rate (%)</label>
                <InputNumber
                  value={product.compliance.gstRate}
                  onValueChange={(e) => handleNestedChange("compliance", "gstRate", e.value)}
                  suffix="%"
                />
              </div>
              <div className="form-group">
                <label>Country of Origin</label>
                <InputText
                  value={product.compliance.countryOfOrigin}
                  onChange={(e) => handleNestedChange("compliance", "countryOfOrigin", e.target.value)}
                  placeholder="e.g. India"
                />
              </div>
            </div>

            {/* Return Policy */}
            <div className="form-grid mt-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "8px" }}>Returnable Product</label>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                  <InputSwitch
                    checked={product.returnPolicy.returnable}
                    onChange={(e) => handleNestedChange("returnPolicy", "returnable", e.value)}
                  />
                  <span className="text-muted" style={{ fontSize: "11px" }}>Accept return shipments</span>
                </div>
              </div>
              <div className="form-group">
                <label>Return Validity Days</label>
                <InputNumber
                  value={product.returnPolicy.returnDays}
                  onValueChange={(e) => handleNestedChange("returnPolicy", "returnDays", e.value)}
                  disabled={!product.returnPolicy.returnable}
                />
              </div>
            </div>
          </div>

        </div>


{/* 
          <div className="ai-assist-header">
            <i className="pi pi-sparkles sparkle-icon"></i>
            <span>AI Assist Sidebar</span>
          </div> */}
 
  {/* <div className="ai-orb-section">
    <div className="ai-orb-container">
      <div className="ai-orb-glow"></div>
      <div className="ai-orb">
        <i className="pi pi-sparkles"></i>
      </div>
    </div>
    <h4>Active AI Core Online</h4>
    <p>I can optimize listing details, generate copy or auto-complete fields.</p>
  </div> */}

  {/* <div className="prompt-pills-container">
    <div className="prompt-pill" onClick={handleAiAutofill}>
      ✨ Optimise Logitech Specs
    </div>
    <div className="prompt-pill" onClick={() => handleAiGenerateText("seo")}>
      📝 Smart SEO Optimization
    </div>
    <div className="prompt-pill" onClick={handleAiPricingModel}>
      💰 Wholesale Pricing Index
    </div>
  </div>

  <div className="ai-chat-log" id="ai-chat-log-panel">
    {aiMessages.map((msg, index) => (
      <div key={index} className={`ai-chat-message ${msg.sender}`}>
        <span style={{ fontWeight: "bold", fontSize: "8px", textTransform: "uppercase" }}>
          {msg.sender === "user" ? "Supplier Admin" : "AI Sales Copilot"}
        </span>
        <div>{msg.text}</div>
        <span className="ai-message-time">{msg.time}</span>
      </div>
    ))}
  </div>

  <div className="ai-chat-input-container">
    <textarea
      value={chatInput}
      onChange={(e) => setChatInput(e.target.value)}
      placeholder="Query assistant (e.g. type 'optimise' or 'ecco')..."
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleChatSubmit();
        }
      }}
    />
    <div className="ai-chat-controls">
      <div className="ai-chat-icons">
        <i className="pi pi-chart-bar" title="Wholesale Indices Analysis"></i>
        <i className="pi pi-database" title="Catalog Taxonomy Sourcing"></i>
      </div>
      <button className="ai-send-btn" onClick={handleChatSubmit} title="Submit Instruction">
        <i className="pi pi-send" style={{ fontSize: "10px" }}></i>
      </button>
    </div>
  </div>
</div>
          <div className="ai-assist-header">
            <i className="pi pi-sparkles sparkle-icon"></i>
            <span>AI Assist Sidebar</span>
          </div>

          <div className="ai-orb-section">
            <div className="ai-orb-container">
              <div className="ai-orb-glow"></div>
              <div className="ai-orb">
                <i className="pi pi-sparkles"></i>
              </div>
            </div>
            <h4>Active AI Core Online</h4>
            <p>I can optimize listing details, generate copy or auto-complete fields.</p>
          </div>

          <div className="prompt-pills-container">
            <div className="prompt-pill" onClick={handleAiAutofill}>
              ✨ Optimise Logitech Specs
            </div>
            <div className="prompt-pill" onClick={() => handleAiGenerateText("seo")}>
              📝 Smart SEO Optimization
            </div>
            <div className="prompt-pill" onClick={handleAiPricingModel}>
              💰 Wholesale Pricing Index
            </div>
          </div>

          <div className="ai-chat-log" id="ai-chat-log-panel">
            {aiMessages.map((msg, index) => (
              <div key={index} className={`ai-chat-message ${msg.sender}`}>
                <span style={{ fontWeight: "bold", fontSize: "8px", textTransform: "uppercase" }}>
                  {msg.sender === "user" ? "Supplier Admin" : "AI Sales Copilot"}
                </span>
                <div>{msg.text}</div>
                <span className="ai-message-time">{msg.time}</span>
              </div>
            ))}
          </div> */}

          {/* <div className="ai-chat-input-container">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Query assistant (e.g. type 'optimise' or 'ecco')..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit();
                }
              }}
            />
            <div className="ai-chat-controls">
              <div className="ai-chat-icons">
                <i className="pi pi-chart-bar" title="Wholesale Indices Analysis"></i>
                <i className="pi pi-database" title="Catalog Taxonomy Sourcing"></i>
              </div>
              <button className="ai-send-btn" onClick={handleChatSubmit} title="Submit Instruction">
                <i className="pi pi-send" style={{ fontSize: "10px" }}></i>
              </button>
            </div>
          </div> */}
        </div>

    </div>
  );
};

export default ProductEditPage;