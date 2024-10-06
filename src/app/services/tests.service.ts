import { Injectable } from '@angular/core';
import { Test } from '../models/test.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestsService {
  static readonly DB_NAME = 'memoria';
  static readonly DB_VERSION = 1;

  constructor(
  ) { }

  public createTest(test: Test): Observable<void> {
    return new Observable<void>(observer => {
      this.getDb().subscribe({
        next: (db: IDBDatabase) => {
          let transaction: IDBTransaction = db.transaction('tests', 'readwrite');
          let store: IDBObjectStore = transaction.objectStore('tests');
          let request: IDBRequest = store.add(test);
          request.onsuccess = (event: Event) => {
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

  private getDb(): Observable<IDBDatabase> {
    let request: IDBOpenDBRequest = indexedDB.open(TestsService.DB_NAME, TestsService.DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      console.log('onupgradeneeded', event);
      let db: IDBDatabase = event.target.result;
      db.createObjectStore('tests', { keyPath: 'id', autoIncrement: false });
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
