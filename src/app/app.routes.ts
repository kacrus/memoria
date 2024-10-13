import { Routes } from '@angular/router';
import { NewTestPageComponent } from './pages/test-mgmt/new-test-page/new-test-page.component';
import { EditTestPageComponent } from './pages/test-mgmt/edit-test-page/edit-test-page.component';
import { ListTestsPageComponent } from './pages/test-mgmt/list-tests-page/list-tests-page.component';
import { TestSessionPageComponent } from './pages/test-sessions/test-session-page/test-session-page.component';
import { TestSessionSettingsPageComponent } from './pages/test-sessions/test-session-settings-page/test-session-settings-page.component';
import { TestSessionResultsPageComponent } from './pages/test-sessions/test-session-results-page/test-session-results-page.component';

export const routes: Routes = [
    { path: '', component: ListTestsPageComponent },
    { path: "test/new", component: NewTestPageComponent },
    { path: "test/:id/edit", component: EditTestPageComponent },
    { path: "test/:id/session", component: TestSessionPageComponent },
    { path: "test/:id/session-settings", component: TestSessionSettingsPageComponent },
    { path: "test-session-results", component: TestSessionResultsPageComponent }
];
