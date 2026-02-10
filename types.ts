
export type TimePeriod = 'GENESIS' | 'MODERN';
export type MoralState = 'GOOD' | 'EVIL';

export interface QuadrantData {
  id: string;
  period: TimePeriod;
  state: MoralState;
  title: string;
  description: string;
  verse?: string; // Biblical verse for Genesis sections
  imagePrompt: string;
  fallbackImageUrl: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  isLoading: boolean;
  error?: string;
}
