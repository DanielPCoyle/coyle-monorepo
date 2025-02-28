import { describe, expect, it } from 'vitest';

describe('Vitest Test Suite', () => {
    it('should add two numbers correctly', () => {
        const sum = 1 + 1;
        expect(sum).toBe(2);
    });

    it('should subtract two numbers correctly', () => {
        const difference = 5 - 3;
        expect(difference).toBe(2);
    });
});