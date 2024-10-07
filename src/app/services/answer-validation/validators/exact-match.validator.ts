import { AnswerResult } from "../../../models/answer-result.model";
import { AnswerValidator } from "../answer-validator";

export class ExactMatchValidator implements AnswerValidator {
    validate(answer: string, correctAnswers: string[]): AnswerResult {
        for(let correctAnswer of correctAnswers) {
            if(answer === correctAnswer) {
                return AnswerResult.Correct;
            }
        }

        return AnswerResult.Incorrect;
    }
}