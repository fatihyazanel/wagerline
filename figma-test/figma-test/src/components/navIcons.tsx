import {
  Home,
  Trophy,
  Award,
  Target,
  MapPin,
  LayoutGrid,
  Users,
  User,
  Network,
  BarChart3,
  CalendarDays,
  ShieldCheck,
  FileText,
  Settings,
} from 'lucide-react'
import type { NavIcon } from '../app/roles'

export function NavIconGlyph({ name, size = 16 }: { name: NavIcon; size?: number }) {
  switch (name) {
    case 'home':
      return <Home size={size} />
    case 'trophy':
      return <Trophy size={size} />
    case 'badge':
      return <Award size={size} />
    case 'target':
      return <Target size={size} />
    case 'pin':
      return <MapPin size={size} />
    case 'grid':
      return <LayoutGrid size={size} />
    case 'users':
      return <Users size={size} />
    case 'user':
      return <User size={size} />
    case 'sitemap':
      return <Network size={size} />
    case 'bars':
      return <BarChart3 size={size} />
    case 'calendar':
      return <CalendarDays size={size} />
    case 'shield':
      return <ShieldCheck size={size} />
    case 'file':
      return <FileText size={size} />
    case 'settings':
      return <Settings size={size} />
  }
}
