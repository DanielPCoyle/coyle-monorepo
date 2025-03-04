import { describe, expect, it, vi } from 'vitest';
import { disconnect } from '../disconnect';

describe('disconnect', () => {
    it('should remove the user from peopleOnSite and conversations on disconnect', () => {
        const socket = { id: '123', on: vi.fn((event, callback) => callback()) };
        const io = { emit: vi.fn() };
        const peopleOnSite = [{ socketId: '123' }, { socketId: '456' }];
        const conversations = [{ socketId: '123' }, { socketId: '789' }];

        disconnect({ socket, io, peopleOnSite, conversations });

        expect(peopleOnSite).toEqual([undefined, { socketId: '456' }]);
        expect(conversations).toEqual([undefined, { socketId: '789' }]);
        expect(io.emit).toHaveBeenCalledWith('conversations', [undefined, { socketId: '789' }]);
    });

    it('should not remove anything if socket id is not found', () => {
        const socket = { id: '999', on: vi.fn((event, callback) => callback()) };
        const io = { emit: vi.fn() };
        const peopleOnSite = [{ socketId: '123' }, { socketId: '456' }];
        const conversations = [{ socketId: '123' }, { socketId: '789' }];

        disconnect({ socket, io, peopleOnSite, conversations });

        expect(peopleOnSite).toEqual([{ socketId: '123' }, { socketId: '456' }]);
        expect(conversations).toEqual([{ socketId: '123' }, { socketId: '789' }]);
        expect(io.emit).not.toHaveBeenCalled();
    });
});