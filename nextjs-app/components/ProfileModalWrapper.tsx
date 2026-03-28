'use client'
import { useState } from 'react'
import { DesktopNav, MobileNav, ProfileButton } from './NavLinks'
import { ProfileModal } from './ProfileModal'
import { ChefHat } from 'lucide-react'
import { usePathname } from 'next/navigation'

const AUTH_PATHS = ['/login', '/register']

export function ProfileModalWrapper({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false)
  const pathname = usePathname()
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '20px 16px 16px',
            borderBottom: '1px solid #f3f4f6',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#00B4A6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
            }}
            onClick={() => setShowProfile(true)}
            title="Open profile"
          >
            <ChefHat size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Meal Prep</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>Plan smarter</div>
          </div>
        </div>

        <DesktopNav />

        <div style={{ padding: '8px 0', borderTop: '1px solid #f3f4f6' }}>
          <ProfileButton onClick={() => setShowProfile(true)} />
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">{children}</main>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Profile modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  )
}
