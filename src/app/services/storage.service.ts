import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HistoryEntry } from '../models/history-entry';

const KEY = 'retailoff.history';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private list: HistoryEntry[] = [];
  private subj = new BehaviorSubject<HistoryEntry[]>([]);
  list$ = this.subj.asObservable();

  constructor() { this.load(); }

  private load() {
    const raw = localStorage.getItem(KEY);
    this.list = raw ? JSON.parse(raw) : [];
    this.subj.next(this.list);
  }

  private save() {
    localStorage.setItem(KEY, JSON.stringify(this.list));
    this.subj.next([...this.list]);
  }

  add(entry: HistoryEntry) {
    this.list = [entry, ...this.list];
    this.save();
  }

  clear() {
    this.list = [];
    this.save();
  }
}
