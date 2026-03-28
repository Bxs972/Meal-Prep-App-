'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export function ImageUpload({
  value,
  onChange,
  userId,
}: {
  value: string | null
  onChange: (url: string | null) => void
  userId: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setError('')
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path)

    onChange(publicUrl)
    setUploading(false)
  }

  const handleRemove = async () => {
    if (!value) return
    const supabase = createClient()
    const path = value.split('/recipe-images/')[1]
    if (path) {
      await supabase.storage.from('recipe-images').remove([path])
    }
    onChange(null)
  }

  return (
    <div>
      {value ? (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 220 }}>
          <img
            src={value}
            alt="Recipe"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(0,0,0,0.6)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: 12,
            height: 160,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: uploading ? '#f9fafb' : '#fff',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!uploading) {
              e.currentTarget.style.borderColor = '#00B4A6'
              e.currentTarget.style.background = '#f0fdfc'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db'
            e.currentTarget.style.background = '#fff'
          }}
        >
          {uploading ? (
            <>
              <div className="spinner" style={{ borderTopColor: '#00B4A6', borderColor: 'rgba(0,180,166,0.2)', width: 28, height: 28 }} />
              <span style={{ fontSize: 13, color: '#6b7280' }}>Uploading...</span>
            </>
          ) : (
            <>
              <div style={{ padding: 12, borderRadius: '50%', background: '#e6f7f6' }}>
                <Upload size={22} color="#00B4A6" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Click to upload photo</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>PNG, JPG up to 5MB</div>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p style={{ marginTop: 6, fontSize: 12, color: '#dc2626' }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />
    </div>
  )
}
