import StarRating from "./StarRating"
import {
  SUPPLIER,
  PERFORMANCE_METRICS,
  PERFORMANCE_PERIOD,
  SUGGESTIONS,
} from "./dashboardData"
import { FaCalendarAlt, FaLightbulb } from "react-icons/fa"
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from "react-icons/hi"

const PerformancePanel = () => {
  return (
    <>
      <div className="performance-blue-bar">
        <div className="perf-bar-item">
          <span className="perf-bar-label">Current star rating</span>
          <div className="perf-bar-stars">
            <StarRating rating={SUPPLIER.currentStarLevel} size={18} />
            <span className="perf-star-text">{SUPPLIER.currentStarLevel}-Star</span>
          </div>
        </div>
        <div className="perf-bar-divider" aria-hidden />
        <div className="perf-bar-item">
          <span className="perf-bar-label">Forecasted rating</span>
          <span className="forecast-badge">{SUPPLIER.starLabel}</span>
        </div>
        <div className="perf-bar-divider" aria-hidden />
        <button type="button" className="perf-monthly-btn">
          <FaCalendarAlt aria-hidden />
          <span>Monthly performance</span>
          <span className="perf-notification-dot">3</span>
        </button>
      </div>

      <section className="performance-card">
        <div className="performance-card-header">
          <div className="header-main">
            <h2>Business Performance</h2>
            <p className="header-subtitle">Real-time analysis based on market signals</p>
          </div>
          <span className="performance-period">{PERFORMANCE_PERIOD}</span>
        </div>
        <div className="performance-metrics-grid">
          {PERFORMANCE_METRICS.map((m) => {
            const isPositive = m.peerChange >= 0
            const showPeer = m.id !== "unread" && m.peerChange !== 0

            return (
              <div key={m.id} className="perf-metric-cell">
                <div className="metric-header">
                  <span className="perf-metric-label">{m.label}</span>
                </div>
                <div className="metric-body">
                  <span className="perf-metric-value">{m.value}</span>
                  {showPeer && (
                    <div className={`perf-metric-peer-wrap ${isPositive ? "up" : "down"}`}>
                      <span className="peer-trend-icon">
                        {isPositive ? <HiOutlineTrendingUp /> : <HiOutlineTrendingDown />}
                      </span>
                      <span className="peer-text">
                        {isPositive ? "+" : ""}
                        {m.peerChange}%
                      </span>
                    </div>
                  )}
                </div>
                {m.actionLabel && (
                  <button type="button" className="perf-action-btn">
                    {m.actionLabel}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="suggestions-card">
        <div className="suggestions-header">
          <div>
            <h3>
              <FaLightbulb aria-hidden />
              Our suggestions
            </h3>
            <p>Updated weekly · My industry: {SUPPLIER.industry}</p>
          </div>
          <button type="button" className="suggestions-act-btn">
            Act now
          </button>
        </div>
        <ul className="suggestions-list">
          {SUGGESTIONS.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default PerformancePanel
