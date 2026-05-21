import { useState } from 'react';
import { Chart as ChartJS , CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MONTHLY_ANALYTICS } from './analyticsData';
import '../../styles/dashboard_home.css';

// Register ChartJS elements
ChartJS.register( CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend);

const Analytics = () => {
  const months = Object.keys(MONTHLY_ANALYTICS);
  const [selectedMonth, setSelectedMonth] = useState<string>('June 2026 (Current)');

  const currentData = MONTHLY_ANALYTICS[selectedMonth] || MONTHLY_ANALYTICS[months[months.length - 1]];

  // Colors & Configuration for Inquiry Management Pie Chart
  const inquiryChartData = {
    labels: currentData.inquiries.map((item) => item.label),
    datasets: [
      {
        label: 'Inquiries Distribution',
        data: currentData.inquiries.map((item) => item.value),
        backgroundColor: [
          '#3b82f6', // Tech Blue for New
          '#f59e0b', // Amber for Negotiation
          '#10b981', // Emerald for Confirmed
          '#94a3b8', // Slate for Closed/Spam
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  // Colors & Configuration for RFQ Management Pie Chart
  const rfqChartData = {
    labels: currentData.rfqs.map((item) => item.label),
    datasets: [
      {
        label: 'RFQ Status Distribution',
        data: currentData.rfqs.map((item) => item.value),
        backgroundColor: [
          '#64748b', // Slate for Draft
          '#0284c7', // Sky Blue for Submitted
          '#16a34a', // Success Green for Accepted
          '#dc2626', // Danger Red for Declined
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  // Colors & Configuration for Product Selling Management Pie Chart
  const sellingChartData = {
    labels: currentData.selling.map((item) => item.label),
    datasets: [
      {
        label: 'Units Sold by Category',
        data: currentData.selling.map((item) => item.value),
        backgroundColor: [
          '#e64545', // Brand Red for Electronics
          '#3b82f6', // Blue for Machinery
          '#ec4899', // Pink for Apparel
          '#10b981', // Green for Home
          '#8b5cf6', // Purple for Others
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  // Colors & Configuration for Product Upload Management Pie Chart
  const uploadChartData = {
    labels: currentData.uploads.map((item) => item.label),
    datasets: [
      {
        label: 'Products Upload Status',
        data: currentData.uploads.map((item) => item.value),
        backgroundColor: [
          '#16a34a', // Green for Approved
          '#ca8a04', // Amber/Yellow for Pending
          '#ef4444', // Red for Rejected
          '#94a3b8', // Slate for Drafts
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  // Coordinated Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            family: 'poppins, var(--sans)',
            size: 11,
            weight: 'normal' as const,
          },
          color: 'var(--text)',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(8, 6, 13, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: {
          family: 'poppins, var(--sans)',
          size: 12,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: 'poppins, var(--sans)',
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
      },
    },
  };

  // Total metrics summaries to display in cards
  const totalInquiries = currentData.inquiries.reduce((sum, item) => sum + item.value, 0);
  const totalRfqs = currentData.rfqs.reduce((sum, item) => sum + item.value, 0);
  const totalSales = currentData.selling.reduce((sum, item) => sum + item.value, 0);
  const totalUploads = currentData.uploads.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="dashboard-container b2b-seller-hub p-6">
      {/* Dynamic Filter / Header Area */}
      <div className="flex-between mb-6 flex-wrap gap-4" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
        <div>
          <h1 className="text-xl font-bold text-heading mb-1" style={{ color: 'var(--text-heading)', fontSize: 'var(--fs-xl)' }}>
            Performance & Business Analytics
          </h1>
          <p className="text-muted text-sm">
            Interactive, monthly-based distribution charts tracking lead generation, RFQs, inventory activity, and product sales.
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex-center gap-3" style={{ background: '#f8fafc', padding: '8px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)' }}>
          <label htmlFor="month-select" className="text-sm font-bold text-heading nowrap" style={{ color: 'var(--text-dark)' }}>
            Month:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 text-sm font-semibold cursor-pointer"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--white)',
              color: 'var(--text-dark)',
              outline: 'none',
              minWidth: '180px',
            }}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics 2x2 Grid */}
      <div className="grid col-2 gap-6">
        
        {/* 1. Inquiry Management Chart Card */}
        <div className="table-card p-4 flex flex-col gap-4">
          <div className="table-card-header flex-between mb-2" style={{ padding: '0 0 12px 0' }}>
            <div>
              <h3 className="table-card-title text-base font-bold">Inquiry Management</h3>
              <span className="table-card-subtitle text-xs" style={{ fontSize: '11px', color: 'var(--table-card-subTitle)' }}>
                Lead generation, negotiations, and conversions distribution
              </span>
            </div>
            <span className="qty-badge text-xs" style={{ background: '#eff6ff', color: '#3b82f6', fontWeight: 800 }}>
              {totalInquiries} Total
            </span>
          </div>
          <div style={{ height: '280px', width: '100%', position: 'relative' }}>
            <Bar data={inquiryChartData} options={chartOptions} />
          </div>
        </div>

        {/* 2. RFQ Management Chart Card */}
        <div className="table-card p-4 flex flex-col gap-4">
          <div className="table-card-header flex-between mb-2" style={{ padding: '0 0 12px 0' }}>
            <div>
              <h3 className="table-card-title text-base font-bold">RFQ Management</h3>
              <span className="table-card-subtitle text-xs" style={{ fontSize: '11px', color: 'var(--table-card-subTitle)' }}>
                Request for Quote status distribution and buyer acceptance
              </span>
            </div>
            <span className="qty-badge text-xs" style={{ background: '#f0fdf4', color: '#16a34a', fontWeight: 800 }}>
              {totalRfqs} Submissions
            </span>
          </div>
          <div style={{ height: '280px', width: '100%', position: 'relative' }}>
            <Bar data={rfqChartData} options={chartOptions} />
          </div>
        </div>

        {/* 3. Product Selling Management Chart Card */}
        <div className="table-card p-4 flex flex-col gap-4">
          <div className="table-card-header flex-between mb-2" style={{ padding: '0 0 12px 0' }}>
            <div>
              <h3 className="table-card-title text-base font-bold">Product Selling Management</h3>
              <span className="table-card-subtitle text-xs" style={{ fontSize: '11px', color: 'var(--table-card-subTitle)' }}>
                Units sold distribution across core B2B categories
              </span>
            </div>
            <span className="qty-badge text-xs" style={{ background: 'var(--brand-red-light)', color: 'var(--brand-red)', fontWeight: 800 }}>
              {totalSales.toLocaleString()} Units
            </span>
          </div>
          <div style={{ height: '280px', width: '100%', position: 'relative' }}>
            <Bar data={sellingChartData} options={chartOptions} />
          </div>
        </div>

        {/* 4. Product Upload Management Chart Card */}
        <div className="table-card p-4 flex flex-col gap-4">
          <div className="table-card-header flex-between mb-2" style={{ padding: '0 0 12px 0' }}>
            <div>
              <h3 className="table-card-title text-base font-bold">Product Upload Management</h3>
              <span className="table-card-subtitle text-xs" style={{ fontSize: '11px', color: 'var(--table-card-subTitle)' }}>
                Inventory upload activity, drafts, and compliance audits
              </span>
            </div>
            <span className="qty-badge text-xs" style={{ background: '#fefce8', color: '#ca8a04', fontWeight: 800 }}>
              {totalUploads} Uploaded
            </span>
          </div>
          <div style={{ height: '280px', width: '100%', position: 'relative' }}>
            <Bar data={uploadChartData} options={chartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
