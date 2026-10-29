import { useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { provinceToRegion, type RegionName } from '../turkeyRegions'
import { regionRows } from '../data'

// Province GeoJSON (81 il) lives in public/. No external CDN dependency.
const GEO_URL = '/turkey.geojson'

const parseScore = (s: string) => parseFloat(s.replace('%', '').replace(',', '.'))

// region name -> numeric score, from the dashboard data
const regionScore = regionRows.reduce<Record<string, number>>((acc, r) => {
  acc[r.region] = parseScore(r.score)
  return acc
}, {})

const scores = Object.values(regionScore)
const minScore = Math.min(...scores)
const maxScore = Math.max(...scores)

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)

// light lavender (#E9E5FB) -> brand indigo (#5B43E8), matching the design palette
function scoreColor(score: number | undefined): string {
  if (score === undefined) return '#ececf3'
  const t = maxScore > minScore ? (score - minScore) / (maxScore - minScore) : 0.5
  return `rgb(${lerp(233, 91, t)}, ${lerp(229, 67, t)}, ${lerp(251, 232, t)})`
}

interface Tip {
  x: number
  y: number
  province: string
  region: RegionName | null
}

export default function TurkeyMap() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<Tip | null>(null)
  const [hoverRegion, setHoverRegion] = useState<RegionName | null>(null)

  const pointFromEvent = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    return { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) }
  }

  return (
    <div className="turkeymap" ref={wrapRef}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [35.4, 39.0], scale: 2050 }}
        width={680}
        height={290}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const name: string = geo.properties?.name ?? ''
              const region = provinceToRegion[name] ?? null
              const score = region ? regionScore[region] : undefined
              const isHover = !!region && region === hoverRegion
              const fill = isHover ? '#4f39f6' : scoreColor(score)
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#ffffff"
                  strokeWidth={0.6}
                  style={{
                    default: { outline: 'none', cursor: region ? 'pointer' : 'default' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={(e: React.MouseEvent) => {
                    setHoverRegion(region)
                    setTip({ ...pointFromEvent(e), province: name, region })
                  }}
                  onMouseMove={(e: React.MouseEvent) =>
                    setTip((t) => (t ? { ...t, ...pointFromEvent(e) } : t))
                  }
                  onMouseLeave={() => {
                    setHoverRegion(null)
                    setTip(null)
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {tip && (
        <div className="turkeymap__tip" style={{ left: tip.x + 14, top: tip.y + 14 }}>
          <div className="turkeymap__tip-province">{tip.province}</div>
          {tip.region ? (
            <>
              <div className="turkeymap__tip-region">{tip.region}</div>
              <div className="turkeymap__tip-score">
                Ort. Puan: <strong>%{regionScore[tip.region].toFixed(1)}</strong>
              </div>
            </>
          ) : (
            <div className="turkeymap__tip-empty">Bölge tanımlı değil</div>
          )}
        </div>
      )}
    </div>
  )
}
