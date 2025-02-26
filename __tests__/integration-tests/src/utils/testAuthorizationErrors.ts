import { it, expect } from 'vitest';

import type { Requester } from './getRequester';

export function testAuthorizationErrors(request: Requester): void {
  it('fails if authorization is missing', async () => {
    const response = await request({
      headers: {},
    });

    expect(response.statusCode).toEqual(401);
  });

  it('fails if authorization is invalid', async () => {
    const response = await request({
      headers: { authorization: '__INVALID__' },
    });

    expect(response.statusCode).toEqual(401);
  });
}
