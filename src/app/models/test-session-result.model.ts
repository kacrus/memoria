export class TestSessionResult {
    public id: string = '';
    public testId: string = '';
    public startDate: Date = new Date();
    public endDate: Date = new Date();
    public correctAnswers: number = 0;
    public almostCorrectAnswers: number = 0;
    public totalQuestions: number = 0;
}