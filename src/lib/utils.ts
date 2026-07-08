// src/lib/utils.ts
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Claimed': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Expired': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Done': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Cold Case': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'Disposal': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Donated': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};