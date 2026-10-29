'use client'

import { BarChart3, Users, Trophy, Flag, Zap, Newspaper, Award, Database, Activity, Settings, Sliders } from 'lucide-react'
import { useState } from 'react'

export default function Admin() {
  const [activeSection, setActiveSection] = useState('Dashboard')

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Users', icon: Users },
    { name: 'Sports', icon: Trophy },
    { name: 'Leagues', icon: Flag },
    { name: 'Matches', icon: Zap },
    { name: 'Predictions', icon: BarChart3 },
    { name: 'News', icon: Newspaper },
    { name: 'Rewards', icon: Award },
    { name: 'Data Sources', icon: Database },
    { name: 'API Health', icon: Activity },
    { name: 'System', icon: Settings },
    { name: 'Settings', icon: Sliders },
  ]

  const stats = [
    { label: 'Active Users', value: '24,582', trend: '+12%' },
    { label: 'Live Matches', value: '47', trend: '+8%' },
    { label: 'Total Predictions', value: '128,493', trend: '+25%' },
    { label: 'System Health', value: '99.9%', trend: 'Healthy' },
  ]

  const recentActivity = [
    { action: 'New user registration', time: '2 minutes ago', status: 'success' },
    { action: 'Match data updated', time: '5 minutes ago', status: 'success' },
    { action: 'Prediction engine running', time: '10 minutes ago', status: 'success' },
    { action: 'Data backup completed', time: '23 minutes ago', status: 'success' },
    { action: 'API health check', time: '1 hour ago', status: 'warning' },
  ]

  const apiEndpoints = [
    { endpoint: '/api/matches', status: 'Operational', latency: '45ms' },
    { endpoint: '/api/predictions', status: 'Operational', latency: '52ms' },
    { endpoint: '/api/news', status: 'Operational', latency: '38ms' },
    { endpoint: '/api/users', status: 'Operational', latency: '41ms' },
    { endpoint: '/api/leagues', status: 'Operational', latency: '36ms' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: '#F7F8FC', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
      {/* Sidebar */}
      <div style={{ backgroundColor: '#0A1020', borderRight: '1px solid #263149', padding: '24px 0', position: 'fixed', left: 0, top: 0, height: '100vh', width: '240px', overflowY: 'auto' }}>
        <div style={{ padding: '0 16px', marginBottom: '32px' }}>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>WAGER<span style={{ color: '#FFD400' }}>line</span></div>
          <div style={{ fontSize: '11px', color: '#A8B0C0', marginTop: '4px' }}>Admin Panel</div>
        </div>

        <nav style={{ display: 'grid', gap: '8px' }}>
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', width: '100%',
                  backgroundColor: activeSection === item.name ? '#111A2D' : 'transparent',
                  color: activeSection === item.name ? '#FFD400' : '#A8B0C0',
                  border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <Icon style={{ width: '18px', height: '18px' }} />
                {item.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', paddingTop: '24px', paddingRight: '32px', paddingBottom: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#FFD400', marginBottom: '8px' }}>{activeSection}</h1>
          <p style={{ fontSize: '14px', color: '#A8B0C0' }}>Manage and monitor all aspects of the WAGERline platform</p>
        </div>

        {activeSection === 'Dashboard' && (
          <div>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {stats.map((stat, idx) => (
                <div key={idx} style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#A8B0C0', marginBottom: '8px' }}>{stat.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFD400', marginBottom: '8px' }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: '#38BDF8' }}>{stat.trend}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity & API Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Recent Activity */}
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#F7F8FC' }}>Recent Activity</h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#F7F8FC' }}>{activity.action}</div>
                        <div style={{ fontSize: '11px', color: '#A8B0C0' }}>{activity.time}</div>
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: activity.status === 'success' ? '#38BDF8' : '#FFD400', backgroundColor: activity.status === 'success' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 212, 0, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Health */}
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#F7F8FC' }}>API Health Status</h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {apiEndpoints.map((api, idx) => (
                    <div key={idx} style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#F7F8FC' }}>{api.endpoint}</div>
                        <div style={{ fontSize: '11px', color: '#38BDF8' }}>{api.status}</div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#A8B0C0' }}>{api.latency}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Users' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>User management interface - Manage user accounts, permissions, and activities</div>
          </div>
        )}

        {activeSection === 'Sports' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>Sports management - Create, edit, and manage sports categories</div>
          </div>
        )}

        {activeSection === 'Leagues' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>League management - Manage leagues, divisions, and competitions</div>
          </div>
        )}

        {activeSection === 'Matches' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>Match management - Schedule, update, and manage matches and fixtures</div>
          </div>
        )}

        {activeSection === 'Predictions' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>Prediction engine management - Monitor AI predictions and model performance</div>
          </div>
        )}

        {activeSection === 'News' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>News management - Create, edit, and publish news articles</div>
          </div>
        )}

        {activeSection === 'Rewards' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>Rewards system - Manage points, badges, levels, and user achievements</div>
          </div>
        )}

        {activeSection === 'Data Sources' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>Data sources - Configure and manage external data integrations</div>
          </div>
        )}

        {activeSection === 'API Health' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>API Health monitoring - Track endpoint status, latency, and performance metrics</div>
          </div>
        )}

        {activeSection === 'System' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>System administration - Server logs, backups, and maintenance tools</div>
          </div>
        )}

        {activeSection === 'Settings' && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#A8B0C0' }}>Platform settings - Configure features, notifications, and system preferences</div>
          </div>
        )}
      </div>
    </div>
  )
}
