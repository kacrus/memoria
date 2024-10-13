import { Component } from '@angular/core';
import { Test } from '../../../models/test.model';
import { TestSession } from '../../../models/test-session.model';
import { TestsService } from '../../../services/tests.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerResult } from '../../../models/answer-result.model';
import { AnswerValidator } from '../../../services/answer-validation/answer-validator';
import { AnswerValidatorFactory } from '../../../services/answer-validation/answer-validator.factory';
import { CommonModule } from '@angular/common';
import { TestSessionAnswersControlComponent } from '../../../controls/test-sessions/test-session-answers-control/test-session-answers-control.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { TestSessionSettings } from '../../../models/test-session-settings.model';
import { TestSessionResultsService } from '../../../services/test-session-results.service';

@Component({
  selector: 'app-test-session-page',
  standalone: true,
  imports: [CommonModule, TestSessionAnswersControlComponent, FormsModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './test-session-page.component.html',
  styleUrl: './test-session-page.component.scss'
})
export class TestSessionPageComponent {
  protected testSession: TestSession | null = null;
  protected answerValidator: AnswerValidator;
  protected currentAnswerValue: string = '';
  protected nextOperation: NextOperation = NextOperation.ShowResult;

  protected NextOperation = NextOperation;
  protected AnswerResult = AnswerResult;

  private readonly testSessionSettings: TestSessionSettings;


  constructor(
    private readonly testsService: TestsService,
    private readonly toastrService: ToastrService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly testSessionResultsService: TestSessionResultsService,
    private readonly router: Router,
    answerValidatorFactory: AnswerValidatorFactory
  ) {
    this.testSessionSettings = this.getTestSessionSettings();

    this.answerValidator = answerValidatorFactory.createValidator(this.testSessionSettings.answerValidation);
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

        this.testSession = new TestSession(test, this.testSessionSettings);
        if (this.testSessionSettings.shuffleQuestions) {
          this.testSession.shuffleQuestions();
        }
      },
      error: (error) => {
        console.error('Failed to load test', error);
        this.toastrService.error('Failed to load test');
      }
    });
  }

  protected checkAnswer() {
    if (!this.testSession) {
      this.toastrService.error('Test session is not initialized');
      return;
    }

    if (this.nextOperation === NextOperation.ShowResult) {
      let correctAnswers = this.testSession.currentQuestion.answers;
      let result = this.answerValidator.validate(this.currentAnswerValue, correctAnswers);
      this.testSession.trackAnswer(this.currentAnswerValue, result);

      this.nextOperation = NextOperation.ShowNextQuestion;
    } else {
      if (this.testSession.canMoveToNextQuestion()) {
        this.testSession.moveToNextQuestion();
        this.currentAnswerValue = '';
        this.nextOperation = NextOperation.ShowResult;
      } else {
        this.testSessionResultsService
          .save(this.testSession)
          .subscribe({
            next: () => {
              this.router.navigate(['test-session-results']);
            },
            error: (error: any) => {
              console.error('Failed to save test session result', error);
              this.toastrService.error('Failed to save test session result');
            }
          });
      }
    }
  }

  protected getTestSessionSettings(): TestSessionSettings {
    let shuffleQuestions = this.activatedRoute.snapshot.queryParamMap.get('shuffleQuestions') === "true";
    let caseSensitive = this.activatedRoute.snapshot.queryParamMap.get('caseSensitive') === "true";
    let maxErrors = parseInt(this.activatedRoute.snapshot.queryParamMap.get('maxErrors') || '0');

    let settings = new TestSessionSettings();
    settings.shuffleQuestions = shuffleQuestions;
    settings.answerValidation.caseSensitive = caseSensitive;
    settings.answerValidation.maxErrors = maxErrors;

    return settings;
  }
}

enum NextOperation {
  ShowResult,
  ShowNextQuestion
}