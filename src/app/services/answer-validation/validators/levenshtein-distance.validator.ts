import { AnswerResult } from "../../../models/answer-result.model";
import { AnswerValidator } from "../answer-validator";

export class LevenshteinDistanceValidator implements AnswerValidator {
    constructor(
        private maxAllowedDistance: number,
        private caseSensitive: boolean
    ) { }

    validate(answer: string, correctAnswers: string[]): AnswerResult {
        if (!this.caseSensitive) {
            answer = answer.toLowerCase();
            correctAnswers = correctAnswers.map(a => a.toLowerCase());
        }

        for (let correctAnswer of correctAnswers) {
            let distance = this.levenshteinDistance(answer, correctAnswer);
            if (distance === 0) {
                return AnswerResult.Correct;
            } else if (distance <= this.maxAllowedDistance) {
                return AnswerResult.AlmostCorrect;
            }
        }

        return AnswerResult.Incorrect;
    }

    private levenshteinDistance(str1: string, str2: string): number {
        const len1 = str1.length;
        const len2 = str2.length;

        // Create a 2D array (matrix) to store distances
        const dp: number[][] = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

        // Initialize the first row and column
        for (let i = 0; i <= len1; i++) {
            dp[i][0] = i; // Cost of deletions
        }

        for (let j = 0; j <= len2; j++) {
            dp[0][j] = j; // Cost of insertions
        }

        // Fill the matrix using dynamic programming
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                // If characters match, no cost. Otherwise, cost is 1 (substitution)
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

                // Take the minimum cost among: deletion, insertion, or substitution
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,   // Deletion
                    dp[i][j - 1] + 1,   // Insertion
                    dp[i - 1][j - 1] + cost // Substitution
                );
            }
        }

        // Return the Levenshtein distance (bottom-right corner of the matrix)
        return dp[len1][len2];
    }
}