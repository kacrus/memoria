import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AnswerResult } from '../../../models/answer-result.model';


@Component({
  selector: 'app-test-session-answers-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-session-answers-control.component.html',
  styleUrl: './test-session-answers-control.component.scss'
})
export class TestSessionAnswersControlComponent {
  @Input() public answerResults: AnswerResult[] = [];
 
  protected AnswerResult = AnswerResult;
}
