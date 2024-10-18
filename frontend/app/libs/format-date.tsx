export const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
