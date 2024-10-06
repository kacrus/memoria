import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Test } from '../../../models/test.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { ErrorStateMatcher } from '@angular/material/core';

class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control != null && control.invalid;
  }
}

@Component({
  selector: 'app-edit-test-data-control',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDividerModule, ReactiveFormsModule],
  templateUrl: './edit-test-data-control.component.html',
  styleUrl: './edit-test-data-control.component.scss',
  providers: [{ provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }]
})
export class EditTestDataControlComponent {
  @Input() public test: Test = new Test();
  @Input() public headerText: string = '';
  @Output() public onTestSaved: EventEmitter<Test> = new EventEmitter<Test>();

  protected groupsString: string = '';
  protected specialCharsString: string = '';

  constructor(
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.groupsString = this.test.groups.join('/');
    this.specialCharsString = this.test.specialCharacters.join('/');
  }

  protected removeQuestion(index: number) {
    this.test.questions.splice(index, 1);
  }

  protected removeAnswer(questionIndex: number, answerIndex: number) {
    this.test.questions[questionIndex].answers.splice(answerIndex, 1);
  }

  protected addAnswer(questionIndex: number) {
    this.test.questions[questionIndex].answers.push('');
  }

  protected addQuestion() {
    this.test.questions.push({ text: '', answers: [''] });
  }

  protected backClick() {
    this.router.navigate(['']);
  }

  protected saveClick() {
    this.test.groups = this.groupsString.split('/').filter(group => group !== '');
    this.test.specialCharacters = this.specialCharsString.split('/');
    this.onTestSaved.emit(this.test);
  }

  protected canSave(): boolean {
    if (!this.test.name) {
      return false;
    }

    for (let question of this.test.questions) {
      if (!question.text) {
        return false;
      }

      for (let answer of question.answers) {
        if (!answer) {
          return false;
        }
      }
    }

    return true;
  }
}
