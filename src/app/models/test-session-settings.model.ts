export class TestSesssionSettings {
    public shuffleQuestions: boolean = false;
    public answerValidation: AnswerValidationSettings = new AnswerValidationSettings();
}

export class AnswerValidationSettings {
    public caseSensitive: boolean = true;
    public maxErrors: number = 0;
}