"use client";
import React, { useState, useEffect } from 'react';

interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
  error?: boolean;
  reason?: string;
}

const IpDetector = () => {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState('');

  const fetchIpInfo = async (ip: string = '') => {
    setIsLoading(true);
    setError(null);
    setIpInfo(null);
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.reason || 'Could not fetch IP information.');
      }
      const data: IpInfo = await response.json();
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address.');
      }
      setIpInfo(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>IP Address Information</h3>
      <div className="form-group">
        <label htmlFor="ipAddress" className="form-label">IP Address (leave empty for your IP)</label>
        <input type="text" id="ipAddress" className="prompt-input" style={{ minHeight: 'auto', padding: '15px' }} placeholder="Enter IP address or leave empty..." value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
      </div>
      <button className="generate-btn" onClick={() => fetchIpInfo(ipAddress)} disabled={isLoading}>
        <span className="btn-icon">🌐</span>
        {isLoading ? 'Fetching...' : 'Get IP Information'}
      </button>
      {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span>{error}</span></div>}
      {ipInfo && (
        <div id="ipResult" style={{ marginTop: '20px' }}>
          <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>🌐 IP Information</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div><strong style={{ color: 'var(--accent-purple)' }}>IP Address:</strong> <span style={{ color: 'var(--text-light)' }}>{ipInfo.ip}</span></div>
              <div><strong style={{ color: 'var(--accent-purple)' }}>Location:</strong> <span style={{ color: 'var(--text-light)' }}>{ipInfo.city}, {ipInfo.region}, {ipInfo.country_name}</span></div>
              <div><strong style={{ color: 'var(--accent-purple)' }}>ISP:</strong> <span style={{ color: 'var(--text-light)' }}>{ipInfo.org}</span></div>
              <div><strong style={{ color: 'var(--accent-purple)' }}>Timezone:</strong> <span style={{ color: 'var(--text-light)' }}>{ipInfo.timezone}</span></div>
              {ipInfo.latitude && ipInfo.longitude && <div><strong style={{ color: 'var(--accent-purple)' }}>Coordinates:</strong> <span style={{ color: 'var(--text-light)' }}>{ipInfo.latitude}, {ipInfo.longitude}</span></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IpDetector;
