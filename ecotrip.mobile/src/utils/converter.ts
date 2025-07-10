export const formatDuration = (duration: number): string => {
  const totalSeconds = Math.round(duration * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours >= 1) {
    if (minutes === 0) return `${hours} h`;
    return `${hours} h ${minutes} min`;
  }

  if (minutes >= 1) {
    if (seconds === 0) return `${minutes} min`;
    return `${minutes} min ${seconds} s`;
  }

  return `${seconds} s`;
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};
