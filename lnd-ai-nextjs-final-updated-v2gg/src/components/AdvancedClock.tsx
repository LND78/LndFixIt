"use client";
import React, { useState, useEffect } from 'react';

interface Timezone {
  name: string;
  tz: string;
}

const timezones: Timezone[] = [
  { name: 'India', tz: 'Asia/Kolkata' },
  { name: 'New York', tz: 'America/New_York' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'Moscow', tz: 'Europe/Moscow' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
];

const AdvancedClock = () => {
  const [localTime, setLocalTime] = useState(new Date());
  const [localTimezone, setLocalTimezone] = useState<string>('Asia/Kolkata');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserTimezone = async () => {
      try {
        const response = await fetch('/api/ip-info');
        const data = await response.json();
        if (data.timezone) {
          setLocalTimezone(data.timezone);
        }
      } catch (error) {
        console.error("Failed to fetch user's timezone", error);
        // Keep IST as fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserTimezone();
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    return date.toLocaleTimeString('en-US', { timeZone, hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date, timeZone: string) => {
    return date.toLocaleDateString('en-US', { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Advanced Day & Time</h3>
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Fetching your timezone...</div>
        </div>
      ) : (
        <>
          {localTimezone && (
             <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginBottom: '30px' }}>
                <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>Your Local Time ({localTimezone.replace('_', ' ')})</h4>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-purple)', textAlign: 'center'}}>{formatTime(localTime, localTimezone)}</div>
                <div style={{textAlign: 'center', color: 'var(--text-muted)'}}>{formatDate(localTime, localTimezone)}</div>
            </div>
          )}
          <div className="tools-grid">
            {timezones.map(({ name, tz }) => (
              <div key={name} className="tool-card" style={{cursor: 'default'}}>
                <h3 className="tool-title">{name}</h3>
                <p style={{fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-light)'}}>{formatTime(localTime, tz)}</p>
                <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>{formatDate(localTime, tz)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedClock;
