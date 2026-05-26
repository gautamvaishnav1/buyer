import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProducts } from "./productStore";
import "../../../styles/product_management.css";

const AddNewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selected Categories data from redux store to populate Category dropdown
  type CategoryState = { categories: Array<{ category: string } & Record<string, unknown>> };
  const categoriesData = useSelector((state: { category: CategoryState }) => state.category.categories) || [];
  const categoryValues = [...new Set(categoriesData.map((item) => item.category))];

  // Default options if categoriesData is empty
  const defaultCategories = ["Electronics", "Apparel & Shoes", "Machinery", "Home & Garden", "Packaging & Paper"];
  const displayCategories = categoryValues.length > 0 ? categoryValues : defaultCategories;

  const [productCode, setProductCode] = useState("");
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [isInsuranceRequired, setIsInsuranceRequired] = useState(false);

  const [product, setProduct] = useState({
    title: "",
    slug: "",
    category: "",
    subcategory: "",
    status: "active",
    featured: false,
    description: { short: "", long: "" },
    pricing: { basePrice: 0, currency: "INR", gst: 18 },
    inventory: { sku: "", totalStock: 100, minOrderQty: 5 },
    supplier: { name: "Aman Gupta", companyName: "Elite Global Trading", location: "Mumbai, India" },
    shipping: {
      weight: 0.5,
      dimensions: { length: 15, breadth: 10, height: 5 },
      dispatchTimeDays: 3,
    },
    compliance: { hsnCode: "", gstRate: 18, countryOfOrigin: "India" },
    returnPolicy: { returnable: true, returnDays: 10 },
  });

  // AI Chat State
  const [chatInput, setChatInput] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "system"; text: string; time: string }>>([
    {
      sender: "system",
      text: "Hello! I am your AI Sales Assistant. I can autogenerate SEO descriptions, calculate wholesale price curves, or autodetect product specifications. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

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
        ...(product as Record<string, unknown>)[section] as Record<string, unknown>,
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    if (!product.title) {
      addSystemChatMessage("⚠️ Please enter a product title before saving.");
      return;
    }
    dispatch(addProducts({ ...product, id: Date.now() }));
    navigate("/dashboard/products");
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
    setProductCode("ECCO-MX-109");
    setProduct({
      title: "ECCO MX M Men's Sneaker Black",
      slug: "ecco-mx-m-mens-sneaker-black",
      category: "Apparel & Shoes",
      subcategory: "Outdoor Footwear",
      status: "active",
      featured: true,
      description: {
        short: "• Motocross-inspired traction outsole\n• Breathable, premium neoprene-like textile structure\n• Quick-fit toggle lacing system",
        long: "Engineered for heavy-duty city walking and light trail exploration, the ECCO MX M Sneaker is built on a robust, motocross-influenced polyurethane outsole that delivers extreme traction. Made from synthetic leather and sporty neoprene, it offers flexibility and long-term durability. Recommended for B2B distributors seeking active lifestyle stock.",
      },
      pricing: { basePrice: 6499, currency: "INR", gst: 18 },
      inventory: { sku: "ECCO-MX-109-BLK", totalStock: 350, minOrderQty: 10 },
      supplier: { name: "Nordic Footwear Ltd.", companyName: "ECCO Wholesale India", location: "Gurugram, India" },
      shipping: {
        weight: 0.95,
        dimensions: { length: 32, breadth: 21, height: 12 },
        dispatchTimeDays: 2,
      },
      compliance: { hsnCode: "64039990", gstRate: 18, countryOfOrigin: "India" },
      returnPolicy: { returnable: true, returnDays: 15 },
    });
    setShowAiDrawer(false);
    addSystemChatMessage("✨ Perfect! I've scanned the catalog for standard matches and auto-completed the entire form with retail title, dynamic description bullets, correct HSN code, and base dimensions for ECCO MX M Sneakers!");
  };

  // Mock AI Autofill with Suggesion Pill
  const handleAiAutofill = () => {
    setProduct({
      title: "Logitech MX Master 3S Wireless Mouse",
      slug: "logitech-mx-master-3s-wireless-mouse",
      category: "Electronics",
      subcategory: "Input Devices",
      status: "active",
      featured: true,
      description: {
        short: "• 8,000 DPI track-anywhere optical sensor\n• Ultra-quiet MagSpeed electromagnetic scrolling\n• Multi-OS easy-switch flow control",
        long: "The Logitech MX Master 3S is an iconic flagship wireless mouse, remastered for elite productivity. It features silent click feedback, a high-precision 8K DPI sensor capable of tracking on glass, and high-speed electromagnetic scrolling. Perfect for B2B sourcing agents looking for office premium peripherals.",
      },
      pricing: { basePrice: 9495, currency: "INR", gst: 18 },
      inventory: { sku: "LOGI-MX3S-GRY", totalStock: 800, minOrderQty: 20 },
      supplier: { name: "Aman Gupta", companyName: "Elite Global Trading", location: "Mumbai, India" },
      shipping: {
        weight: 0.32,
        dimensions: { length: 18, breadth: 14, height: 8 },
        dispatchTimeDays: 2,
      },
      compliance: { hsnCode: "84716060", gstRate: 18, countryOfOrigin: "China" },
      returnPolicy: { returnable: true, returnDays: 7 },
    });
    addSystemChatMessage("✨ Form Autocompleted! I have pre-filled standard high-converting specs, logistics sizes, and pricing details for the Logitech MX Master 3S Wireless Mouse.");
  };

  // Mock AI Description Text Generation
  const handleAiGenerateText = (type: "short" | "long" | "seo") => {
    if (!product.title) {
      addSystemChatMessage("⚠️ Please provide a product title first so I can extract keywords and draft professional copy!");
      return;
    }
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
        setProduct((prev) => ({
          ...prev,
          slug: generatedSlug,
          description: {
            short: `• Optimized search keyword listing for B2B supply: ${prev.title}\n` + prev.description.short,
            long: `Sought-after wholesale inventory catalog item. Ideal for volume importers: ` + prev.description.long,
          },
        }));
        addSystemChatMessage(`✨ SEO Complete! Drafted optimized URL slug: "/${generatedSlug}" and integrated rich indexing keywords into your description blocks.`);
      }
    }, 700);
  };

  // Mock AI Pricing Model Analysis
  const handleAiPricingModel = () => {
    if (!product.title) {
      addSystemChatMessage("⚠️ Provide a product title and initial base price first so I can analyze competitive wholesale market indices.");
      return;
    }
    const currentPrice = product.pricing.basePrice || 1000;
    const bullet1 = Math.round(currentPrice * 0.95);
    const bullet2 = Math.round(currentPrice * 0.88);
    addSystemChatMessage(
      `📊 Wholesale pricing recommendation for "${product.title}":\n` +
      `• Base Unit Cost: ${product.pricing.currency === "INR" ? "₹" : "$"} ${currentPrice}\n` +
      `• Tier 1 Discount (10-50 units): ${product.pricing.currency === "INR" ? "₹" : "$"} ${bullet1}/unit (5% off)\n` +
      `• Tier 2 Discount (50+ units): ${product.pricing.currency === "INR" ? "₹" : "$"} ${bullet2}/unit (12% off)\n` +
      `• Recommended HSN Category compliance GST rate: 18%`
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
      if (lower.includes("fill") || lower.includes("auto") || lower.includes("complete")) {
        handleAiAutofill();
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("discount")) {
        handleAiPricingModel();
      } else if (lower.includes("desc") || lower.includes("write") || lower.includes("seo") || lower.includes("copy")) {
        handleAiGenerateText("seo");
      } else if (lower.includes("ecco")) {
        handleAiCompleteForm();
      } else {
        addSystemChatMessage("I can recognize form actions! Type 'autofill' to load test electronics, 'ecco' to load catalog matching sneakers, or 'pricing' to calculate tier suggestions.");
      }
    }, 600);
  };

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
            <h1>Add New Product</h1>
            <p className="text-muted">Fill in listing details or consult AI Assist to automate configuration</p>
          </div>
        </div>
        <div className="header-actions">
          <Button
            label="Discard"
            className="p-button-outlined"
            onClick={() => navigate("/dashboard/products")}
          />
          <Button
            label="Save Product"
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
                    placeholder="Enter Code or type 'ECCO' for AI catalog matches"
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
                <label>Product Catalog ID (Auto-Generated)</label>
                <div className="p-inputgroup">
                  <InputText value="PRD-2026-904" disabled style={{ background: "#f4f4f6", opacity: 0.8 }} />
                  <Button icon="pi pi-copy" className="p-button-outlined p-button-plain" title="Copy Catalog Reference ID" />
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

          {/* Card 4: Base Pricing & Sku Inventory */}
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
                    Supplier registers complete transit loss warranty. Essential for high-value orders exceeding ₹50,000.
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
          </div>

        </div>

        {/* Right Column: AI Assist Panel Sidebar */}
        {/* <div className="ai-assist-sidebar">
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
              ✨ Auto-fill Logitech Mouse
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
              placeholder="Query assistant (e.g. type 'autofill' or 'ecco')..."
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
        </div> */}

      </div>
    </div>
  );
};

export default AddNewProduct;
