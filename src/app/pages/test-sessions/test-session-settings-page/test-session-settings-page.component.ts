import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Test } from '../../../models/test.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TestsService } from '../../../services/tests.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TestSesssionSettings as TestSessionSettings } from '../../../models/test-session-settings.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-test-session-settings-page',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDividerModule, MatCheckboxModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './test-session-settings-page.component.html',
  styleUrl: './test-session-settings-page.component.scss'
})
export class TestSessionSettingsPageComponent {
  protected test: Test | null = null;
  public testSessionSettings: TestSessionSettings = new TestSessionSettings();

  constructor(
    private readonly testsService: TestsService,
    private readonly toastrService: ToastrService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.toastrService.error('Test ID is required');
      return;
    }

    this.testsService.getTest(id).subscribe({
      next: (test: Test | null) => {
        if (!test) {
          this.toastrService.error('Failed to load test');
          return;
        }

        this.test = test;
      },
      error: (error) => {
        console.error('Failed to load test', error);
        this.toastrService.error('Failed to load test');
      }
    });
  }

  protected startSession() {
    this.router.navigate([`/test/${this.test?.id}/session`], {
      queryParams: {
        shuffleQuestions: this.testSessionSettings.shuffleQuestions,
        caseSensitive: this.testSessionSettings.answerValidation.caseSensitive,
        maxErrors: this.testSessionSettings.answerValidation.maxErrors
      }
    });
  }
}
