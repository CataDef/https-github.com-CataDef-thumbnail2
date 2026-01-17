
export enum ThumbnailStyle {
  AUTHORITY = 'The Authority (Hormozi)',
  STORYTELLER = 'The Storyteller (Beast 2026)',
  MINIMALIST = 'The Minimalist Paradox'
}

export type AspectRatio = '16:9' | '9:16';
export type ImageSize = '1K' | '2K';

export interface ThumbnailConcept {
  style: ThumbnailStyle;
  hookText: string;
  visualPrompt: string;
  psychology: string;
}

export interface GenerationResult {
  concepts: ThumbnailConcept[];
  thumbnails: { [key: string]: string }; // style -> base64/url
}

export interface AnalysisData {
  promise: string;
  mechanism: string;
  audience: string;
  concepts: ThumbnailConcept[];
}
