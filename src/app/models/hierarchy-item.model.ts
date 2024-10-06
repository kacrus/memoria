export enum HierarchyItemType {
    Test = 'test',
    TestsSet = 'testsSet',
  }

export class HierarchyItem {
    constructor(id: string, type: HierarchyItemType, name: string) {
      this.id = id;
      this.type = type;
      this.name = name;
    }
  
    public id: string;
    public type: HierarchyItemType;
    public name: string;
  
    public parent: HierarchyItem | null = null;
    public children: Array<HierarchyItem> = [];
  
    public addChild(item: HierarchyItem) {
      item.parent = this;
      this.children.push(item);
    }
  
    public getByType(type: HierarchyItemType): HierarchyItem[] {
      return this.children.filter(x => x.type === type).sort((a, b) => a.name.localeCompare(b.name));
    }
  
    public getAllParents(): HierarchyItem[] {
      let result: HierarchyItem[] = [];
  
      let current: HierarchyItem | null = this.parent;
      while(current) {
        result.unshift(current);
        current = current.parent;
      }
  
      return result;
    }
  
    public getAllTestChildren(): HierarchyItem[] {
      let result: HierarchyItem[] = [];
  
      for(let child of this.children) {
        if(child.type === HierarchyItemType.Test) {
          result.push(child);
        } else {
          result.push(...child.getAllTestChildren());
        }
      }
  
      return result;
    }
  }