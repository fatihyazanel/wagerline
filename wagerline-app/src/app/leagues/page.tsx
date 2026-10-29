'use client'

import Footer from '@/components/Footer'
import { Calendar, Shield, Trophy, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Competition = { id:number; slug:string; name:string; country:string|null }
type Team = { id:number; slug:string; name:string; logo_url:string|null; roster_size:number }
type Standing = Team & { team_id:number;position:number;played:number;wins:number;draws:number;losses:number;goals_for:number;goals_against:number;goal_difference:number;points:number;team_name:string;team_slug:string;team_logo:string|null }
type Match = { id:number;start_time:string;status:string;round:number|null;home_team_name:string;away_team_name:string;home_score:number|null;away_score:number|null }
type Player = { id:number;name:string;position:string|null;shirt_number:number|null;image_url:string|null;nationality:string|null;date_of_birth:string|null }
type Overview = Competition & {
  season:{id:number;name:string}|null
  teams:Team[]
  standings:Standing[]
  matches:Match[]
  coverage:{teams:number;teams_with_rosters:number;players:number;matches:number}
}

const configuredApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const API_BASE = configuredApi.endsWith('/api/v1') ? configuredApi : `${configuredApi}/api/v1`

async function api<T>(path:string):Promise<T> {
  const response=await fetch(`${API_BASE}${path}`)
  if (!response.ok) throw new Error(`API ${response.status}: ${response.statusText}`)
  return response.json()
}

const cardStyle = { backgroundColor:'#0A1020',border:'1px solid #263149',borderRadius:'12px',padding:'18px' }

export default function LeaguesPage() {
  const [competitions,setCompetitions]=useState<Competition[]>([])
  const [selectedSlug,setSelectedSlug]=useState('')
  const [overview,setOverview]=useState<Overview|null>(null)
  const [selectedTeam,setSelectedTeam]=useState('')
  const [players,setPlayers]=useState<Player[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string|null>(null)

  useEffect(()=>{
    api<{data:Competition[]}>('/competitions?sport=football').then(response=>{
      setCompetitions(response.data)
      const initial=response.data.find(item=>item.slug==='super-lig')||response.data[0]
      setSelectedSlug(initial?.slug||'')
    }).catch(err=>setError(err.message)).finally(()=>setLoading(false))
  },[])

  useEffect(()=>{
    if (!selectedSlug) return
    setLoading(true); setError(null); setOverview(null); setPlayers([]); setSelectedTeam('')
    api<{data:Overview}>(`/competitions/${selectedSlug}/overview?lang=en`).then(response=>{
      setOverview(response.data)
      const first=response.data.teams.find(team=>Number(team.roster_size)>0)||response.data.teams[0]
      setSelectedTeam(first?.slug||'')
    }).catch(err=>setError(err.message)).finally(()=>setLoading(false))
  },[selectedSlug])

  useEffect(()=>{
    if (!selectedTeam) return
    api<{data:Team&{players:Player[]}}>(`/teams/${selectedTeam}/players?lang=en`)
      .then(response=>setPlayers(response.data.players)).catch(err=>setError(err.message))
  },[selectedTeam])

  const selectedTeamInfo=useMemo(()=>overview?.teams.find(team=>team.slug===selectedTeam),[overview,selectedTeam])
  const finishedMatches=overview?.matches.filter(match=>match.status==='finished')||[]
  const totalGoals=finishedMatches.reduce((sum,match)=>sum+(match.home_score||0)+(match.away_score||0),0)

  return <div style={{minHeight:'100vh',backgroundColor:'#050816',color:'#F7F8FC',fontFamily:'system-ui, sans-serif'}}>
    <header style={{position:'sticky',top:0,zIndex:50,backgroundColor:'rgba(5,8,22,.96)',borderBottom:'1px solid #263149',padding:'16px 32px'}}>
      <div style={{maxWidth:'1500px',margin:'0 auto',display:'flex',alignItems:'center',gap:'32px'}}>
        <a href="/" style={{fontSize:'18px',fontWeight:900,color:'#F7F8FC',textDecoration:'none'}}>WAGER<span style={{color:'#D4AF37'}}>line</span></a>
        <nav style={{display:'flex',gap:'24px'}}>{['Home','Live','Sports','Leagues','Predictions','News','Rewards'].map(item=><a key={item} href={item==='Home'?'/':`/${item.toLowerCase()}`} style={{fontSize:'12px',fontWeight:600,color:item==='Leagues'?'#D4AF37':'#A8B0C0',textDecoration:'none'}}>{item}</a>)}</nav>
      </div>
    </header>

    <section style={{background:'linear-gradient(135deg,#1A3A52,#111A2D)',borderBottom:'2px solid #D4AF37',padding:'42px 32px 28px'}}>
      <div style={{maxWidth:'1500px',margin:'0 auto'}}>
        <div style={{fontSize:'11px',fontWeight:800,color:'#D4AF37',letterSpacing:'2px'}}>LIVE DATABASE</div>
        <h1 style={{fontSize:'36px',margin:'8px 0'}}>League squads and results</h1>
        <p style={{color:'#A8B0C0',marginBottom:'24px'}}>Teams, current rosters, fixtures and calculated standings are loaded from the backend.</p>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>{competitions.map(competition=><button key={competition.id} onClick={()=>setSelectedSlug(competition.slug)} style={{padding:'10px 14px',borderRadius:'8px',border:'1px solid #263149',background:selectedSlug===competition.slug?'#D4AF37':'#0A1020',color:selectedSlug===competition.slug?'#050816':'#F7F8FC',fontWeight:700,cursor:'pointer'}}>{competition.name}</button>)}</div>
      </div>
    </section>

    <main style={{maxWidth:'1500px',margin:'0 auto',padding:'28px 32px 48px'}}>
      {loading&&<div style={cardStyle}>Loading backend data...</div>}
      {error&&<div style={{...cardStyle,borderColor:'#E53935',color:'#FF8A80'}}>Backend error: {error}</div>}
      {overview&&<>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:'20px',marginBottom:'20px',flexWrap:'wrap'}}>
          <div><h2 style={{fontSize:'28px',margin:0}}>{overview.name}</h2><div style={{fontSize:'12px',color:'#A8B0C0',marginTop:'5px'}}>{overview.country} · {overview.season?.name||'Current season'}</div></div>
          <div style={{fontSize:'11px',color:'#A8B0C0'}}>Standings are calculated from {finishedMatches.length} synced completed matches.</div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:'14px',marginBottom:'20px'}}>
          {[
            {label:'Teams',value:overview.coverage.teams,icon:<Shield size={18}/>},
            {label:'Teams with squads',value:overview.coverage.teams_with_rosters,icon:<Users size={18}/>},
            {label:'Linked players',value:overview.coverage.players,icon:<Users size={18}/>},
            {label:'Synced matches',value:overview.coverage.matches,icon:<Calendar size={18}/>},
            {label:'Goals',value:totalGoals,icon:<Trophy size={18}/>},
          ].map(item=><div key={item.label} style={cardStyle}><div style={{color:'#D4AF37'}}>{item.icon}</div><div style={{fontSize:'26px',fontWeight:800,marginTop:'8px'}}>{item.value}</div><div style={{fontSize:'11px',color:'#A8B0C0'}}>{item.label}</div></div>)}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'minmax(520px,1.4fr) minmax(360px,1fr)',gap:'20px',alignItems:'start'}}>
          <section style={cardStyle}>
            <h3 style={{fontSize:'14px',margin:'0 0 14px',color:'#D4AF37'}}>Standings</h3>
            <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
              <thead><tr style={{color:'#A8B0C0',borderBottom:'1px solid #263149'}}>{['#','Team','P','W','D','L','GF','GA','GD','Pts'].map(value=><th key={value} style={{padding:'9px 6px',textAlign:value==='Team'?'left':'center'}}>{value}</th>)}</tr></thead>
              <tbody>{overview.standings.map(row=><tr key={row.team_id} style={{borderBottom:'1px solid #182238'}}>
                <td style={{padding:'9px 6px',textAlign:'center',color:'#D4AF37'}}>{row.position}</td><td style={{padding:'9px 6px',fontWeight:700}}>{row.team_name}</td>
                {[row.played,row.wins,row.draws,row.losses,row.goals_for,row.goals_against,row.goal_difference,row.points].map((value,index)=><td key={index} style={{padding:'9px 6px',textAlign:'center',fontWeight:index===7?800:400,color:index===7?'#D4AF37':'inherit'}}>{value}</td>)}
              </tr>)}</tbody>
            </table></div>
          </section>

          <section style={cardStyle}>
            <h3 style={{fontSize:'14px',margin:'0 0 12px',color:'#D4AF37'}}>Team roster</h3>
            <select value={selectedTeam} onChange={event=>setSelectedTeam(event.target.value)} style={{width:'100%',background:'#111A2D',border:'1px solid #263149',borderRadius:'7px',padding:'10px',color:'#F7F8FC',marginBottom:'12px'}}>
              {overview.teams.map(team=><option key={team.id} value={team.slug}>{team.name} ({team.roster_size})</option>)}
            </select>
            <div style={{fontSize:'11px',color:'#A8B0C0',marginBottom:'10px'}}>{selectedTeamInfo?.name}: {players.length} players returned by backend</div>
            <div style={{display:'grid',gap:'7px',maxHeight:'590px',overflowY:'auto'}}>{players.map(player=><div key={player.id} style={{display:'grid',gridTemplateColumns:'38px 38px 1fr auto',gap:'9px',alignItems:'center',background:'#111A2D',borderRadius:'7px',padding:'7px 9px'}}>
              <div style={{width:'34px',height:'34px',borderRadius:'50%',overflow:'hidden',background:'#263149',display:'grid',placeItems:'center'}}>{player.image_url?<img src={player.image_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<Users size={16}/>}</div>
              <div style={{textAlign:'center',color:'#D4AF37',fontWeight:800}}>{player.shirt_number??'–'}</div>
              <div><div style={{fontSize:'12px',fontWeight:700}}>{player.name}</div><div style={{fontSize:'10px',color:'#A8B0C0'}}>{player.nationality||'Nationality unavailable'}</div></div>
              <div style={{fontSize:'10px',color:'#D4AF37',textAlign:'right'}}>{player.position||'N/A'}</div>
            </div>)}</div>
          </section>
        </div>

        <section style={{...cardStyle,marginTop:'20px'}}>
          <h3 style={{fontSize:'14px',margin:'0 0 14px',color:'#D4AF37'}}>Synced matches</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'10px'}}>{overview.matches.map(match=><div key={match.id} style={{background:'#111A2D',borderRadius:'8px',padding:'12px'}}>
            <div style={{fontSize:'10px',color:'#A8B0C0',marginBottom:'8px'}}>{new Date(match.start_time).toLocaleString()} · Round {match.round??'–'} · {match.status}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:'10px',alignItems:'center',fontSize:'12px',fontWeight:700}}><span>{match.home_team_name}</span><strong style={{color:'#D4AF37',fontSize:'16px'}}>{match.home_score??'–'} - {match.away_score??'–'}</strong><span style={{textAlign:'right'}}>{match.away_team_name}</span></div>
          </div>)}</div>
        </section>
      </>}
    </main>
    <Footer/>
  </div>
}
