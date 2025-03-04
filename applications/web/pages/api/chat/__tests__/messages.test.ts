import { describe, it, expect, vi } from 'vitest';
import { createMocks } from 'node-mocks-http';
import handler from '../messages'
import { getMessages } from '@coyle/database';

vi.mock('@coyle/database');

describe('/api/chat/messages API Endpoint', () => {
    it('should return messages for a given conversationKey', async () => {
        const conversationKey = 'test-conversation-key';
        const mockMessages = [{ id: 1, text: 'Hello' }, { id: 2, text: 'World' }];
        
        (getMessages as vi.Mock).mockResolvedValue(mockMessages);

        const { req, res } = createMocks({
            method: 'GET',
            query: {
                conversationKey,
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toEqual(mockMessages);
    });
});