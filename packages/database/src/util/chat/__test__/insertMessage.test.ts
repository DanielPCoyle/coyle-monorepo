import { getDB, insertMessage } from '@coyle/database';
import { messages } from '@coyle/database/schema';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../db', () => ({
    getDB: vi.fn(),
}));

describe('insertMessage', () => {
    it('should insert a message and return the inserted data', async () => {
        const mockInsert = { text: 'Hello, world!' };
        const mockData = { id: 1, text: 'Hello, world!' };
        const mockDB = {
            insert: vi.fn().mockReturnThis(),
            values: vi.fn().mockReturnThis(),
            returning: vi.fn().mockReturnThis(),
            execute: vi.fn().mockResolvedValue([mockData]),
        };

        (getDB as vi.Mock).mockReturnValue(mockDB);

        const result = await insertMessage(mockInsert);

        expect(getDB).toHaveBeenCalled();
        expect(mockDB.insert).toHaveBeenCalledWith(messages);
        expect(mockDB.values).toHaveBeenCalledWith(mockInsert);
        expect(mockDB.returning).toHaveBeenCalled();
        expect(mockDB.execute).toHaveBeenCalled();
        expect(result).toEqual(mockData);
    });
});