import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { MAX_URL_LENGTH } from '@/utils/constants';

export function encodeSessionUrl(data: object): { url: string; truncated: boolean } {
  const compressed = compressToEncodedURIComponent(JSON.stringify(data));
  const url = window.location.origin + '?session=' + compressed;
  return { url, truncated: url.length > MAX_URL_LENGTH };
}

export function decodeSessionUrl(search: string): object | null {
  const params = new URLSearchParams(search);
  const encoded = params.get('session');
  if (!encoded) return null;
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}
