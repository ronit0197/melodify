export const addToRecentlyPlayed = (songId: string) => {
  const recent = getRecentlyPlayed();
  const filtered = recent.filter(id => id !== songId);
  const updated = [songId, ...filtered].slice(0, 6);
  localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
};

export const getRecentlyPlayed = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('recentlyPlayed');
  return stored ? JSON.parse(stored) : [];
};