const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:8000' 
  : 'https://portfolio-likith.onrender.com';

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
}

function detectOS(ua: string): string {
  if (ua.indexOf('Win') !== -1) return 'Windows';
  if (ua.indexOf('Mac') !== -1) return 'macOS';
  if (ua.indexOf('Linux') !== -1) return 'Linux';
  if (ua.indexOf('Android') !== -1) return 'Android';
  if (ua.indexOf('like Mac') !== -1) return 'iOS';
  return 'Unknown OS';
}

function detectBrowser(ua: string): string {
  if (ua.indexOf('Firefox') !== -1) return 'Firefox';
  if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) return 'Opera';
  if (ua.indexOf('Edge') !== -1 || ua.indexOf('Edg') !== -1) return 'Edge';
  if (ua.indexOf('Chrome') !== -1) return 'Chrome';
  if (ua.indexOf('Safari') !== -1) return 'Safari';
  return 'Unknown Browser';
}

function detectDevice(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

export async function trackVisit(path: string = window.location.pathname) {
  try {
    const ua = navigator.userAgent;
    const payload = {
      page_path: path,
      os_name: detectOS(ua),
      device_type: detectDevice(ua),
      browser_name: detectBrowser(ua),
      user_agent_summary: ua.substring(0, 500),
      referrer: document.referrer || 'Direct',
      session_id: getSessionId(),
    };

    const response = await fetch(`${API_BASE}/api/analytics/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('Analytics logging status:', response.status);
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
}
