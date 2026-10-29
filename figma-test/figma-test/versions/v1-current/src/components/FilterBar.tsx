import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { filterTabs } from '../data'

export default function FilterBar() {
  return (
    <div className="filterbar">
      <div className="tabs">
        {filterTabs.map((tab) => (
          <button key={tab.label} className={`tab${tab.active ? ' is-active' : ''}`}>
            {'icon' in tab && tab.icon === 'search' && <Search size={14} />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="filterbar__spacer" />

      <button className="selectbtn">
        <SlidersHorizontal size={14} />
        Filtrele
      </button>
      <button className="selectbtn">
        Tüm Bölgeler
        <ChevronDown size={14} />
      </button>
      <button className="selectbtn">
        Tüm Lig ve Segmentler
        <ChevronDown size={14} />
      </button>
    </div>
  )
}
