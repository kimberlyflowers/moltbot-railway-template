import { useState, useEffect } from 'react';

const OpeclawSessionsPanel = ({ darkMode = true }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const colors = darkMode ? {
    bg: "#1a1a1a",
    card: "#262626",
    accent: "#F4A261",
    text: "#ececec",
    subtext: "#a0a0a0",
    success: "#34A853",
    warning: "#E76F8B"
  } : {
    bg: "#F7F8FA",
    card: "#FFFFFF",
    accent: "#F4A261",
    text: "#111827",
    subtext: "#6B7280",
    success: "#34A853",
    warning: "#E76F8B"
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/openclaw/sessions');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSessions(Array.isArray(data) ? data : data.sessions || []);
        setError(null);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch Openclaw sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return colors.success;
      case 'idle': return colors.warning;
      case 'disconnected': return colors.subtext;
      default: return colors.subtext;
    }
  };

  const formatDuration = (startTime) => {
    if (!startTime) return 'Unknown';
    const now = new Date();
    const start = new Date(startTime);
    const diff = Math.floor((now - start) / 1000 / 60); // minutes

    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading && sessions.length === 0) {
    return (
      <div style={{
        background: colors.card,
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${colors.subtext}20`
      }}>
        <h3 style={{ color: colors.text, margin: '0 0 16px 0', fontSize: '18px' }}>
          🌐 Active Sessions
        </h3>
        <div style={{ color: colors.subtext, fontSize: '14px' }}>
          Loading sessions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: colors.card,
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${colors.warning}40`
      }}>
        <h3 style={{ color: colors.text, margin: '0 0 16px 0', fontSize: '18px' }}>
          🌐 Active Sessions
        </h3>
        <div style={{
          color: colors.warning,
          fontSize: '14px',
          background: `${colors.warning}10`,
          padding: '12px',
          borderRadius: '8px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Connection Error</div>
          <div style={{ opacity: 0.8 }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: colors.card,
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${colors.subtext}20`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ color: colors.text, margin: 0, fontSize: '18px' }}>
          🌐 Active Sessions
        </h3>
        <div style={{
          color: colors.subtext,
          fontSize: '12px',
          opacity: 0.7
        }}>
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {sessions.length === 0 ? (
        <div style={{
          color: colors.subtext,
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          No active sessions
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sessions.slice(0, 5).map((session, i) => (
            <div
              key={session.id || i}
              style={{
                background: colors.bg,
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${colors.subtext}20`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div>
                  <div style={{
                    color: colors.text,
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {session.user || session.userId || 'Unknown User'}
                  </div>
                  <div style={{
                    color: colors.subtext,
                    fontSize: '12px'
                  }}>
                    Channel: {session.channel || 'Unknown'}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getStatusColor(session.status)
                    }}
                  />
                  <span style={{
                    color: colors.subtext,
                    fontSize: '12px'
                  }}>
                    {session.status || 'unknown'}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: colors.subtext
              }}>
                <span>Duration: {formatDuration(session.startTime)}</span>
                <span>Messages: {session.messageCount || 0}</span>
              </div>
            </div>
          ))}

          {sessions.length > 5 && (
            <div style={{
              color: colors.subtext,
              fontSize: '12px',
              textAlign: 'center',
              padding: '8px'
            }}>
              +{sessions.length - 5} more sessions
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpeclawSessionsPanel;