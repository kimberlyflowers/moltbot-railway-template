import { useState, useEffect } from 'react';

const OpeclawLogsPanel = ({ darkMode = true }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [filter, setFilter] = useState('all'); // all, error, warning, info

  const colors = darkMode ? {
    bg: "#1a1a1a",
    card: "#262626",
    accent: "#F4A261",
    text: "#ececec",
    subtext: "#a0a0a0",
    success: "#34A853",
    warning: "#E76F8B",
    error: "#dc3545",
    info: "#17a2b8"
  } : {
    bg: "#F7F8FA",
    card: "#FFFFFF",
    accent: "#F4A261",
    text: "#111827",
    subtext: "#6B7280",
    success: "#34A853",
    warning: "#E76F8B",
    error: "#dc3545",
    info: "#17a2b8"
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/openclaw/logs');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setLogs(Array.isArray(data) ? data : data.logs || []);
        setError(null);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch Openclaw logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    // Auto-refresh every 15 seconds for logs
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return colors.error;
      case 'warning':
      case 'warn': return colors.warning;
      case 'info': return colors.info;
      case 'debug': return colors.subtext;
      default: return colors.text;
    }
  };

  const getLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return '🚨';
      case 'warning':
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level?.toLowerCase() === filter;
  });

  const errorCount = logs.filter(log => log.level?.toLowerCase() === 'error').length;
  const warningCount = logs.filter(log => log.level?.toLowerCase() === 'warning' || log.level?.toLowerCase() === 'warn').length;

  if (loading && logs.length === 0) {
    return (
      <div style={{
        background: colors.card,
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${colors.subtext}20`
      }}>
        <h3 style={{ color: colors.text, margin: '0 0 16px 0', fontSize: '18px' }}>
          📋 System Logs
        </h3>
        <div style={{ color: colors.subtext, fontSize: '14px' }}>
          Loading logs...
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
          📋 System Logs
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
          📋 System Logs
        </h3>
        <div style={{
          color: colors.subtext,
          fontSize: '12px',
          opacity: 0.7
        }}>
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats and filter */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <span style={{ color: colors.error, fontSize: '14px' }}>
            🚨 {errorCount}
          </span>
          <span style={{ color: colors.warning, fontSize: '14px' }}>
            ⚠️ {warningCount}
          </span>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.subtext}40`,
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '12px',
            outline: 'none'
          }}
        >
          <option value="all">All Logs</option>
          <option value="error">Errors Only</option>
          <option value="warning">Warnings Only</option>
          <option value="info">Info Only</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <div style={{
          color: colors.subtext,
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          No logs found
        </div>
      ) : (
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {filteredLogs.slice(0, 20).map((log, i) => (
            <div
              key={i}
              style={{
                background: colors.bg,
                padding: '10px',
                borderRadius: '6px',
                border: `1px solid ${getLevelColor(log.level)}20`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '12px' }}>
                    {getLevelIcon(log.level)}
                  </span>
                  <span style={{
                    color: getLevelColor(log.level),
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {log.level || 'INFO'}
                  </span>
                  {log.source && (
                    <span style={{
                      color: colors.subtext,
                      fontSize: '11px',
                      opacity: 0.7
                    }}>
                      [{log.source}]
                    </span>
                  )}
                </div>
                <span style={{
                  color: colors.subtext,
                  fontSize: '11px'
                }}>
                  {formatTimestamp(log.timestamp)}
                </span>
              </div>

              <div style={{
                color: colors.text,
                fontSize: '13px',
                lineHeight: '1.4',
                wordBreak: 'break-word'
              }}>
                {log.message}
              </div>

              {log.details && (
                <div style={{
                  marginTop: '6px',
                  background: colors.subtext + '10',
                  padding: '6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: colors.subtext,
                  fontFamily: 'monospace'
                }}>
                  {typeof log.details === 'object'
                    ? JSON.stringify(log.details, null, 2)
                    : log.details}
                </div>
              )}
            </div>
          ))}

          {filteredLogs.length > 20 && (
            <div style={{
              color: colors.subtext,
              fontSize: '12px',
              textAlign: 'center',
              padding: '8px'
            }}>
              +{filteredLogs.length - 20} more log entries
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpeclawLogsPanel;