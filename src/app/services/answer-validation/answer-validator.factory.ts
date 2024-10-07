import { Injectable } from "@angular/core";
import { AnswerValidator } from "./answer-validator";
import { ExactMatchValidator } from "./validators/exact-match.validator";
import { CompositeValidator } from "./validators/composite.validator";
import { CaseInsensitiveValidator } from "./validators/case-insensitive.validator";
import { LevenshteinDistanceValidator } from "./validators/levenshtein-distance.validator";

export class AnswerValidationSettings {
    public caseSensitive: boolean = true;
    public maxErrors: number = 0;
}

@Injectable({
    providedIn: 'root'
})
export class AnswerValidatorFactory {
    private static readonly exactMatchValidator = new ExactMatchValidator();
    private static readonly caseInsensitiveValidator = new CaseInsensitiveValidator();

    public createValidator(settings: AnswerValidationSettings) {
        let validators: AnswerValidator[] = [AnswerValidatorFactory.exactMatchValidator];

        if(!settings.caseSensitive) {
            validators.push(AnswerValidatorFactory.caseInsensitiveValidator);
        }

        if(settings.maxErrors > 0) {
           validators.push(new LevenshteinDistanceValidator(settings.maxErrors, settings.caseSensitive));
        }

        return new CompositeValidator(validators);
    }
}