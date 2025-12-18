import episodesData from '@/data/episodes.json';
import slidesData from '@/data/slides.json';
import type { Season, Episode, Slide } from '@/types';

// Type assertion for the imported JSON
const data = episodesData as { seasons: Season[] };
const slides = slidesData as Record<string, Slide[]>;

export function getAllSeasons(): Season[] {
  return data.seasons;
}

export function getSeasonById(id: string): Season | undefined {
  return data.seasons.find(season => season.id === id);
}

export function getAllEpisodes(): Episode[] {
  return data.seasons.flatMap(season => season.episodes);
}

export function getEpisodeById(id: string): Episode | undefined {
  return getAllEpisodes().find(episode => episode.id === id);
}

export function getEpisodesBySeasonId(seasonId: string): Episode[] {
  const season = getSeasonById(seasonId);
  return season?.episodes ?? [];
}

export function getAdjacentEpisodes(episodeId: string): {
  previous: Episode | null;
  next: Episode | null;
} {
  const allEpisodes = getAllEpisodes();
  const currentIndex = allEpisodes.findIndex(ep => ep.id === episodeId);

  return {
    previous: currentIndex > 0 ? allEpisodes[currentIndex - 1] : null,
    next: currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null,
  };
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatEpisodeNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

export function getSlidesByEpisodeId(episodeId: string): Slide[] {
  return slides[episodeId] ?? [];
}
