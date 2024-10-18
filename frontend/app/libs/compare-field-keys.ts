export const compareFieldKeys = (a: string, b: string) =>
  parseFloat(a.split('a')[1]) - parseFloat(b.split('a')[1]);
