import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, of } from 'rxjs';
import { switchMap, startWith, catchError, map } from 'rxjs/operators';

export interface LogEntry {
  id: number;
  fullLogLine: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogViewService {
  private logsSubject = new BehaviorSubject<LogEntry[]>([]);
  private connectionSubject = new BehaviorSubject<boolean>(false);
  private lastLogId: number | null = null;

  private apiUrl = 'http://localhost:8080/api/logs';

  constructor(private http: HttpClient) {
    this.startLogPolling();
  }

  // Fetch initial logs
  fetchInitialLogs(limit: number = 50): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(this.apiUrl, {
      params: { 
        limit: limit.toString() 
      }
    }).pipe(
      map(logs => {
        if (logs && logs.length > 0) {
          this.connectionSubject.next(true);
          this.lastLogId = logs[logs.length - 1].id;
          this.logsSubject.next(logs);
        }
        return logs;
      }),
      catchError(error => {
        console.error('Error fetching initial logs', error);
        this.connectionSubject.next(false);
        return of([]);
      })
    );
  }

  // Start polling for new logs
  private startLogPolling() {
    interval(5000).pipe(
      startWith(0),
      switchMap(() => this.fetchNewLogs())
    ).subscribe();
  }

  // Fetch new logs
  private fetchNewLogs(): Observable<LogEntry[]> {
    const params: any = { limit: 50 };
    if (this.lastLogId) {
      params['afterId'] = this.lastLogId;
    }

    return this.http.get<LogEntry[]>(this.apiUrl, { params }).pipe(
      map(newLogs => {
        if (newLogs && newLogs.length > 0) {
          this.connectionSubject.next(true);
          const currentLogs = this.logsSubject.value;
          const combinedLogs = [...currentLogs, ...newLogs];

          const trimmedLogs = combinedLogs.slice(Math.max(combinedLogs.length - 500, 0));

          this.lastLogId = newLogs[newLogs.length - 1].id;
          this.logsSubject.next(trimmedLogs);
        }
        return newLogs || [];
      }),
      catchError(error => {
        console.error('Error fetching logs', error);
        this.connectionSubject.next(false);
        return of([]);
      })
    );
  }

  // Get logs
  getLogs(): Observable<LogEntry[]> {
    return this.logsSubject.asObservable();
  }
  
  // Get connection status
  getConnectionStatus(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }
}