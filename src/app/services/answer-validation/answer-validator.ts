import { AnswerResult } from "../../models/answer-result.model";

export interface AnswerValidator {
    validate(answer: string, correctAnswers: string[]): AnswerResult;
}