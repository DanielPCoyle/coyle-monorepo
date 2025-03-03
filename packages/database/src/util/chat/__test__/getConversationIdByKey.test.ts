import { getConversationIdByKey, getDB } from '@coyle/database';
import { conversations as convos } from '@coyle/database/schema';
import { eq } from "drizzle-orm";
import { describe, expect, it, Mock, vi } from 'vitest';
vi.mock('../../../db', () => ({
    getDB: vi.fn(),
}));

describe('getConversationIdByKey', () => {
    it('should return the conversation ID for a given key', async () => {
        const mockKey = 'test-key';
        const mockConversation = [{ id: '12345' }];
        const mockDb = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValue(mockConversation),
        };

        (getDB as Mock).mockReturnValue(mockDb);

        const conversationId = await getConversationIdByKey(mockKey);

        expect(getDB).toHaveBeenCalled();
        expect(mockDb.select).toHaveBeenCalled();
        expect(mockDb.from).toHaveBeenCalledWith(convos);
        expect(mockDb.where).toHaveBeenCalledWith(eq(convos.conversationKey, mockKey));
        expect(conversationId).toBe('12345');
    });

    it('should throw an error if no conversation is found', async () => {
        const mockKey = 'non-existent-key';
        const mockDb = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValue([]),
        };

        (getDB as vi.Mock).mockReturnValue(mockDb);

        await expect(getConversationIdByKey(mockKey)).rejects.toThrow();
    });
});