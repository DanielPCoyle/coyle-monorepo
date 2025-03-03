import { describe, expect, it, vi } from 'vitest';
import { updateMessageAction } from '../updateMessageAction';

describe('updateMessageAction', () => {
    it('should emit "update messages result" with correct data', () => {
        const socket = {
            on: vi.fn((event, callback) => {
                if (event === 'update messages action') {
                    callback({ id: '123', messages: ['message1', 'message2'] });
                }
            })
        };
        const io = {
            to: vi.fn().mockReturnThis(),
            emit: vi.fn()
        };

        updateMessageAction({ socket, io });

        expect(socket.on).toHaveBeenCalledWith('update messages action', expect.any(Function));
        expect(io.to).toHaveBeenCalledWith('123');
        expect(io.emit).toHaveBeenCalledWith('update messages result', { convoId: '123', messages: ['message1', 'message2'] });
    });
});