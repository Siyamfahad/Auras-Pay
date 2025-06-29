export type DefaultThemes =
  | "Default"
  | "BlackKnight"
  | "WhitePrince"
  | "GreenLime"
  | "YellowLaserLemon"
  | "BlueLagoon"
  | "RedVermilion"
  | "OrangeTangerine"
  | "PinkQueen"
  | "PurpleMajorelle";

export type Theme = {
  theme: DefaultThemes | string;
};
