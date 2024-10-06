export class Test {
    public id: string = '';
    public name: string = '';
    public groups: string[] = [];
    public specialCharacters: string[] = [];
    public questions: Question[] = [];
}

export class Question {
    public text: string = '';
    public answers: string[] = [];
}