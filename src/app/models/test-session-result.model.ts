import { TestSessionSettings } from "./test-session-settings.model";
import { TestSessionQuestion } from "./test-session.model";

export class TestSessionResult {
    public id: string = '';
    public testId: string = '';
    public startDate: Date = new Date();
    public endDate: Date = new Date();
    public correctAnswers: number = 0;
    public almostCorrectAnswers: number = 0;
    public totalQuestions: number = 0;
    public settings: TestSessionSettings = new TestSessionSettings();
}

export class FullTestSessionResult extends TestSessionResult {
    public questions: TestSessionQuestion[] = [];
    public testName: string = '';
    public testGroupString: string = '';
}
