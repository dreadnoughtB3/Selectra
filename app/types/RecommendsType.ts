export type RecommendsType = {
  recommendText: string;
  url: string;
  recommendParams: RecommendsParam[];
};

export type RecommendsParam = {
  paramsName: string;
  value: number;
}