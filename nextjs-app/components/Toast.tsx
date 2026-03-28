'use client'
import { useEffect } from 'react'
import type { Toast, ToastType } from '@/hooks/useToast'

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
}

const COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#f0fdf4', border: '#22c55e', icon: '#16a34a' },
  error: { bg: '#fef2f2', border: '#ef4444', icon: '#dc2626' },
  info: { bg: '#eff6ff', border: '#3b82f6', icon: '#2563eb' },
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) {
  const c = COLORS[toast.type]

  return (
    <div
      className="animate-slide-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 10,
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minWidth: 280,
        maxWidth: 400,
        cursor: 'pointer',
      }}
      onClick={() => onRemove(toast.id)}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: c.icon,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {ICONS[toast.type]}
      </span>
      <span style={{ fontSize: 14, color: '#374151', flex: 1 }}>{toast.message}</span>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[]
  onRemove: (id: string) => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9999,
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
