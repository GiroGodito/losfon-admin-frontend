// src/components/layout/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <span>© {year} LosFon System. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <span>Secure • Encrypted • Protected</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
            <span className="text-green-500/70">✓ System Online</span>
          </span>
        </div>
      </div>
    </footer>
  );
};