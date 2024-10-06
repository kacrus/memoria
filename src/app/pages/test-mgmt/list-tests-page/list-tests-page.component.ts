import { Component } from '@angular/core';
import { HierarchyItem, HierarchyItemType } from '../../../models/hierarchy-item.model';
import { HierarchyItemService } from '../../../services/hierarchy-item.service';
import { TestsService } from '../../../services/tests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-tests-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './list-tests-page.component.html',
  styleUrl: './list-tests-page.component.scss'
})
export class ListTestsPageComponent {
  protected readonly HierarchyItemType = HierarchyItemType;

  protected hierarchyRoot: HierarchyItem | null = null;
  protected currentHierarchyItem: HierarchyItem | null = null;

  constructor(
    private readonly hierarchyService: HierarchyItemService,
    private readonly testsService: TestsService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly location: Location,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
      let current = this.activatedRoute.snapshot.queryParamMap.get('current');
      let currentTestSets = current?.split('|');

      this.hierarchyService.get().subscribe({
        next: (hierarchyRoot: HierarchyItem) => {
          this.hierarchyRoot = hierarchyRoot;
          console.log('Hierarchy root', currentTestSets);

          if (currentTestSets && currentTestSets.length > 0 && currentTestSets[0] === hierarchyRoot.name) {
            console.log('Current test sets', currentTestSets);
            let currentHierarchyItem = hierarchyRoot;
            for (let i = 1; i < currentTestSets.length; i++) {
              let nextName = currentTestSets[i];
              let nextItem = currentHierarchyItem.children.find(child => child.name === nextName);
              if (!nextItem) {
                console.error('Failed to find hierarchy item', nextName);
                break;
              }

              currentHierarchyItem = nextItem;
            }

            this.currentHierarchyItem = currentHierarchyItem;
            
          } else {
            this.currentHierarchyItem = hierarchyRoot;
          }

         // this.currentHierarchyItem = hierarchyRoot;
          this.refreshState();
        },
        error: (error) => {
          console.error(error);
        }
    });
   
  }

  protected onTestSetClick(item: HierarchyItem) {
    if (item.type === HierarchyItemType.TestsSet) {
      this.currentHierarchyItem = item;
      this.refreshState();
    }
  }

  protected onTestClick(item: HierarchyItem) {
    if (item.type === HierarchyItemType.Test) {
      this.router.navigate(['test', item.id, 'session']);
    }
  }

  protected onTestEditClick(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['test', id, 'edit']);
  }

  protected onTestSetDeleteClick(item: HierarchyItem, event: MouseEvent) {
    event.stopPropagation();

    if(item.type !== HierarchyItemType.TestsSet) {
      return;
    }

    if (!confirm(`Are you sure you want to delete tests set "${item.name}"?`)) {
      return;
    }

    let testsToDelete = item.getAllTestChildren();
    let ids = testsToDelete.map(test => test.id);
    let names = testsToDelete.map(test => test.name);

    this.testsService
      .deleteTests(ids)
      .subscribe({
        next: () => {
          if(item.parent) {
            item.parent.children = item.parent.children.filter(child => child.id !== item.id);
          }

          console.log('Test deleted successfully', names);

          this.refreshCurrentHierarchyItem();
          this.toastrService.success(`Tests set "${item.name}" deleted successfully`);
        },
        error: (error) => {
          console.error("Failed to delete tests set", error);
          this.toastrService.error(`Failed to delete tests set "${item.name}"`);
        }
      });
  }

  protected onTestDeleteClick(item: HierarchyItem, event: MouseEvent) {
    if (item.type !== HierarchyItemType.Test) {
      return;
    }

    event.stopPropagation();

    if (!confirm(`Are you sure you want to delete test "${item.name}"?`)) {
      return;
    }

    this.testsService
      .deleteTests([item.id])
      .subscribe({
        next: () => {
          if(item.parent) {
            item.parent.children = item.parent.children.filter(child => child.id !== item.id);
          }

          console.log('Test deleted successfully', item.name);

          this.refreshCurrentHierarchyItem();
          this.toastrService.success(`Test "${item.name}" deleted successfully`);
        },
        error: (error) => {
          console.error("Failed to delete test", error);
          this.toastrService.error(`Failed to delete test "${item.name}"`);
        }
      });
  }

  protected onParentSetClick(item: HierarchyItem) {
    if (item.type === HierarchyItemType.TestsSet) {
      this.currentHierarchyItem = item;
      this.refreshState();
    }
  }

  protected onAddClick() {
    let groups: string[] = [];
    let parent = this.currentHierarchyItem;
    while (parent?.parent) {
      groups.push(parent.name);
      parent = parent.parent;
    }

    groups = groups.reverse();

    let groupsString = groups.join('/');
    this.router.navigate(['test', 'new'], { queryParams: { groups: groupsString } });
  }

  private refreshCurrentHierarchyItem() {
    if (!this.currentHierarchyItem) {
      return;
    }
    
    let current = this.currentHierarchyItem;
    while(current.parent && current.children.length === 0) {
      let parent = current.parent;
      parent.children = parent.children.filter(child => child.id !== current.id);
      current = parent;
    }    

    this.currentHierarchyItem = current;
    this.refreshState();
  }

  private refreshState() {
    if (!this.currentHierarchyItem) {
      return;
    }

    console.log('Refresh state', this.currentHierarchyItem);

    let parents = this.currentHierarchyItem.getAllParents();
    parents.push(this.currentHierarchyItem);
    let parentsStr = parents.map(parent => parent.name).join('|');
    this.location.replaceState(`?current=${parentsStr}`);
  }
}
