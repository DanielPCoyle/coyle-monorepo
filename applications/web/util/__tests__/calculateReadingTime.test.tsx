import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '../calculateReadingTime';

describe('calculateReadingTime', () => {
    it('should return "1 min read" for text with 200 words', () => {
        const text = 'word '.repeat(200).trim();
        const result = calculateReadingTime(text);
        expect(result).toBe('1 min read');
    });

    it('should return "2 min read" for text with 400 words', () => {
        const text = 'word '.repeat(400).trim();
        const result = calculateReadingTime(text);
        expect(result).toBe('2 min read');
    });

    it('should return "1 min read" for text with 199 words', () => {
        const text = 'word '.repeat(199).trim();
        const result = calculateReadingTime(text);
        expect(result).toBe('1 min read');
    });

    it('should return "3 min read" for text with 600 words', () => {
        const text = 'word '.repeat(600).trim();
        const result = calculateReadingTime(text);
        expect(result).toBe('3 min read');
    });

});