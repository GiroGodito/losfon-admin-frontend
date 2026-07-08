// src/utils/fingerprint.ts
export interface DeviceFingerprint {
  canvas: string;
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  colorDepth: number;
  touchSupport: boolean;
}

export async function getDeviceFingerprint(): Promise<DeviceFingerprint> {
  let canvasFingerprint = 'fallback';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.font = '18px Times New Roman';
      ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 4, 45);
      ctx.font = 'italic 18px Georgia';
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 4, 75);
      canvasFingerprint = canvas.toDataURL();
    }
  } catch (e) {
    // Canvas fingerprint failed
  }

  return {
    canvas: canvasFingerprint,
    userAgent: navigator.userAgent || 'unknown',
    language: navigator.language || 'unknown',
    platform: navigator.platform || 'unknown',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    colorDepth: window.screen.colorDepth || 0,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
}