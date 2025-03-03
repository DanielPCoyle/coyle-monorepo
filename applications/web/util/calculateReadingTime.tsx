// Reading time calculator

export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return `${Math.ceil(words / wordsPerMinute)} min read`;
}
