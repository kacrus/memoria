import { Routes } from '@angular/router';
import { NewTestPageComponent } from './pages/test-mgmt/new-test-page/new-test-page.component';
import { EditTestPageComponent } from './pages/test-mgmt/edit-test-page/edit-test-page.component';

export const routes: Routes = [
    { "path": "test/new", "component": NewTestPageComponent },
    { "path": "test/:id/edit", "component": EditTestPageComponent }
];
