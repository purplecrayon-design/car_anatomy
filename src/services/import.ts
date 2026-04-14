import type { SessionExport } from '@/types/session';

export function importSession(file: File): Promise<SessionExport> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as SessionExport;
        if (!data.version || !data.session) throw new Error('Invalid session file');
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
