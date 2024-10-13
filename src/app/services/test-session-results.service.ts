import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { FullTestSessionResult, TestSessionResult } from '../models/test-session-result.model';
import { Observable } from 'rxjs';
import { TestSession } from '../models/test-session.model';

@Injectable({
  providedIn: 'root'
})
export class TestSessionResultsService {
  constructor(
    private dbService: DbService
  ) { }

  public save(testSession: TestSession): Observable<void> {
    return new Observable<void>(observer => {
      return this.dbService.getDb().subscribe({
        next: (db: IDBDatabase) => {
          let transaction: IDBTransaction = db.transaction('testSessionResults', 'readwrite');
          let store: IDBObjectStore = transaction.objectStore('testSessionResults');
          let result: TestSessionResult = testSession.getResult();
          let request: IDBRequest = store.add(result);
          request.onsuccess = (event: Event) => {
            let fullResult: TestSessionResult = testSession.getFullResult();
            sessionStorage.setItem('latestTestSession', JSON.stringify(fullResult));
            observer.next();
            observer.complete();
          };
          request.onerror = (event: Event) => {
            observer.error(request.error);
          };
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public getLatestTestSession(): Observable<FullTestSessionResult | null> {
    return new Observable<FullTestSessionResult | null>(observer => {
      let latestTestSession: FullTestSessionResult | null = null;
      let str = sessionStorage.getItem('latestTestSession');
      if (str) {
        latestTestSession = JSON.parse(str);
      }

      observer.next(latestTestSession);
      observer.complete();
    });
  }
}
