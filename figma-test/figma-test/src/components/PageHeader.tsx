import { useRouter } from '../app/router'
import { screenMeta } from '../app/roles'

export default function PageHeader() {
  const { screen } = useRouter()
  const meta = screenMeta[screen]

  return (
    <header className="pagehead gutter">
      <div className="pagehead__titlerow">
        <h1 className="pagehead__title">{meta.title}</h1>
        <span className="pill">{meta.pill}</span>
      </div>
      <p className="pagehead__sub">{meta.subtitle}</p>
    </header>
  )
}
