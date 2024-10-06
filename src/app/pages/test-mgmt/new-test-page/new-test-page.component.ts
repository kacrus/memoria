import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Test } from '../../../models/test.model';
import { EditTestDataControlComponent } from '../../../controls/test-mgmt/edit-test-data-control/edit-test-data-control.component';
import { ToastrService } from 'ngx-toastr';
import { v7 as uuidv7 } from 'uuid';
import { TestsService } from '../../../services/tests.service';

@Component({
  selector: 'app-new-test-page',
  standalone: true,
  imports: [EditTestDataControlComponent],
  templateUrl: './new-test-page.component.html',
  styleUrl: './new-test-page.component.scss'
})
export class NewTestPageComponent {
  protected test: Test = new Test();

  constructor(
    private testsService: TestsService,
    private toastService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.test.id = uuidv7();
    this.test.questions = [{ text: '', answers: [''] }];
    this.activatedRoute.queryParamMap.subscribe(params => {
      let groupStr = params.get("groups");
      if (groupStr) {
        this.test.groups = groupStr.split('/');
      }
    });
  }

  protected onTestSaved(test: Test) {
    this.testsService.createTest(test)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error) => {
          this.toastService.error('Error creating test');
          console.error('Error creating test', error);
        }
      });
  }
}
