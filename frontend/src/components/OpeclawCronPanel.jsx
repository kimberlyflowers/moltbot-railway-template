import { useState, useEffect } from 'react';

const OpeclawCronPanel = ({ darkMode = true }) => {
  const [jobs, setJobs] = useState([]);
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
    const fetchCronJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/openclaw/cron');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setJobs(Array.isArray(data) ? data : data.jobs || []);
        setError(null);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch Openclaw cron jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCronJobs();

    // Auto-refresh every 60 seconds for cron jobs
    const interval = setInterval(fetchCronJobs, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return colors.success;
      case 'running': return colors.accent;
      case 'error':
      case 'failed': return colors.error;
      case 'disabled': return colors.subtext;
      default: return colors.subtext;
    }
  };

  const getStatusIcon = (status, enabled) => {
    if (!enabled) return '⏸️';
    switch (status?.toLowerCase()) {
      case 'success': return '✅';
      case 'running': return '🔄';
      case 'error':
      case 'failed': return '❌';
      default: return '⏱️';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Unknown';
    const date = new Date(timeStr);
    return date.toLocaleString();
  };

  const formatNextRun = (nextRun) => {
    if (!nextRun) return 'Not scheduled';
    const date = new Date(nextRun);
    const now = new Date();
    const diff = Math.floor((date - now) / 1000 / 60); // minutes

    if (diff < 0) return 'Overdue';
    if (diff < 60) return `In ${diff}m`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `In ${hours}h`;
    const days = Math.floor(hours / 24);
    return `In ${days}d`;
  };

  const enabledJobs = jobs.filter(job => job.enabled !== false);
  const runningJobs = jobs.filter(job => job.status?.toLowerCase() === 'running');
  const errorJobs = jobs.filter(job => job.status?.toLowerCase() === 'error' || job.status?.toLowerCase() === 'failed');

  if (loading && jobs.length === 0) {
    return (
      <div style={{
        background: colors.card,
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${colors.subtext}20`
      }}>
        <h3 style={{ color: colors.text, margin: '0 0 16px 0', fontSize: '18px' }}>
          ⏰ Automation Jobs
        </h3>
        <div style={{ color: colors.subtext, fontSize: '14px' }}>
          Loading cron jobs...
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
          ⏰ Automation Jobs
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
          ⏰ Automation Jobs
        </h3>
        <div style={{
          color: colors.subtext,
          fontSize: '12px',
          opacity: 0.7
        }}>
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Job stats */}
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
          <span style={{ color: colors.success }}>✅ {enabledJobs.length}</span>
          <span style={{ color: colors.subtext, marginLeft: '4px' }}>enabled</span>
        </div>

        {runningJobs.length > 0 && (
          <div style={{
            background: colors.bg,
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <span style={{ color: colors.accent }}>🔄 {runningJobs.length}</span>
            <span style={{ color: colors.subtext, marginLeft: '4px' }}>running</span>
          </div>
        )}

        {errorJobs.length > 0 && (
          <div style={{
            background: colors.bg,
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <span style={{ color: colors.error }}>❌ {errorJobs.length}</span>
            <span style={{ color: colors.subtext, marginLeft: '4px' }}>failed</span>
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <div style={{
          color: colors.subtext,
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          No automation jobs configured
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {jobs.slice(0, 6).map((job, i) => (
            <div
              key={job.id || i}
              style={{
                background: colors.bg,
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${getStatusColor(job.status)}20`
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
                    {job.name || job.id || 'Unnamed Job'}
                  </div>
                  <div style={{
                    color: colors.subtext,
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    {job.schedule || 'No schedule'}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '14px' }}>
                    {getStatusIcon(job.status, job.enabled)}
                  </span>
                  <span style={{
                    color: getStatusColor(job.status),
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {job.enabled === false ? 'Disabled' : (job.status || 'Unknown')}
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
                  <span style={{ opacity: 0.7 }}>Last run:</span><br />
                  <span>{job.lastRun ? formatTime(job.lastRun) : 'Never'}</span>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Next run:</span><br />
                  <span>{formatNextRun(job.nextRun)}</span>
                </div>
              </div>
            </div>
          ))}

          {jobs.length > 6 && (
            <div style={{
              color: colors.subtext,
              fontSize: '12px',
              textAlign: 'center',
              padding: '8px'
            }}>
              +{jobs.length - 6} more jobs
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpeclawCronPanel;