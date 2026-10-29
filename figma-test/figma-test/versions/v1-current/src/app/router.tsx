import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { roles, type RoleKey, type ScreenKey } from './roles'

type RouterState = {
  role: RoleKey
  screen: ScreenKey
  setRole: (role: RoleKey) => void
  go: (screen: ScreenKey) => void
}

const RouterContext = createContext<RouterState | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleKey>('dealer')
  const [screen, setScreen] = useState<ScreenKey>('dealer-dashboard')

  const value = useMemo<RouterState>(
    () => ({
      role,
      screen,
      // Switching role jumps to that role's first nav entry, mirroring the prototype.
      setRole: (next) => {
        setRoleState(next)
        setScreen(roles[next].nav[0].screen)
      },
      go: (next) => setScreen(next),
    }),
    [role, screen],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}
