interface KPICardProps {
  label: string
  value: string | number
  change?: string
  icon?: React.ReactNode
}

export default function KPICard({ label, value, change, icon }: KPICardProps) {
  return (
    <div className="bg-gradient-to-br from-surface-light to-surface border border-subtle rounded-lg p-4 text-center">
      <div className="text-xs font-bold uppercase text-tertiary mb-2">{label}</div>
      <div className="text-2xl font-black text-primary mb-1">{value}</div>
      {change && <div className="text-xs font-bold text-status-success">{change}</div>}
    </div>
  )
}
