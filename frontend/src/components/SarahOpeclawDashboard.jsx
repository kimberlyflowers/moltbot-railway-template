import { useState } from 'react';
import OpeclawHealthPanel from './OpeclawHealthPanel';
import OpeclawSessionsPanel from './OpeclawSessionsPanel';
import OpeclawLogsPanel from './OpeclawLogsPanel';
import OpeclawChannelsPanel from './OpeclawChannelsPanel';
import OpeclawCronPanel from './OpeclawCronPanel';

const SarahOpeclawDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);

  const colors = darkMode ? {
    bg: "#1a1a1a",
    text: "#ececec",
    subtext: "#a0a0a0",
    accent: "#F4A261",
    success: "#34A853"
  } : {
    bg: "#F7F8FA",
    text: "#111827",
    subtext: "#6B7280",
    accent: "#F4A261",
    success: "#34A853"
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            color: colors.text,
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            🌸 Sarah's OpenClaw Dashboard
          </h1>
          <p style={{
            color: colors.subtext,
            fontSize: '16px',
            margin: 0
          }}>
            Real-time monitoring and management for OpenClaw AI services
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: darkMode ? '#2a2a2a' : '#e5e7eb',
              color: colors.text,
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {darkMode ? '🌞' : '🌙'} {darkMode ? 'Light' : 'Dark'} Mode
          </button>

          <div style={{
            background: colors.success + '20',
            color: colors.success,
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ✅ Connected
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gridAutoRows: 'min-content'
      }}>
        {/* Top row - Health and Sessions (most important) */}
        <OpeclawHealthPanel darkMode={darkMode} />
        <OpeclawSessionsPanel darkMode={darkMode} />

        {/* Second row - Channels and Logs */}
        <OpeclawChannelsPanel darkMode={darkMode} />
        <OpeclawLogsPanel darkMode={darkMode} />

        {/* Third row - Cron (spans full width if space available) */}
        <div style={{ gridColumn: '1 / -1' }}>
          <OpeclawCronPanel darkMode={darkMode} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: `1px solid ${colors.subtext}20`,
        textAlign: 'center'
      }}>
        <p style={{
          color: colors.subtext,
          fontSize: '12px',
          margin: 0,
          opacity: 0.7
        }}>
          Sarah's OpenClaw Dashboard • Real-time AI service monitoring •
          <span style={{ color: colors.accent, marginLeft: '4px' }}>Built with ❤️ by Claude</span>
        </p>
      </div>
    </div>
  );
};

export default SarahOpeclawDashboard;