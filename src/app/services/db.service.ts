import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  static readonly DB_NAME = 'memoria-db';
  static readonly DB_VERSION = 2;

  constructor() { }

  public getDb(): Observable<IDBDatabase> {
    let request: IDBOpenDBRequest = indexedDB.open(DbService.DB_NAME, DbService.DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      let db: IDBDatabase = event.target.result;
      db.createObjectStore('tests', { keyPath: 'id', autoIncrement: false });
      db.createObjectStore('testSessionResults', { keyPath: 'id', autoIncrement: false });

      let transaction = db.transaction('tests', 'readwrite');
      let testSessionResultsStore = transaction.objectStore('testSessionResults');
      testSessionResultsStore.createIndex('testId', 'testId', { unique: false });
    };

    return new Observable<IDBDatabase>(observer => {
      request.onsuccess = (event: Event) => {
        observer.next(request.result);
        observer.complete();
      };

      request.onerror = (event: Event) => {
        observer.error(request.error);
      };
    });
  }
}
