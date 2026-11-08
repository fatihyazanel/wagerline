export default function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><div className="content-width"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>
}
