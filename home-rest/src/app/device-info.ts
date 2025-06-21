export interface DeviceInfo {
  id: string;
  name: string;
  endpoint: string;
  type: string;
  iconId: number;
}

export function getDeviceFontClass(name: string): string {
  if (name.length > 10) return 'fs-6';
  return 'fs-5';
}
