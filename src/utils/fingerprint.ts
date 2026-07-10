// // src/utils/fingerprint.ts
// export interface DeviceFingerprint {
//   canvas: string;
//   userAgent: string;
//   language: string;
//   platform: string;
//   screenResolution: string;
//   timezone: string;
//   colorDepth: number;
//   touchSupport: boolean;
// }

// export async function getDeviceFingerprint(): Promise<DeviceFingerprint> {
//   let canvasFingerprint = 'fallback';
//   try {
//     const canvas = document.createElement('canvas');
//     canvas.width = 256;
//     canvas.height = 256;
//     const ctx = canvas.getContext('2d');
    
//     if (ctx) {
//       ctx.textBaseline = 'top';
//       ctx.font = '14px Arial';
//       ctx.fillStyle = '#f60';
//       ctx.fillRect(125, 1, 62, 20);
//       ctx.fillStyle = '#069';
//       ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 2, 15);
//       ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
//       ctx.font = '18px Times New Roman';
//       ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 4, 45);
//       ctx.font = 'italic 18px Georgia';
//       ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
//       ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 4, 75);
//       canvasFingerprint = canvas.toDataURL();
//     }
//   } catch (e) {
//     // Canvas fingerprint failed
//   }

//   return {
//     canvas: canvasFingerprint,
//     userAgent: navigator.userAgent || 'unknown',
//     language: navigator.language || 'unknown',
//     platform: navigator.platform || 'unknown',
//     screenResolution: `${window.screen.width}x${window.screen.height}`,
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
//     colorDepth: window.screen.colorDepth || 0,
//     touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
//   };
// }
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

// ⭐ ADD THIS helper function to hash the canvas data
async function sha256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex; // 64 characters - much shorter!
  } catch {
    return 'fallback_hash';
  }
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
      
      // ⭐⭐⭐ CHANGE THIS - Hash the canvas data instead of sending full string ⭐⭐⭐
      const fullDataUrl = canvas.toDataURL();
      canvasFingerprint = await sha256(fullDataUrl); // ← Now only 64 characters!
    }
  } catch (e) {
    // Canvas fingerprint failed
  }

  return {
    canvas: canvasFingerprint, // ← Now short (64 characters)
    userAgent: navigator.userAgent || 'unknown',
    language: navigator.language || 'unknown',
    platform: navigator.platform || 'unknown',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    colorDepth: window.screen.colorDepth || 0,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
}