export type SeasonSelection = number | "all";

export interface SeasonOption {
  id: number;
  name: string;
  isActive: boolean;
  sessionCount: number;
}

export interface SeasonContext {
  seasons: SeasonOption[];
  activeSeason: SeasonOption;
  selectedSeason: SeasonOption | null;
  selection: SeasonSelection;
}
