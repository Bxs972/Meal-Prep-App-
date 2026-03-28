'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  CalendarDays,
  BookOpen,
  Search,
  ShoppingCart,
  BarChart3,
  User,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/plan', label: 'Planning', icon: CalendarDays },
  { href: '/recipes', label: 'Recipes', icon: BookOpen },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/shopping', label: 'Shopping', icon: ShoppingCart },
  { href: '/stats', label: 'Analytics', icon: BarChart3 },
]

const PRIMARY = '#00B4A6'

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  mobile,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  active: boolean
  mobile?: boolean
}) {
  if (mobile) {
    return (
      <Link
        href={href}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: '8px 4px',
          textDecoration: 'none',
          color: active ? PRIMARY : '#9ca3af',
          fontSize: 10,
          fontWeight: active ? 600 : 400,
          flex: 1,
          transition: 'color 0.15s',
        }}
      >
        <Icon size={20} color={active ? PRIMARY : '#9ca3af'} />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderRadius: 8,
        textDecoration: 'none',
        color: active ? PRIMARY : '#6b7280',
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        background: active ? '#e6f7f6' : 'transparent',
        transition: 'all 0.15s',
        marginBottom: 2,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = '#f3f4f6'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      <Icon size={18} color={active ? PRIMARY : '#6b7280'} />
      {label}
    </Link>
  )
}

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav style={{ flex: 1, padding: '8px 12px' }}>
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.href}
          {...item}
          active={
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          }
        />
      ))}
    </nav>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.href}
          {...item}
          active={
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          }
          mobile
        />
      ))}
    </nav>
  )
}

export function ProfileButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: 'calc(100% - 24px)',
        margin: '8px 12px',
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        background: '#f9fafb',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f3f4f6'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f9fafb'
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#00B4A6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <User size={16} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          My Profile
        </div>
        <div style={{ fontSize: 11, color: '#9ca3af' }}>View account</div>
      </div>
    </button>
  )
}
