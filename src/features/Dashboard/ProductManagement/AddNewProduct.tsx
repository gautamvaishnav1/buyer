import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProducts } from "./productStore";
import "../../../styles/add_new_product.css";

// ── Types ───────────────────────────────────────────────────────────────────
type BulkTier = { minQty: number; pricePerUnit: number };

type ProductForm = {
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  status: string;
  featured: boolean;
  description: { short: string; long: string };
  pricing: { basePrice: number; currency: string; gst: number };
  bulkPricing: BulkTier[];
  inventory: { sku: string; totalStock: number; minOrderQty: number };
  supplier: { name: string; companyName: string; location: string };
  shipping: {
    weight: number;
    dimensions: { length: number; breadth: number; height: number };
    dispatchTimeDays: number;
  };
  compliance: { hsnCode: string; gstRate: number; countryOfOrigin: string };
  returnPolicy: { returnable: boolean; returnDays: number };
  thumbnail: string;
};

// ── Sub-components ──────────────────────────────────────────────────────────
const SectionHeader = ({ step, title, icon }: { step: number; title: string; icon: string }) => (
  <div className="pep-section-header">
    <span className="pep-step-badge">{step}</span>
    <i className={`${icon} pep-section-icon`} />
    <span className="pep-section-title">{title}</span>
  </div>
);

const Field = ({
  label, required, hint, error, children,
}: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) => (
  <div className="pep-field">
    <label className="pep-label">
      {label}{required && <span className="pep-required"> *</span>}
    </label>
    {children}
    {error && <span className="pep-error"><i className="pi pi-exclamation-circle" />{error}</span>}
    {hint && !error && <span className="pep-hint">{hint}</span>}
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────
const AddNewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  type CategoryState = { categories: Array<{ category: string } & Record<string, unknown>> };
  const categoriesData = useSelector((s: { category: CategoryState }) => s.category.categories) || [];
  const categoryValues = [...new Set(categoriesData.map((i) => i.category))];
  const defaultCategories = [
    "Electronics", "Apparel & Shoes", "Machinery", "Home & Garden",
    "Packaging & Paper", "Safety Equipment", "Office Supplies", "AV Equipment",
  ];
  const categories = categoryValues.length > 0 ? categoryValues : defaultCategories;

  const empty: ProductForm = {
    title: "", slug: "", category: "", subcategory: "",
    status: "active", featured: false,
    description: { short: "", long: "" },
    pricing: { basePrice: 0, currency: "INR", gst: 18 },
    bulkPricing: [],
    inventory: { sku: "", totalStock: 0, minOrderQty: 1 },
    supplier: { name: "", companyName: "", location: "" },
    shipping: { weight: 0, dimensions: { length: 0, breadth: 0, height: 0 }, dispatchTimeDays: 3 },
    compliance: { hsnCode: "", gstRate: 18, countryOfOrigin: "India" },
    returnPolicy: { returnable: true, returnDays: 7 },
    thumbnail: "",
  };

  const [p, setP] = useState<ProductForm>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imgPreview, setImgPreview] = useState<string>("");

  // ── Setters ────────────────────────────────────────────────────────────────
  const set = (k: keyof ProductForm, v: unknown) => setP((prev) => ({ ...prev, [k]: v }));

  const setNested = (sec: string, k: string, v: unknown) =>
    setP((prev) => ({
      ...prev,
      [sec]: { ...(prev as Record<string, unknown>)[sec] as Record<string, unknown>, [k]: v },
    }));

  const setDim = (dim: "length" | "breadth" | "height", v: number) =>
    setP((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, dimensions: { ...prev.shipping.dimensions, [dim]: v } },
    }));

  const addTier = () => setP((prev) => ({ ...prev, bulkPricing: [...prev.bulkPricing, { minQty: 10, pricePerUnit: 0 }] }));

  const updateTier = (i: number, k: keyof BulkTier, v: number) =>
    setP((prev) => {
      const tiers = [...prev.bulkPricing];
      tiers[i] = { ...tiers[i], [k]: v };
      return { ...prev, bulkPricing: tiers };
    });

  const removeTier = (i: number) =>
    setP((prev) => ({ ...prev, bulkPricing: prev.bulkPricing.filter((_, idx) => idx !== i) }));

  // ── Validation & save ──────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!p.title.trim())           e.title    = "Product title is required.";
    if (!p.category)               e.category = "Please select a category.";
    if (!p.inventory.sku.trim())   e.sku      = "SKU / product code is required.";
    if (p.pricing.basePrice <= 0)  e.price    = "Unit price must be greater than 0.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    dispatch(addProducts({ ...p, id: Date.now() }));
    navigate("/dashboard/products");
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const sym = p.pricing.currency === "INR" ? "₹" : p.pricing.currency === "USD" ? "$" : "€";

  const statusLabel: Record<string, string> = {
    active: "Active", inactive: "Inactive", draft: "Draft",
  };

  const discount = (price: number) =>
    p.pricing.basePrice > 0 ? Math.round((1 - price / p.pricing.basePrice) * 100) : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgPreview(url);
    set("thumbnail", url);
  };

  return (
    <div className="pep-page">

      {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
      <div className="pep-topbar">
        <div className="pep-topbar-left">
          <button className="pep-back-btn" onClick={() => navigate("/dashboard/products")} aria-label="Back">
            <i className="pi pi-arrow-left" />
          </button>
          <div>
            <nav className="pep-breadcrumb">
              <span>Products</span>
              <i className="pi pi-angle-right" />
              <span className="pep-breadcrumb-active">Add New Product</span>
            </nav>
            <h1 className="pep-page-title">Add New Product</h1>
          </div>
        </div>
        <div className="pep-topbar-right">
          <button className="pep-btn-discard" onClick={() => navigate("/dashboard/products")}>
            Discard
          </button>
          <button className="pep-btn-publish" onClick={handleSave}>
            <i className="pi pi-check" /> Publish Product
          </button>
        </div>
      </div>

      {/* ══ MAIN GRID ════════════════════════════════════════════════ */}
      <div className="pep-main-grid">

        {/* ── LEFT: form sections ─────────────────────────────────── */}
        <div className="pep-form-col">

          {/* ── 1. Product Images ──────────────────────────────────── */}
          <section className="pep-card">
            <SectionHeader step={1} title="Product Images" icon="pi pi-images" />

            <div
              className="pep-upload-zone"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              {imgPreview ? (
                <img src={imgPreview} alt="preview" className="pep-upload-preview" />
              ) : (
                <>
                  <div className="pep-upload-icon-wrap">
                    <i className="pi pi-cloud-upload pep-upload-icon" />
                  </div>
                  <div className="pep-upload-text">
                    <p className="pep-upload-title">Click or drag &amp; drop to upload</p>
                    <p className="pep-upload-sub">JPG, PNG · 800×800 px recommended · Max 5 MB each</p>
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="pep-file-hidden"
              onChange={handleFileChange}
            />

            <Field label="Main Thumbnail URL" hint="Or paste a direct image URL instead of uploading.">
              <input
                className="pep-input"
                type="url"
                value={p.thumbnail}
                onChange={(e) => { set("thumbnail", e.target.value); setImgPreview(e.target.value); }}
                placeholder="https://example.com/product-image.jpg"
              />
            </Field>
          </section>

          {/* ── 2. Basic Information ───────────────────────────────── */}
          <section className="pep-card">
            <SectionHeader step={2} title="Basic Information" icon="pi pi-info-circle" />

            <Field label="Product Title" required error={errors.title}>
              <input
                className={`pep-input${errors.title ? " pep-input-error" : ""}`}
                type="text"
                value={p.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="e.g. Industrial Safety Gloves — Box of 100"
              />
            </Field>

            <div className="pep-row-2">
              <Field label="Category" required error={errors.category}>
                <select
                  className={`pep-select${errors.category ? " pep-input-error" : ""}`}
                  value={p.category}
                  onChange={(e) => {
                    set("category", e.target.value);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Subcategory">
                <input
                  className="pep-input"
                  type="text"
                  value={p.subcategory}
                  onChange={(e) => set("subcategory", e.target.value)}
                  placeholder="e.g. Safety Gloves"
                />
              </Field>
            </div>

            <div className="pep-row-2">
              <Field label="SKU / Product Code" required error={errors.sku}>
                <input
                  className={`pep-input${errors.sku ? " pep-input-error" : ""}`}
                  type="text"
                  value={p.inventory.sku}
                  onChange={(e) => {
                    setNested("inventory", "sku", e.target.value);
                    if (errors.sku) setErrors((prev) => ({ ...prev, sku: "" }));
                  }}
                  placeholder="e.g. SAFE-009-BLK"
                />
              </Field>
              <Field label="SEO URL Slug" hint="Auto-generated from title.">
                <input
                  className="pep-input"
                  type="text"
                  value={p.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="auto-generated"
                />
              </Field>
            </div>

            <Field
              label="Product Description"
              hint="Include material specs, certifications, and packaging info for better B2B conversion."
            >
              <textarea
                className="pep-textarea"
                rows={6}
                value={p.description.long}
                onChange={(e) => setNested("description", "long", e.target.value)}
                placeholder="Detailed B2B technical description — material specs, certifications, packaging details, warranty terms…"
              />
            </Field>
          </section>

          {/* ── 3. Pricing & Inventory ─────────────────────────────── */}
          <section className="pep-card">
            <SectionHeader step={3} title="Pricing & Inventory" icon="pi pi-wallet" />

            <div className="pep-row-3">
              <Field label="Currency" required>
                <select
                  className="pep-select"
                  value={p.pricing.currency}
                  onChange={(e) => setNested("pricing", "currency", e.target.value)}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </Field>
              <Field label="Unit Price" required error={errors.price}>
                <div className="pep-input-prefix-wrap">
                  <span className="pep-input-prefix">{sym}</span>
                  <input
                    className={`pep-input pep-input-prefixed${errors.price ? " pep-input-error" : ""}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={p.pricing.basePrice || ""}
                    onChange={(e) => {
                      setNested("pricing", "basePrice", parseFloat(e.target.value) || 0);
                      if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    placeholder="0.00"
                  />
                </div>
              </Field>
              <Field label="GST Rate (%)">
                <div className="pep-input-suffix-wrap">
                  <input
                    className="pep-input pep-input-suffixed"
                    type="number"
                    min="0"
                    max="100"
                    value={p.pricing.gst}
                    onChange={(e) => setNested("pricing", "gst", parseFloat(e.target.value) || 0)}
                  />
                  <span className="pep-input-suffix">%</span>
                </div>
              </Field>
            </div>

            <div className="pep-row-2">
              <Field label="Total Stock (units)">
                <input
                  className="pep-input"
                  type="number"
                  min="0"
                  value={p.inventory.totalStock || ""}
                  onChange={(e) => setNested("inventory", "totalStock", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </Field>
              <Field label="Min. Order Qty (MOQ)">
                <input
                  className="pep-input"
                  type="number"
                  min="1"
                  value={p.inventory.minOrderQty}
                  onChange={(e) => setNested("inventory", "minOrderQty", parseInt(e.target.value) || 1)}
                />
              </Field>
            </div>

            {/* Bulk pricing table */}
            <div className="pep-bulk-divider">
              <div className="pep-bulk-header">
                <div>
                  <span className="pep-bulk-title">Bulk / Wholesale Pricing Tiers</span>
                  <p className="pep-bulk-sub">Set quantity-based discounts for B2B buyers</p>
                </div>
                <button className="pep-btn-add-tier" type="button" onClick={addTier}>
                  <i className="pi pi-plus" /> Add Tier
                </button>
              </div>

              {p.bulkPricing.length === 0 ? (
                <div className="pep-bulk-empty">
                  <i className="pi pi-tag pep-bulk-empty-icon" />
                  <span className="pep-bulk-empty-text">No tiers yet — click "Add Tier" to set quantity discounts</span>
                </div>
              ) : (
                <table className="pep-bulk-table">
                  <thead>
                    <tr>
                      <th className="pep-bulk-th">Min. Qty (pcs)</th>
                      <th className="pep-bulk-th">Price / Unit</th>
                      <th className="pep-bulk-th">Discount</th>
                      <th className="pep-bulk-th pep-bulk-th-action"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.bulkPricing.map((tier, i) => {
                      const d = discount(tier.pricePerUnit);
                      return (
                        <tr key={i} className="pep-bulk-row">
                          <td className="pep-bulk-td-qty">
                            <input
                              className="pep-input pep-input-sm"
                              type="number"
                              min="1"
                              value={tier.minQty}
                              onChange={(e) => updateTier(i, "minQty", parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td className="pep-bulk-td-price">
                            <div className="pep-input-prefix-wrap">
                              <span className="pep-input-prefix">{sym}</span>
                              <input
                                className="pep-input pep-input-sm pep-input-prefixed"
                                type="number"
                                min="0"
                                step="0.01"
                                value={tier.pricePerUnit || ""}
                                onChange={(e) => updateTier(i, "pricePerUnit", parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </td>
                          <td className="pep-bulk-td">
                            {d > 0
                              ? <span className="pep-discount-badge">-{d}%</span>
                              : <span className="pep-no-discount">—</span>
                            }
                          </td>
                          <td className="pep-bulk-td-right">
                            <button className="pep-btn-remove-tier" type="button" onClick={() => removeTier(i)} title="Remove">
                              <i className="pi pi-trash" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* ── 4. Shipping & Logistics ────────────────────────────── */}
          <section className="pep-card">
            <SectionHeader step={4} title="Shipping & Logistics" icon="pi pi-truck" />

            <div className="pep-row-2">
              <Field label="Gross Weight (kg)">
                <div className="pep-input-suffix-wrap">
                  <input
                    className="pep-input pep-input-suffixed"
                    type="number"
                    min="0"
                    step="0.01"
                    value={p.shipping.weight || ""}
                    onChange={(e) => setNested("shipping", "weight", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                  <span className="pep-input-suffix">kg</span>
                </div>
              </Field>
              <Field label="Dispatch Time">
                <div className="pep-input-suffix-wrap">
                  <input
                    className="pep-input pep-input-suffixed"
                    type="number"
                    min="1"
                    value={p.shipping.dispatchTimeDays}
                    onChange={(e) => setNested("shipping", "dispatchTimeDays", parseInt(e.target.value) || 1)}
                  />
                  <span className="pep-input-suffix">days</span>
                </div>
              </Field>
            </div>

            <div className="pep-field">
              <label className="pep-label">Package Dimensions (cm)</label>
              <div className="pep-row-3">
                {(["length", "breadth", "height"] as const).map((dim) => (
                  <div key={dim} className="pep-dim-group">
                    <span className="pep-dim-label">{dim}</span>
                    <div className="pep-input-suffix-wrap">
                      <input
                        className="pep-input pep-input-suffixed"
                        type="number"
                        min="0"
                        value={p.shipping.dimensions[dim] || ""}
                        onChange={(e) => setDim(dim, parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                      <span className="pep-input-suffix">cm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cargo insurance */}
            <div className="pep-field">
              <label className="pep-label">Cargo Insurance</label>
              <div className="pep-row-2">
                {[
                  { val: false, label: "Optional Coverage", icon: "pi pi-shield", desc: "Standard liability caps apply. Importer is responsible for additional cargo damage policies." },
                  { val: true,  label: "Mandatory Bulk Protection", icon: "pi pi-verified", desc: "Full loss protection during sea/air transit. Recommended for orders exceeding ₹50,000." },
                ].map((opt) => {
                  const active = p.shipping.weight > 5000 ? opt.val === true : opt.val === false;
                  return (
                    <label key={String(opt.val)} className={`pep-insurance-card${active ? " active" : ""}`}>
                      <input
                        type="radio"
                        name="insurance"
                        className="pep-radio-hidden"
                        checked={active}
                        onChange={() => {}}
                      />
                      <div className="pep-insurance-card-top">
                        <div className="pep-insurance-label-wrap">
                          <i className={`${opt.icon} pep-insurance-icon${active ? " active" : ""}`} />
                          <span className="pep-insurance-label">{opt.label}</span>
                        </div>
                        <div className={`pep-radio-outer${active ? " active" : ""}`}>
                          {active && <div className="pep-radio-inner" />}
                        </div>
                      </div>
                      <p className="pep-insurance-desc">{opt.desc}</p>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── 5. Compliance & Return Policy ─────────────────────── */}
          <section className="pep-card">
            <SectionHeader step={5} title="Compliance & Return Policy" icon="pi pi-shield" />

            <div className="pep-row-3">
              <Field label="HSN Code">
                <input
                  className="pep-input"
                  type="text"
                  value={p.compliance.hsnCode}
                  onChange={(e) => setNested("compliance", "hsnCode", e.target.value)}
                  placeholder="e.g. 84716060"
                />
              </Field>
              <Field label="GST Rate (%)">
                <div className="pep-input-suffix-wrap">
                  <input
                    className="pep-input pep-input-suffixed"
                    type="number"
                    min="0"
                    max="100"
                    value={p.compliance.gstRate}
                    onChange={(e) => setNested("compliance", "gstRate", parseFloat(e.target.value) || 0)}
                  />
                  <span className="pep-input-suffix">%</span>
                </div>
              </Field>
              <Field label="Country of Origin">
                <input
                  className="pep-input"
                  type="text"
                  value={p.compliance.countryOfOrigin}
                  onChange={(e) => setNested("compliance", "countryOfOrigin", e.target.value)}
                  placeholder="e.g. India"
                />
              </Field>
            </div>

            <div className="pep-return-box">
              <div className="pep-field">
                <label className="pep-label">Returnable</label>
                <label className="pep-toggle-row">
                  <div
                    className={`pep-toggle${p.returnPolicy.returnable ? " on" : ""}`}
                    onClick={() => setNested("returnPolicy", "returnable", !p.returnPolicy.returnable)}
                    role="switch"
                    aria-checked={p.returnPolicy.returnable}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === " " && setNested("returnPolicy", "returnable", !p.returnPolicy.returnable)}
                  >
                    <div className="pep-toggle-thumb" />
                  </div>
                  <span className={p.returnPolicy.returnable ? "pep-return-status-on" : "pep-return-status-off"}>
                    {p.returnPolicy.returnable ? "Returns accepted" : "No returns"}
                  </span>
                </label>
              </div>
              <Field label="Return Window (days)">
                <div className="pep-input-suffix-wrap">
                  <input
                    className="pep-input pep-input-suffixed"
                    type="number"
                    min="0"
                    value={p.returnPolicy.returnDays}
                    onChange={(e) => setNested("returnPolicy", "returnDays", parseInt(e.target.value) || 0)}
                    disabled={!p.returnPolicy.returnable}
                  />
                  <span className="pep-input-suffix">days</span>
                </div>
              </Field>
            </div>
          </section>

        </div>
        {/* ── END LEFT COLUMN ─────────────────────────────────────── */}

        {/* ── RIGHT: sticky sidebar ────────────────────────────────── */}
        <aside className="pep-sidebar-col">

          {/* Preview card */}
          <div className="pep-sidebar-card">
            <div className="pep-sidebar-header">
              <span className="pep-sidebar-header-text">Listing Preview</span>
            </div>
            <div className="pep-sidebar-card-body">
              {imgPreview || p.thumbnail ? (
                <img
                  src={imgPreview || p.thumbnail}
                  alt="preview"
                  className="pep-preview-img"
                />
              ) : (
                <div className="pep-preview-img-placeholder">
                  <i className="pi pi-image pep-preview-img-placeholder-icon" />
                  <p className="pep-preview-img-placeholder-text">No image yet</p>
                </div>
              )}

              {p.title
                ? <h3 className="pep-preview-title">{p.title}</h3>
                : <h3 className="pep-preview-title-empty">Product title will appear here</h3>
              }
              <p className="pep-preview-category">
                {p.category || "Category"}{p.subcategory ? ` › ${p.subcategory}` : ""}
              </p>

              <div className="pep-price-box">
                <p className="pep-price-label">Unit Price</p>
                <p className="pep-price-value">
                  {p.pricing.basePrice > 0 ? `${sym}${p.pricing.basePrice.toLocaleString()}` : "—"}
                </p>
                <p className="pep-price-moq">MOQ: {p.inventory.minOrderQty} units</p>
              </div>

              {[
                { label: "SKU",      value: p.inventory.sku || "—" },
                { label: "Stock",    value: p.inventory.totalStock > 0 ? `${p.inventory.totalStock.toLocaleString()} units` : "—" },
                { label: "Dispatch", value: `${p.shipping.dispatchTimeDays} days` },
                { label: "Weight",   value: p.shipping.weight > 0 ? `${p.shipping.weight} kg` : "—" },
                { label: "GST",      value: `${p.pricing.gst}%` },
                { label: "Origin",   value: p.compliance.countryOfOrigin || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="pep-stat-row">
                  <span className="pep-stat-label">{label}</span>
                  <span className="pep-stat-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status card */}
          <div className="pep-sidebar-card">
            <div className="pep-sidebar-header">
              <span className="pep-sidebar-header-text">Listing Status</span>
            </div>
            <div className="pep-sidebar-card-body">
              <div className="pep-field">
                <label className="pep-label">Visibility</label>
                <select
                  className="pep-select"
                  value={p.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option value="active">Active — visible to buyers</option>
                  <option value="inactive">Inactive — hidden</option>
                  <option value="draft">Draft — not published</option>
                </select>
              </div>

              <span className={`pep-status-badge pep-status-${p.status}`}>
                <span className="pep-status-dot" />
                {statusLabel[p.status]}
              </span>

              <div className="pep-featured-row">
                <div>
                  <p className="pep-featured-title">Featured Spotlight</p>
                  <p className="pep-featured-sub">Show on supplier profile</p>
                </div>
                <div
                  className={`pep-toggle${p.featured ? " on" : ""}`}
                  onClick={() => set("featured", !p.featured)}
                  role="switch"
                  aria-checked={p.featured}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === " " && set("featured", !p.featured)}
                >
                  <div className="pep-toggle-thumb" />
                </div>
              </div>
            </div>
          </div>

          {/* Save card */}
          <div className="pep-save-card">
            <button className="pep-btn-publish-full" type="button" onClick={handleSave}>
              <i className="pi pi-check" /> Publish Product
            </button>
            <button className="pep-btn-discard-full" type="button" onClick={() => navigate("/dashboard/products")}>
              <i className="pi pi-times" /> Discard
            </button>

            {Object.keys(errors).length > 0 && (
              <div className="pep-error-box">
                <div className="pep-error-box-header">
                  <i className="pi pi-exclamation-triangle pep-error-box-icon" />
                  <span className="pep-error-box-title">Please fix the following:</span>
                </div>
                {Object.values(errors).map((err, i) => (
                  <span key={i} className="pep-error-item">· {err}</span>
                ))}
              </div>
            )}

            <div className="pep-info-note">
              <i className="pi pi-info-circle pep-info-note-icon" />
              <span className="pep-info-note-text">
                Your product will be visible to B2B buyers immediately after publishing. You can edit or unpublish at any time.
              </span>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default AddNewProduct;
