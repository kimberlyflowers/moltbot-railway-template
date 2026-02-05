import { useState, useEffect } from 'react';

const OpeclawHealthPanel = ({ darkMode = true }) => {
  const [health, setHealth] = useState(null);
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
    const fetchHealth = async () => {
      try {
        setLoading(true);

        // Try multiple endpoints for health data
        const endpoints = ['/api/openclaw/health', '/api/openclaw/status', '/api/openclaw/overview'];
        let healthData = null;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint);
            if (response.ok) {
              healthData = await response.json();
              break;
            }
          } catch (err) {
            console.log(`Endpoint ${endpoint} failed:`, err);
          }
        }

        if (healthData) {
          setHealth(healthData);
          setError(null);
        } else {
          throw new Error('All health endpoints unavailable');
        }

        setLastUpdate(new Date());
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch Openclaw health:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    if (!seconds) return 'Unknown';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatMemory = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = Math.round(bytes / 1024 / 1024);
    return `${mb} MB`;
  };

  const getHealthStatus = () => {
    if (!health) return { status: 'unknown', color: colors.subtext, icon: '❓' };

    const status = health.status?.toLowerCase();
    switch (status) {
      case 'running':
      case 'healthy':
      case 'ok':
        return { status: 'Healthy', color: colors.success, icon: '✅' };
      case 'degraded':
      case 'warning':
        return { status: 'Degraded', color: colors.warning, icon: '⚠️' };
      case 'error':
      case 'unhealthy':
        return { status: 'Error', color: colors.error, icon: '❌' };
      default:
        return { status: 'Unknown', color: colors.subtext, icon: '❓' };
    }
  };

  const getCpuColor = (usage) => {
    if (!usage) return colors.subtext;
    if (usage > 80) return colors.error;
    if (usage > 60) return colors.warning;
    return colors.success;
  };

  const getMemoryColor = (used, total) => {
    if (!used || !total) return colors.subtext;
    const percentage = (used / total) * 100;
    if (percentage > 85) return colors.error;
    if (percentage > 70) return colors.warning;
    return colors.success;
  };

  if (loading && !health) {
    return (
      <div style={{
        background: colors.card,
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${colors.subtext}20`
      }}>
        <h3 style={{ color: colors.text, margin: '0 0 16px 0', fontSize: '18px' }}>
          💚 System Health
        </h3>
        <div style={{ color: colors.subtext, fontSize: '14px' }}>
          Loading system status...
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
          💚 System Health
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

  const healthStatus = getHealthStatus();

  return (
    <div style={{
      background: colors.card,
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${healthStatus.color}20`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ color: colors.text, margin: 0, fontSize: '18px' }}>
          💚 System Health
        </h3>
        <div style={{
          color: colors.subtext,
          fontSize: '12px',
          opacity: 0.7
        }}>
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Overall status */}
      <div style={{
        background: `${healthStatus.color}10`,
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        border: `1px solid ${healthStatus.color}30`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>{healthStatus.icon}</span>
          <span style={{
            color: healthStatus.color,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {healthStatus.status}
          </span>
          {health?.version && (
            <span style={{
              color: colors.subtext,
              fontSize: '12px',
              marginLeft: '8px'
            }}>
              v{health.version}
            </span>
          )}
        </div>
      </div>

      {/* System metrics grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* Uptime */}
        <div style={{
          background: colors.bg,
          padding: '12px',
          borderRadius: '8px'
        }}>
          <div style={{
            color: colors.subtext,
            fontSize: '11px',
            opacity: 0.7,
            marginBottom: '4px'
          }}>
            UPTIME
          </div>
          <div style={{
            color: colors.text,
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {formatUptime(health?.uptime)}
          </div>
        </div>

        {/* Active Sessions */}
        <div style={{
          background: colors.bg,
          padding: '12px',
          borderRadius: '8px'
        }}>
          <div style={{
            color: colors.subtext,
            fontSize: '11px',
            opacity: 0.7,
            marginBottom: '4px'
          }}>
            ACTIVE SESSIONS
          </div>
          <div style={{
            color: colors.text,
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {health?.activeSessions || health?.activeInstances || 0}
          </div>
        </div>

        {/* CPU Usage */}
        {health?.cpu?.usage !== undefined && (
          <div style={{
            background: colors.bg,
            padding: '12px',
            borderRadius: '8px'
          }}>
            <div style={{
              color: colors.subtext,
              fontSize: '11px',
              opacity: 0.7,
              marginBottom: '4px'
            }}>
              CPU USAGE
            </div>
            <div style={{
              color: getCpuColor(health.cpu.usage),
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {health.cpu.usage.toFixed(1)}%
            </div>
          </div>
        )}

        {/* Memory Usage */}
        {health?.memory && (
          <div style={{
            background: colors.bg,
            padding: '12px',
            borderRadius: '8px'
          }}>
            <div style={{
              color: colors.subtext,
              fontSize: '11px',
              opacity: 0.7,
              marginBottom: '4px'
            }}>
              MEMORY
            </div>
            <div style={{
              color: getMemoryColor(health.memory.used, health.memory.total),
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {health.memory.total
                ? `${formatMemory(health.memory.used)} / ${formatMemory(health.memory.total)}`
                : formatMemory(health.memory.used)}
            </div>
          </div>
        )}
      </div>

      {/* Quick stats */}
      {(health?.activeInstances || health?.totalRequests || health?.errorRate !== undefined) && (
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          color: colors.subtext,
          flexWrap: 'wrap'
        }}>
          {health.activeInstances && (
            <span>🔄 {health.activeInstances} instances</span>
          )}
          {health.totalRequests && (
            <span>📊 {health.totalRequests.toLocaleString()} requests</span>
          )}
          {health.errorRate !== undefined && (
            <span style={{ color: health.errorRate > 5 ? colors.error : colors.success }}>
              ⚠️ {health.errorRate.toFixed(2)}% errors
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default OpeclawHealthPanel;