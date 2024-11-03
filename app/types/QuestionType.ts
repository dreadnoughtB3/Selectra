export type QuestionType = {
  question: string;
  choices: ChoicesType[];
};

export type ChoicesType = {
  choiceName: string;
  paramChanges: ParamChangesType[];
};

export type ParamChangesType = {
  targetParamName: string;
  changeValues: number
}