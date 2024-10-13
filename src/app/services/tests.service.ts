import { Injectable } from '@angular/core';
import { Test } from '../models/test.model';
import { Observable } from 'rxjs';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class TestsService {


  constructor(
    private dbService: DbService
  ) { }

  public createTest(test: Test): Observable<void> {
    return new Observable<void>(observer => {
      this.dbService.getDb().subscribe({
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

  public updateTest(test: Test): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.dbService.getDb().subscribe({
        next: (db: IDBDatabase) => {
          let transaction: IDBTransaction = db.transaction('tests', 'readwrite');
          let store: IDBObjectStore = transaction.objectStore('tests');
          let request: IDBRequest = store.put(test);
          request.onsuccess = (event: Event) => {
            observer.next(true);
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

  public getTest(id: string): Observable<Test | null> {
    return new Observable<Test | null>(observer => {
      this.dbService.getDb().subscribe({
        next: (db: IDBDatabase) => {
          let transaction: IDBTransaction = db.transaction('tests', 'readonly');
          let store: IDBObjectStore = transaction.objectStore('tests');
          let request: IDBRequest = store.get(id);
          request.onsuccess = (event: Event) => {
            observer.next(request.result);
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

  public getTests(): Observable<Test[]> {
    return new Observable<Test[]>(observer => {
      this.dbService.getDb().subscribe({
        next: (db: IDBDatabase) => {
          let transaction: IDBTransaction = db.transaction('tests', 'readonly');
          let store: IDBObjectStore = transaction.objectStore('tests');
          let request: IDBRequest = store.getAll();
          request.onsuccess = (event: Event) => {
            observer.next(request.result);
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

  public deleteTests(ids: string[]): Observable<void> {
    return new Observable<void>(observer => {
      this.dbService.getDb().subscribe({
        next: (db: IDBDatabase) => {
          let transaction: IDBTransaction = db.transaction('tests', 'readwrite');
          let store: IDBObjectStore = transaction.objectStore('tests');
          ids.forEach(id => {
            store.delete(id);
          });
          observer.next();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
