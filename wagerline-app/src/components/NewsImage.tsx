'use client'

import { useState, type CSSProperties } from 'react'
import { Newspaper } from 'lucide-react'

export default function NewsImage({ src, alt, style, className }: { src: string; alt: string; style: CSSProperties; className?: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  if (!src || failedSource === src) {
    return <div className={className} role="img" aria-label={alt} style={{ ...style, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #edf4ff, #f7faff)', color: '#7295c5' }}><Newspaper size={40} strokeWidth={1.2} aria-hidden="true" /></div>
  }
  return <img className={className} src={src} alt={alt} style={style} onError={() => setFailedSource(src)} />
}
