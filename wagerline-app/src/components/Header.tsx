import { Search, Bell, User } from 'lucide-react'

interface HeaderProps {
  activePage: string
  setActivePage: (page: string) => void
}

export default function Header({ activePage, setActivePage }: HeaderProps) {
  const navItems = ['Live', 'Sports', 'Leagues', 'Predictions', 'Stats', 'News', 'Rewards', 'Admin']

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-dark-bg border-b border-subtle z-50 flex items-center px-6 gap-10">
      {/* Logo */}
      <div className="font-bold text-sm tracking-tight whitespace-nowrap">
        WAGER<span className="text-brand-yellow">line</span>
      </div>

      {/* Navigation */}
      <nav className="flex gap-8 flex-1">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActivePage(item.toLowerCase())}
            className={`text-xs font-semibold transition-colors relative pb-2 ${
              activePage === item.toLowerCase()
                ? 'text-brand-yellow'
                : 'text-tertiary hover:text-secondary'
            }`}
          >
            {item}
            {activePage === item.toLowerCase() && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tertiary" />
          <input
            type="text"
            placeholder="Search teams..."
            className="bg-surface border border-subtle rounded-full pl-9 pr-3 py-1.5 text-xs placeholder-tertiary focus:outline-none focus:border-light"
          />
        </div>
        <button className="text-tertiary hover:text-secondary transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <button className="text-tertiary hover:text-secondary transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
