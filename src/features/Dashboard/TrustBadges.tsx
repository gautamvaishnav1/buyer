import { FaCheckCircle, FaShieldAlt, FaCrown } from "react-icons/fa"
import type { VerificationTier } from "./dashboardData"

interface TrustBadgesProps {
  activeTier: VerificationTier
  compact?: boolean
}

const TIERS = [
  {
    id: "basic" as const,
    label: "Basic",
    requirement: "Email & phone verified",
    icon: FaCheckCircle,
    className: "tier-basic",
    badgeLabel: "Blue checkmark",
  },
  {
    id: "verified" as const,
    label: "Verified",
    requirement: "Business license + tax ID",
    icon: FaShieldAlt,
    className: "tier-verified",
    badgeLabel: "Silver shield",
  },
  {
    id: "premium" as const,
    label: "Premium",
    requirement: "On-site video inspection",
    icon: FaCrown,
    className: "tier-premium",
    badgeLabel: "Gold crown",
  },
]

const TrustBadges = ({ activeTier, compact = false }: TrustBadgesProps) => {
  return (
    <div className={`trust-badges ${compact ? "trust-badges--compact" : ""}`} role="list" aria-label="Trust verification tiers">
      {TIERS.map((tier) => {
        const Icon = tier.icon
        const isActive = tier.id === activeTier

        return (
          <div
            key={tier.id}
            role="listitem"
            className={`trust-tier ${tier.className} ${isActive ? "is-active" : ""}`}
            title={`${tier.label}: ${tier.requirement}`}
          >
            <span className="trust-tier-icon" aria-hidden>
              <Icon />
            </span>
            {!compact && (
              <div className="trust-tier-text">
                <span className="trust-tier-name">{tier.label}</span>
                <span className="trust-tier-badge">{tier.badgeLabel}</span>
              </div>
            )}
            {isActive && <span className="trust-tier-active-dot" aria-label="Current tier" />}
          </div>
        )
      })}
    </div>
  )
}

export default TrustBadges
