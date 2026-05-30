import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import dummyProducts from "../../../core/storage/DummyProduct_10.json";
import { updateProduct } from "./productStore";
import "../../../styles/add_new_product.css";

// ── Types ────────────────────────────────────────────────────────────────────
type Product = {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  description: { short: string; long: string };
  images: string[];
  thumbnail: string;
  pricing: { basePrice: number; currency: string; gst: number };
  bulkPricing: Array<{ minQty: number; pricePerUnit: number }>;
  inventory: { sku: string; totalStock: number; minOrderQty: number };
  supplier: { name: string; companyName: string; location: string };
  shipping: {
    weight: number;
    dimensions: { length: number; breadth: number; height: number };
    dispatchTimeDays: number;
  };
  returnPolicy: { returnable: boolean; returnDays: number };
  compliance: { hsnCode: string; gstRate: number; countryOfOrigin: string };
  createdAt: string;
  updatedAt: string;
  subcategory: string;
};

// ── Sub-components ───────────────────────────────────────────────────────────
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

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div className="pep-stat-row">
    <span className="pep-stat-label">{label}</span>
    <span className="pep-stat-value">{value}</span>
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────
const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [bulkPricing, setBulkPricing] = useState<Array<{ minQty: number; pricePerUnit: number }>>([]);
  const [isInsuranceRequired, setIsInsuranceRequired] = useState(false);
  const [imgPreview, setImgPreview] = useState<string>("");

  type CategoryState = { categories: Array<{ category: string } & Record<string, unknown>> };
  const categoriesData = useSelector((state: { category: CategoryState }) => state.category.categories) || [];
  const categoryValues = [...new Set(categoriesData.map((item) => item.category))];
  const defaultCategories = [
    "Electronics", "Apparel & Shoes", "Machinery", "Home & Garden",
    "Packaging & Paper", "Safety Equipment", "Office Supplies", "AV Equipment",
  ];
  const displayCategories = categoryValues.length > 0 ? categoryValues : defaultCategories;

  useEffect(() => {
    const found = dummyProducts.find((p: Product) => p.id === parseInt(id || "0"));
    if (!found) return;
    setProduct(found as Product);
    setBulkPricing(found.bulkPricing || []);
    setIsInsuranceRequired(found.pricing.basePrice > 5000);
    setImgPreview(found.thumbnail || "");
  }, [id]);

  // ── Setters ─────────────────────────────────────────────────────────────────
  const set = <T,>(field: keyof Product, value: T) => {
    if (!product) return;
    setProduct({ ...product, [field]: value } as Product);
  };

  const setNested = <S extends keyof Product>(section: S, field: string, value: unknown) => {
    if (!product) return;
    const sectionData = product[section] as object;
    setProduct({ ...product, [section]: { ...sectionData, [field]: value } } as Product);
  };

  const setDim = (dim: "length" | "breadth" | "height", value: number) => {
    if (!product) return;
    setProduct({
      ...product,
      shipping: {
        ...product.shipping,
        dimensions: { ...product.shipping.dimensions, [dim]: value },
      },
    });
  };

  const addBulkPricingTier = () => setBulkPricing([...bulkPricing, { minQty: 10, pricePerUnit: 0 }]);
  const updateBulkPricing = (index: number, field: string, value: number) => {
    const updated = [...bulkPricing];
    updated[index] = { ...updated[index], [field]: value };
    setBulkPricing(updated);
  };
  const removeBulkPricingTier = (index: number) => setBulkPricing(bulkPricing.filter((_, i) => i !== index));

  const handleSave = () => {
    if (product) {
      dispatch(updateProduct({ ...product, bulkPricing }));
      navigate("/seller/products");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;
    const url = URL.createObjectURL(file);
    setImgPreview(url);
    setProduct({ ...product, thumbnail: url });
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const sym = product?.pricing.currency === "INR" ? "₹"
    : product?.pricing.currency === "USD" ? "$" : "€";

  const discount = (price: number) =>
    product && product.pricing.basePrice > 0
      ? Math.round((1 - price / product.pricing.basePrice) * 100)
      : 0;

  const statusLabel: Record<string, string> = {
    active: "Active", inactive: "Inactive", draft: "Draft",
  };

  if (!product) return (
    <div className="pep-loading-container">
      <i className="pi pi-spin pi-spinner pep-loading-spinner" />
      <span className="pep-loading-text">Loading product…</span>
    </div>
  );

  return (
    <div className="pep-page">

      {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
      <div className="pep-topbar">
        <div className="pep-topbar-left">
          <button className="pep-back-btn" onClick={() => navigate("/seller/products")} aria-label="Back">
            <i className="pi pi-arrow-left" />
          </button>
          <div>
            <nav className="pep-breadcrumb">
              <span>Products</span>
              <i className="pi pi-angle-right" />
              <span className="pep-breadcrumb-active">Edit Listing</span>
            </nav>
            <h1 className="pep-page-title">{product.title}</h1>
          </div>
        </div>
        <div className="pep-topbar-right">
          <button className="pep-btn-discard" onClick={() => navigate("/seller/products")}>
            Discard
          </button>
          <button className="pep-btn-publish" onClick={handleSave}>
            <i className="pi pi-check" /> Publish Changes
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

            {/* Existing images strip */}
            {(imgPreview || product.thumbnail) && (
              <div className="pep-image-strip">
                <div className="pep-image-item-wrap">
                  <img
                    src={imgPreview || product.thumbnail}
                    alt="main"
                    className="pep-image-item-main"
                  />
                  <span className="pep-image-item-badge">MAIN</span>
                </div>
                {product.images?.slice(0, 5).map((img, i) => (
                  <img key={i} src={img} alt={`img-${i}`} className="pep-image-item-secondary" />
                ))}
                <div
                  className="pep-image-add-slot"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="pi pi-plus pep-image-add-icon" />
                  <span className="pep-image-add-text">Add</span>
                </div>
              </div>
            )}

            {/* Upload zone */}
            {!imgPreview && !product.thumbnail && (
              <div
                className="pep-upload-zone"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              >
                <div className="pep-upload-icon-wrap">
                  <i className="pi pi-cloud-upload pep-upload-icon" />
                </div>
                <div className="pep-upload-text">
                  <p className="pep-upload-title">Click or drag &amp; drop to upload</p>
                  <p className="pep-upload-sub">JPG, PNG · 800×800 px recommended · Max 5 MB each</p>
                </div>
              </div>
            )}
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
                value={product.thumbnail}
                onChange={(e) => {
                  setProduct({ ...product, thumbnail: e.target.value });
                  setImgPreview(e.target.value);
                }}
                placeholder="https://example.com/image.jpg"
              />
            </Field>
          </section>

          {/* ── 2. Basic Information ───────────────────────────────── */}
          <section className="pep-card">
            <SectionHeader step={2} title="Basic Information" icon="pi pi-info-circle" />

            <Field label="Product Title" required>
              <input
                className="pep-input"
                type="text"
                value={product.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }}
                placeholder="e.g. Industrial Safety Gloves — Box of 100"
              />
            </Field>

            <div className="pep-row-2">
              <Field label="Category" required>
                <select
                  className="pep-select"
                  value={product.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  <option value="">Select a category</option>
                  {displayCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subcategory">
                <input
                  className="pep-input"
                  type="text"
                  value={product.subcategory}
                  onChange={(e) => set("subcategory", e.target.value)}
                  placeholder="e.g. Safety Gloves"
                />
              </Field>
            </div>

            <div className="pep-row-2">
              <Field label="SKU / Product Code">
                <input
                  className="pep-input"
                  type="text"
                  value={product.inventory.sku}
                  onChange={(e) => setNested("inventory", "sku", e.target.value)}
                  placeholder="e.g. SAFE-009-BLK"
                />
              </Field>
              <Field label="SEO URL Slug" hint="Auto-generated from title.">
                <input
                  className="pep-input"
                  type="text"
                  value={product.slug}
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
                value={product.description.long}
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
                  value={product.pricing.currency}
                  onChange={(e) => setNested("pricing", "currency", e.target.value)}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </Field>
              <Field label="Unit Price" required>
                <div className="pep-input-prefix-wrap">
                  <span className="pep-input-prefix">{sym}</span>
                  <input
                    className="pep-input pep-input-prefixed"
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.pricing.basePrice || ""}
                    onChange={(e) => setNested("pricing", "basePrice", parseFloat(e.target.value) || 0)}
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
                    value={product.pricing.gst}
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
                  value={product.inventory.totalStock || ""}
                  onChange={(e) => setNested("inventory", "totalStock", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </Field>
              <Field label="Min. Order Qty (MOQ)">
                <input
                  className="pep-input"
                  type="number"
                  min="1"
                  value={product.inventory.minOrderQty}
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
                <button className="pep-btn-add-tier" type="button" onClick={addBulkPricingTier}>
                  <i className="pi pi-plus" /> Add Tier
                </button>
              </div>

              {bulkPricing.length === 0 ? (
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
                    {bulkPricing.map((tier, i) => {
                      const d = discount(tier.pricePerUnit);
                      return (
                        <tr key={i} className="pep-bulk-row">
                          <td className="pep-bulk-td-qty">
                            <input
                              className="pep-input pep-input-sm"
                              type="number"
                              min="1"
                              value={tier.minQty}
                              onChange={(e) => updateBulkPricing(i, "minQty", parseInt(e.target.value) || 1)}
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
                                onChange={(e) => updateBulkPricing(i, "pricePerUnit", parseFloat(e.target.value) || 0)}
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
                            <button className="pep-btn-remove-tier" type="button" onClick={() => removeBulkPricingTier(i)} title="Remove">
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
                    value={product.shipping.weight || ""}
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
                    value={product.shipping.dispatchTimeDays}
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
                        value={product.shipping.dimensions[dim] || ""}
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
                  const active = isInsuranceRequired === opt.val;
                  return (
                    <label key={String(opt.val)} className={`pep-insurance-card${active ? " active" : ""}`}>
                      <input
                        type="radio"
                        name="insurance"
                        className="pep-radio-hidden"
                        checked={active}
                        onChange={() => setIsInsuranceRequired(opt.val)}
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
                  value={product.compliance.hsnCode}
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
                    value={product.compliance.gstRate}
                    onChange={(e) => setNested("compliance", "gstRate", parseFloat(e.target.value) || 0)}
                  />
                  <span className="pep-input-suffix">%</span>
                </div>
              </Field>
              <Field label="Country of Origin">
                <input
                  className="pep-input"
                  type="text"
                  value={product.compliance.countryOfOrigin}
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
                    className={`pep-toggle${product.returnPolicy.returnable ? " on" : ""}`}
                    onClick={() => setNested("returnPolicy", "returnable", !product.returnPolicy.returnable)}
                    role="switch"
                    aria-checked={product.returnPolicy.returnable}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === " " && setNested("returnPolicy", "returnable", !product.returnPolicy.returnable)}
                  >
                    <div className="pep-toggle-thumb" />
                  </div>
                  <span className={product.returnPolicy.returnable ? "pep-return-status-on" : "pep-return-status-off"}>
                    {product.returnPolicy.returnable ? "Returns accepted" : "No returns"}
                  </span>
                </label>
              </div>
              <Field label="Return Window (days)">
                <div className="pep-input-suffix-wrap">
                  <input
                    className="pep-input pep-input-suffixed"
                    type="number"
                    min="0"
                    value={product.returnPolicy.returnDays}
                    onChange={(e) => setNested("returnPolicy", "returnDays", parseInt(e.target.value) || 0)}
                    disabled={!product.returnPolicy.returnable}
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
              <span className="pep-sidebar-header-text">Product Preview</span>
            </div>
            <div className="pep-sidebar-card-body">
              {imgPreview || product.thumbnail ? (
                <img
                  src={imgPreview || product.thumbnail}
                  alt="preview"
                  className="pep-preview-img"
                />
              ) : (
                <div className="pep-preview-img-placeholder">
                  <i className="pi pi-image pep-preview-img-placeholder-icon" />
                  <p className="pep-preview-img-placeholder-text">No image yet</p>
                </div>
              )}

              {product.title
                ? <h3 className="pep-preview-title">{product.title}</h3>
                : <h3 className="pep-preview-title-empty">Product title will appear here</h3>
              }
              <p className="pep-preview-category">
                {product.category || "Category"}{product.subcategory ? ` › ${product.subcategory}` : ""}
              </p>

              <div className="pep-price-box">
                <p className="pep-price-label">Unit Price</p>
                <p className="pep-price-value">
                  {product.pricing.basePrice > 0 ? `${sym}${product.pricing.basePrice.toLocaleString()}` : "—"}
                </p>
                <p className="pep-price-moq">MOQ: {product.inventory.minOrderQty} units</p>
              </div>

              {[
                { label: "SKU",      value: product.inventory.sku || "—" },
                { label: "Stock",    value: product.inventory.totalStock > 0 ? `${product.inventory.totalStock.toLocaleString()} units` : "—" },
                { label: "Dispatch", value: `${product.shipping.dispatchTimeDays} days` },
                { label: "Weight",   value: product.shipping.weight > 0 ? `${product.shipping.weight} kg` : "—" },
                { label: "GST",      value: `${product.pricing.gst}%` },
                { label: "Origin",   value: product.compliance.countryOfOrigin || "—" },
              ].map(({ label, value }) => (
                <StatRow key={label} label={label} value={value} />
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
                  value={product.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option value="active">Active — visible to buyers</option>
                  <option value="inactive">Inactive — hidden</option>
                  <option value="draft">Draft — not published</option>
                </select>
              </div>

              <span className={`pep-status-badge pep-status-${product.status}`}>
                <span className="pep-status-dot" />
                {statusLabel[product.status] ?? product.status}
              </span>

              <div className="pep-featured-row">
                <div>
                  <p className="pep-featured-title">Featured Spotlight</p>
                  <p className="pep-featured-sub">Show on supplier profile</p>
                </div>
                <div
                  className={`pep-toggle${product.featured ? " on" : ""}`}
                  onClick={() => set("featured", !product.featured)}
                  role="switch"
                  aria-checked={product.featured}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === " " && set("featured", !product.featured)}
                >
                  <div className="pep-toggle-thumb" />
                </div>
              </div>
            </div>
          </div>

          {/* Save card */}
          <div className="pep-save-card">
            <button className="pep-btn-publish-full" type="button" onClick={handleSave}>
              <i className="pi pi-check" /> Publish Changes
            </button>
            <button className="pep-btn-discard-full" type="button" onClick={() => navigate("/seller/products")}>
              <i className="pi pi-times" /> Discard
            </button>

            <div className="pep-info-note">
              <i className="pi pi-info-circle pep-info-note-icon" />
              <span className="pep-info-note-text">
                Changes are saved to your catalog immediately. Buyers will see the updated listing within minutes.
              </span>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default ProductEditPage;
