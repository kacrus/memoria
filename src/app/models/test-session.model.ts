import { AnswerResult } from "./answer-result.model";
import { Question, Test } from "./test.model";
import { TestSessionResult } from "./test-session-result.model";
import { v7 as uuidv7 } from 'uuid';

export class TestSession {
    private _questions: TestSessionQuestion[];
    private _currectQuestionIndex: number = 0;
    private _testId: string;
    private _testName: string;
    private _testGroupsString: string;
    private _startDate: Date;
    private _endDate: Date | null = null;
    private _answerResults: AnswerResult[];

    constructor(test: Test) {
        this._startDate = new Date();
        this._testId = test.id;
        this._testName = test.name;
        this._testGroupsString = test.groups.join(" | ");
        this._questions = test.questions.map(q => new TestSessionQuestion(q));
        this._answerResults = new Array<AnswerResult>(this._questions.length).fill(AnswerResult.NotAnswered);
    }

    public get currentQuestion(): Question {
        if (this._currectQuestionIndex >= this._questions.length) {
            throw new Error("No more questions to answer");
        }

        return this._questions[this._currectQuestionIndex].question;
    }

    public get testName(): string {
        return this._testName;
    }

    public get testGroupsString(): string {
        return this._testGroupsString;
    }

    public get answerResults(): AnswerResult[] {
        return this._answerResults;
    }

    public get currentAnswerResult(): AnswerResult | null {
        if (this._currectQuestionIndex >= this._questions.length) {
            throw new Error("No more questions to answer");
        }

        return this._questions[this._currectQuestionIndex].result;
    }

    public shuffleQuestions(): void {
        this._questions.sort(() => Math.random() - 0.5);
    }

    public trackAnswer(answer: string, result: AnswerResult) {
        if (this._currectQuestionIndex >= this._questions.length) {
            throw new Error("No more questions to answer");
        }

        if (this._questions[this._currectQuestionIndex].result !== null) {
            throw new Error("Question already answered");
        }

        this._answerResults[this._currectQuestionIndex] = result;
        this._questions[this._currectQuestionIndex].result = result;
        this._questions[this._currectQuestionIndex].answer = answer;
    }

    public moveToNextQuestion(): boolean {
        this._currectQuestionIndex++;

        if (this._currectQuestionIndex >= this._questions.length) {
            if (this._endDate === null) {
                this._endDate = new Date();
            }

            return false;
        }

        return true;
    }

    public getResult(): TestSessionResult {
        if (this._endDate === null) {
            throw new Error("Test session not finished yet");
        }

        let result = new TestSessionResult();
        result.id = uuidv7();
        result.testId = this._testId;
        result.startDate = this._startDate;
        result.endDate = this._endDate;
        result.totalQuestions = this._questions.length;
        result.correctAnswers = this._questions.filter(q => q.result === AnswerResult.Correct).length;
        result.almostCorrectAnswers = this._questions.filter(q => q.result === AnswerResult.AlmostCorrect).length;
        return result;
    }
}

class TestSessionQuestion {
    constructor(question: Question) {
        this.question = question;
    }

    public question: Question;
    public answer: string | null = null;
    public result: AnswerResult | null = null;
}