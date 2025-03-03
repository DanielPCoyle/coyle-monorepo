import { getConversations, getDB } from '@coyle/database';
import { conversations } from '@coyle/database/schema';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../db', () => ({
    getDB: vi.fn(),
}));

describe('getConversations', () => {
    it('should return a list of conversations', async () => {
        const mockData = [
            {
                id: 1,
                conversationKey: 'key1',
                name: 'John Doe',
                email: 'john@example.com',
                createdAt: new Date(),
                unSeenMessages: 2,
            },
            {
                id: 2,
                conversationKey: 'key2',
                name: 'Jane Doe',
                email: 'jane@example.com',
                createdAt: new Date(),
                unSeenMessages: 0,
            },
        ];

        const mockDB = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockResolvedValue(mockData),
        };

        (getDB as vi.Mock).mockReturnValue(mockDB);

        const result = await getConversations();

        expect(getDB).toHaveBeenCalled();
        expect(mockDB.select).toHaveBeenCalled();
        expect(mockDB.from).toHaveBeenCalledWith(conversations);
        expect(result).toEqual(mockData);
    });

    it('should handle empty conversations list', async () => {
        const mockDB = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockResolvedValue([]),
        };

        (getDB as vi.Mock).mockReturnValue(mockDB);

        const result = await getConversations();

        expect(getDB).toHaveBeenCalled();
        expect(mockDB.select).toHaveBeenCalled();
        expect(mockDB.from).toHaveBeenCalledWith(conversations);
        expect(result).toEqual([]);
    });
});