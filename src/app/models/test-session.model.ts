import { AnswerResult } from "./answer-result.model";
import { Question, Test } from "./test.model";
import { FullTestSessionResult, TestSessionResult } from "./test-session-result.model";
import { v7 as uuidv7 } from 'uuid';
import { TestSessionSettings as TestSessionSettings } from "./test-session-settings.model";

export class TestSession {
    private _questions: TestSessionQuestion[];
    private _currectQuestionIndex: number = 0;
    private _testId: string;
    private _testName: string;
    private _testGroupsString: string;
    private _startDate: Date;
    private _endDate: Date | null = null;
    private _answerResults: AnswerResult[];
    private _settings: TestSessionSettings

    constructor(test: Test, settings: TestSessionSettings) {
        this._startDate = new Date();
        this._testId = test.id;
        this._testName = test.name;
        this._testGroupsString = test.groups.join(" | ");
        this._questions = test.questions.map(q => new TestSessionQuestion(q));
        this._answerResults = new Array<AnswerResult>(this._questions.length).fill(AnswerResult.NotAnswered);
        this._settings = settings;
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

        

        if (this._currectQuestionIndex >= this._questions.length - 1) {
            if (this._endDate === null) {
                this._endDate = new Date();
            }
        }
    }

    public canMoveToNextQuestion(): boolean {
        return this._currectQuestionIndex < this._questions.length - 1;
    }

    public moveToNextQuestion(): void {
        this._currectQuestionIndex++;
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
        result.settings = this._settings;
        return result;
    }

    public getFullResult(): FullTestSessionResult {
        if (this._endDate === null) {
            throw new Error("Test session not finished yet");
        }

        let result = new FullTestSessionResult();
        result.id = uuidv7();
        result.testId = this._testId;
        result.startDate = this._startDate;
        result.endDate = this._endDate;
        result.totalQuestions = this._questions.length;
        result.correctAnswers = this._questions.filter(q => q.result === AnswerResult.Correct).length;
        result.almostCorrectAnswers = this._questions.filter(q => q.result === AnswerResult.AlmostCorrect).length;
        result.settings = this._settings;
        result.questions = this._questions
        result.testName = this._testName;
        result.testGroupString = this._testGroupsString;
        return result;
    }
}

export class TestSessionQuestion {
    constructor(question: Question) {
        this.question = question;
    }

    public question: Question;
    public answer: string | null = null;
    public result: AnswerResult | null = null;
}