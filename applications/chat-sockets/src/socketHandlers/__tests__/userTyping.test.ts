import { describe, expect, it, vi } from 'vitest';
import { userTyping } from '../userTyping.js';

vi.useFakeTimers();

describe('userTyping', () => {
    it('should emit "user typing" event and "user not typing" event after timeout', () => {
        const socket = {
            on: vi.fn((event, callback) => {
                if (event === 'user typing') {
                    callback({ conversationId: '123', username: 'testUser' });
                }
            }),
        };
        const io = {
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        };
        let typingTimeout;

        userTyping({ socket, io, typingTimeout });

        expect(socket.on).toHaveBeenCalledWith('user typing', expect.any(Function));
        expect(io.to).toHaveBeenCalledWith('123');
        expect(io.emit).toHaveBeenCalledWith('user typing', { username: 'testUser' });

        vi.advanceTimersByTime(1000);

        expect(io.emit).toHaveBeenCalledWith('user not typing', { username: 'testUser' });
    });

    it('should clear existing timeout if user types again before timeout', () => {
        const socket = {
            on: vi.fn((event, callback) => {
                if (event === 'user typing') {
                    callback({ conversationId: '123', username: 'testUser' });
                    callback({ conversationId: '123', username: 'testUser' });
                }
            }),
        };
        const io = {
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        };
        let typingTimeout;

        userTyping({ socket, io, typingTimeout });

        expect(socket.on).toHaveBeenCalledWith('user typing', expect.any(Function));
        expect(io.to).toHaveBeenCalledWith('123');
        expect(io.emit).toHaveBeenCalledWith('user typing', { username: 'testUser' });

        vi.advanceTimersByTime(500);

        expect(io.emit).not.toHaveBeenCalledWith('user not typing', { username: 'testUser' });

        vi.advanceTimersByTime(500);

        expect(io.emit).toHaveBeenCalledWith('user not typing', { username: 'testUser' });
    });
});