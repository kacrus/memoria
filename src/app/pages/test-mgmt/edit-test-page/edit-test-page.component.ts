import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestsService } from '../../../services/tests.service';
import { ToastrService } from 'ngx-toastr';
import { Test } from '../../../models/test.model';
import { EditTestDataControlComponent } from '../../../controls/test-mgmt/edit-test-data-control/edit-test-data-control.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-test-page',
  standalone: true,
  imports: [EditTestDataControlComponent, CommonModule],
  templateUrl: './edit-test-page.component.html',
  styleUrl: './edit-test-page.component.scss'
})
export class EditTestPageComponent {
  protected test: Test | null = null;

  constructor(
    private testsService: TestsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get("id");
      if (id) {
        this.testsService.getTest(id).subscribe({
          next: (test: Test | null) => {
            this.test = test;
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    });
  }

  protected onTestSaved(test: Test) {
    this.testsService.updateTest(test)
      .subscribe({
        next: (updated: boolean) => {
          if (updated) {
            this.router.navigate(['']);
          } else {
            this.toastService.error('Test not found');
          }
        },
        error: (error) => {
          this.toastService.error('Error creating test');
          console.error('Error creating test', error);
        }
      });
  }
}
