import { AnswerResult } from "../../../models/answer-result.model";
import { AnswerValidator } from "../answer-validator";

export class CompositeValidator implements AnswerValidator {
    constructor(private validators: AnswerValidator[]) { }

    validate(answer: string, correctAnswers: string[]): AnswerResult {
        let almostCorrect: boolean = false;
        for (let validator of this.validators) {
            let result = validator.validate(answer, correctAnswers);
            if (result === AnswerResult.Correct) {
                return result;
            } else if(result === AnswerResult.AlmostCorrect) {
                almostCorrect = true;
            }
        }

        return almostCorrect ? AnswerResult.AlmostCorrect : AnswerResult.Incorrect;
    }
}