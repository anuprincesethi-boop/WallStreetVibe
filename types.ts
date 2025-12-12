export enum AppMode {
  COMMENT_GENERATOR = 'COMMENT_GENERATOR',
  POST_CREATOR = 'POST_CREATOR',
}

export interface GeneratedItem {
  title?: string;
  content: string;
}

export interface GeneratedContent {
  id: string;
  text: string;
  type: 'comment' | 'post';
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

export interface GenerationRequest {
  mode: AppMode;
  input: string;
}

export interface ApiResponse {
  content: string[];
}