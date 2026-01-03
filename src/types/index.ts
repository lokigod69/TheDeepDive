// Episode and Season types for Psychoanalysis Sessions

export interface Episode {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string;
  date: string;
  duration: string; // Format: "MM:SS"
  durationSeconds: number;
  audioUrl: string;
  videoUrl?: string; // YouTube video ID or URL
  slides?: string[]; // URL paths to slide images
  transcript?: TranscriptSegment[];
}

export interface Slide {
  id: string;
  imageUrl: string;
  slideNumber: number;
  caption?: string;
  timestamp?: number; // Optional: seconds into audio when this slide is relevant
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

export interface Season {
  id: string;
  number: number;
  title: string;
  description?: string;
  year: string;
  episodes: Episode[];
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentEpisodeId: string | null;
  playbackSpeed: number;
}

export interface UIState {
  focusedEpisodeId: string | null;
  hoveredEpisodeId: string | null;
}
