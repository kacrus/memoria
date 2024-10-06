import { Injectable } from '@angular/core';
import { HierarchyItem, HierarchyItemType } from '../models/hierarchy-item.model';
import { Observable } from 'rxjs';
import { TestsService } from './tests.service';
import { Test } from '../models/test.model';

@Injectable({
  providedIn: 'root'
})
export class HierarchyItemService {

  constructor(
    private testsService: TestsService
  ) { }

  get(): Observable<HierarchyItem> {
    return new Observable<HierarchyItem>(observer => {
      return this.testsService
        .getTests()
        .subscribe({
          next: (result: Test[]) => {
            let hierarchyItem = this.mapToHierarchyItem(result);
            observer.next(hierarchyItem);
          },
          error: (error) => {
            observer.error(error);
          },
          complete: () => {
            observer.complete();
          }
        });
    });
  }

  private mapToHierarchyItem(result: Test[]): HierarchyItem {
    let root = new HierarchyItem('root', HierarchyItemType.TestsSet, 'Root');

    for(let item of result) {
      this.addItem(root, item);
    }

    return root;
  }

  private addItem(root: HierarchyItem, item: Test) {
    let groups = item.groups;
    let parent = root;

    for(let group of groups) {
      let found = parent.children.find(x => x.name === group);
      if(!found) {
        let newItem = new HierarchyItem(item.id, HierarchyItemType.TestsSet, group);
        parent.addChild(newItem);
        parent = newItem;
      } else {
        parent = found;
      }
    }

    let newItem = new HierarchyItem(item.id, HierarchyItemType.Test, item.name);
    parent.addChild(newItem);
  }
}
