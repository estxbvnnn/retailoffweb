export type HistoryType = 'http' | 'geo' | 'text';

export interface HistoryEntry {
  id: string;
  type: HistoryType;
  content: string;
  createdAt: number;
  meta?: {
    lat?: number;
    lng?: number;
    title?: string;
  };
}
