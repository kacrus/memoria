import { AnswerResult } from "../../../models/answer-result.model";
import { AnswerValidator } from "../answer-validator";

export class CaseInsensitiveValidator implements AnswerValidator {
    validate(answer: string, correctAnswers: string[]): AnswerResult {
        let lowerCaseAnswer = answer.toLowerCase();
        for(let correctAnswer of correctAnswers) {
            if(lowerCaseAnswer === correctAnswer.toLowerCase()) {
                return AnswerResult.Correct;
            }
        }

        return AnswerResult.Incorrect;
    }
}