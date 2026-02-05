import { useState, useEffect } from 'react';

const OpeclawChannelsPanel = ({ darkMode = true }) => {
  const [channels, setChannels] = useState([]);
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
    warning: "#E76F8B",
    error: "#dc3545"
  } : {
    bg: "#F7F8FA",
    card: "#FFFFFF",
    accent: "#F4A261",
    text: "#111827",
    subtext: "#6B7280",
    success: "#34A853",
    warning: "#E76F8B",
    error: "#dc3545"
  };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/openclaw/channels');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setChannels(Array.isArray(data) ? data : data.channels || []);
        setError(null);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch Openclaw channels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();

    // Auto-refresh every 45 seconds
    const interval = setInterval(fetchChannels, 45000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'connected': return colors.success;
      case 'disconnected': return colors.error;
      case 'connecting': return colors.warning;
      case 'error': return colors.error;
      default: return colors.subtext;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'connected': return '✅';
      case 'disconnected': return '❌';
      case 'connecting': return '🔄';
      case 'error': return '⚠️';
      default: return '❓';
    }
  };

  const getChannelTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'discord': return '👾';
      case 'telegram': return '✈️';
      case 'slack': return '💬';
      case 'whatsapp': return '📱';
      case 'email': return '📧';
      default: return '💭';
    }
  };

  const formatLastActivity = (timestamp) => {
    if (!timestamp) return 'No activity';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const connectedChannels = channels.filter(ch => ch.status?.toLowerCase() === 'connected');
  const errorChannels = channels.filter(ch => ch.status?.toLowerCase() === 'error' || ch.status?.toLowerCase() === 'disconnected');

  if (loading && channels.length === 0) {
    return (
      <div style={{
        background: colors.card,
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${colors.subtext}20`
      }}>
        <h3 style={{ color: colors.text, margin: '0 0 16px 0', fontSize: '18px' }}>
          📡 Channels
        </h3>
        <div style={{ color: colors.subtext, fontSize: '14px' }}>
          Loading channels...
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
          📡 Channels
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
          📡 Channels
        </h3>
        <div style={{
          color: colors.subtext,
          fontSize: '12px',
          opacity: 0.7
        }}>
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Channel stats */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          background: colors.bg,
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <span style={{ color: colors.success }}>✅ {connectedChannels.length}</span>
          <span style={{ color: colors.subtext, marginLeft: '4px' }}>connected</span>
        </div>

        {errorChannels.length > 0 && (
          <div style={{
            background: colors.bg,
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <span style={{ color: colors.error }}>❌ {errorChannels.length}</span>
            <span style={{ color: colors.subtext, marginLeft: '4px' }}>error</span>
          </div>
        )}

        <div style={{
          background: colors.bg,
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <span style={{ color: colors.text }}>{channels.length}</span>
          <span style={{ color: colors.subtext, marginLeft: '4px' }}>total</span>
        </div>
      </div>

      {channels.length === 0 ? (
        <div style={{
          color: colors.subtext,
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          No channels configured
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {channels.slice(0, 6).map((channel, i) => (
            <div
              key={channel.id || i}
              style={{
                background: colors.bg,
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${getStatusColor(channel.status)}20`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>
                    {getChannelTypeIcon(channel.type)}
                  </span>
                  <div>
                    <div style={{
                      color: colors.text,
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '2px'
                    }}>
                      {channel.name || channel.id || 'Unnamed Channel'}
                    </div>
                    <div style={{
                      color: colors.subtext,
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {channel.type || 'Unknown'} Channel
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '12px' }}>
                    {getStatusIcon(channel.status)}
                  </span>
                  <span style={{
                    color: getStatusColor(channel.status),
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {channel.status || 'Unknown'}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '11px',
                color: colors.subtext
              }}>
                <div>
                  <span style={{ opacity: 0.7 }}>Messages:</span><br />
                  <span style={{ color: colors.text, fontWeight: '500' }}>
                    {channel.messageCount?.toLocaleString() || '0'}
                  </span>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Last activity:</span><br />
                  <span>{formatLastActivity(channel.lastMessage || channel.lastActivity)}</span>
                </div>
              </div>

              {channel.error && (
                <div style={{
                  marginTop: '8px',
                  background: `${colors.error}10`,
                  padding: '6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: colors.error
                }}>
                  ⚠️ {channel.error}
                </div>
              )}
            </div>
          ))}

          {channels.length > 6 && (
            <div style={{
              color: colors.subtext,
              fontSize: '12px',
              textAlign: 'center',
              padding: '8px'
            }}>
              +{channels.length - 6} more channels
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpeclawChannelsPanel;