const marks = new Set(['home','live','sports','leagues','predictions','news','rewards','shop','all','football','basketball','american-football','ice-hockey','formula-1','baseball','tennis'])
export default function SportMark({name,size=22}:{name:string;size?:number}){
 const key=marks.has(name)?name:'all'
 return <span className={`sport-mark sport-mark-${key}`} aria-hidden="true"><img src={`/menu-icons/${key}.svg`} alt="" width={size} height={size} draggable={false}/></span>
}
