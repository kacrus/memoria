import { Component } from '@angular/core';
import { TestSession } from '../../../models/test-session.model';
import { TestSessionResultsService } from '../../../services/test-session-results.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FullTestSessionResult } from '../../../models/test-session-result.model';
import { AnswerResult } from '../../../models/answer-result.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-test-session-results-page',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule, MatTableModule, MatDividerModule, MatGridListModule],
  templateUrl: './test-session-results-page.component.html',
  styleUrl: './test-session-results-page.component.scss'
})
export class TestSessionResultsPageComponent {
  protected testSession: FullTestSessionResult | null = null;
  protected dataSource: QuestionRow[] = [];
  protected displayedColumns: string[] = ['index', 'result', 'question', 'answer', 'correctAnswers'];

  protected AnswerResult = AnswerResult;

  constructor(
    private readonly testSessionResultsService: TestSessionResultsService
  ) { }

  ngOnInit() {
    this.testSessionResultsService.getLatestTestSession().subscribe({
      next: (testSession: FullTestSessionResult | null) => {
        this.testSession = testSession;

        if (this.testSession) {
          for (let i = 0; i < this.testSession.questions.length; i++) {
            const question = this.testSession.questions[i];
            const questionRow = new QuestionRow();
            questionRow.index = i + 1;
            questionRow.question = question.question.text;
            questionRow.answer = question.answer ?? "";
            questionRow.correctAnswers = question.question.answers;
            questionRow.result = question.result ?? AnswerResult.Incorrect;
            this.dataSource.push(questionRow);
          }
        }

        console.log('Loaded test session', testSession);
      },
      error: (error) => {
        console.error('Failed to load test session', error);
      }
    });
  }
}

class QuestionRow {
  public index: number = 0;
  public question: string = "";
  public answer: string = "";
  public correctAnswers: string[] = [];
  public result: AnswerResult = AnswerResult.Incorrect;
}
