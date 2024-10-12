import { Component } from '@angular/core';
import { Test } from '../../../models/test.model';
import { TestSession } from '../../../models/test-session.model';
import { TestsService } from '../../../services/tests.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
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
import { AnswerValidationSettings } from '../../../models/test-session-settings.model';

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

  private shuffleQuestions: boolean = false;

  constructor(
    private readonly testsService: TestsService,
    private readonly toastrService: ToastrService,
    private readonly activatedRoute: ActivatedRoute,
    answerValidatorFactory: AnswerValidatorFactory
  ) {
    this.shuffleQuestions = activatedRoute.snapshot.queryParamMap.get('shuffleQuestions') === "true";
    let caseSensitive = activatedRoute.snapshot.queryParamMap.get('caseSensitive') === "true";
    let maxErrors = parseInt(activatedRoute.snapshot.queryParamMap.get('maxErrors') || '0');
    let settings = new AnswerValidationSettings();
    settings.caseSensitive = caseSensitive;
    settings.maxErrors = maxErrors;
    this.answerValidator = answerValidatorFactory.createValidator(settings);
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

        this.testSession = new TestSession(test);
        if (this.shuffleQuestions) {
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
      this.testSession.moveToNextQuestion();
      this.currentAnswerValue = '';
      this.nextOperation = NextOperation.ShowResult;
    }
  }
}


enum NextOperation {
  ShowResult,
  ShowNextQuestion
}
