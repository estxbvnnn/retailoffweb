import { Injectable } from '@angular/core';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { HistoryEntry, HistoryType } from '../models/history-entry';

@Injectable({ providedIn: 'root' })
export class ScanService {
  private BarcodeScanner = registerPlugin<any>('BarcodeScanner');
  private Browser = registerPlugin<any>('Browser');

  async scan(): Promise<string | null> {
    if (Capacitor.getPlatform() !== 'web') {
      try {
        const perm = await this.BarcodeScanner.checkPermission?.({ force: true });
        if (perm && perm.granted === false) return null;
        await this.BarcodeScanner.hideBackground?.();
        const r = await this.BarcodeScanner.startScan?.();
        await this.BarcodeScanner.showBackground?.();
        return r?.hasContent ? r.content ?? null : null;
      } catch {
        try {
          await this.BarcodeScanner.showBackground?.();
          await this.BarcodeScanner.stopScan?.();
        } catch { /* ignore */ }
        return null;
      }
    }
    return prompt('Pega el contenido del QR / código de barras:') || null;
  }

  parse(content: string): Omit<HistoryEntry, 'id' | 'createdAt'> {
    let type: HistoryType = 'text';
    let meta: any;
    const t = content.trim();
    if (/^https?:\/\//i.test(t)) type = 'http';
    else if (/^geo:/i.test(t)) {
      type = 'geo';
      const coords = t.replace(/^geo:/i, '').split('?')[0];
      const [latStr, lngStr] = coords.split(',', 2);
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      const title = (new URLSearchParams(t.split('?')[1] || '')).get('q') || 'Ubicación';
      meta = { lat, lng, title };
    }
    return { type, content: t, meta };
  }

  async openHttp(url: string) {
    try {
      await this.Browser.open?.({ url });
    } catch {
      if (typeof window !== 'undefined' && typeof window.open === 'function') {
        window.open(url, '_blank');
      } else {
        (location as Location).assign(url);
      }
    }
  }
}