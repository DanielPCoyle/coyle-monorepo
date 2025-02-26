import { server } from '@backend-api/http-server';

type RequestHeaders = Record<string, string>;

export type Requester = (options: {
  headers: RequestHeaders;
}) => ReturnType<(typeof server)['inject']>;

type RequesterOptions = {
  path?: string;

  defaultHeaders?: RequestHeaders;
};

type RequesterWithBodyOptions<T> = Omit<RequesterOptions, 'defaultHeaders'> & {
  defaultBody?: T | (() => T);

  defaultHeaders?: RequestHeaders | ((body: T) => RequestHeaders);
};

type RequestOptions = {
  path?: string;

  headers?: RequestHeaders;
};

type RequestWithBodyOptions<T> = RequestOptions & {
  body?: T;
};

export function getDELETERequester(options: RequesterOptions) {
  return ({
    path = options.path,

    headers = options.defaultHeaders,
  }: RequestOptions = {}) => {
    if (!path) {
      throw new Error('Missing "path" parameters');
    }

    if (!headers) {
      throw new Error('Missing "headers" parameters');
    }

    return server.inject().delete(path).headers(headers);
  };
}

export function getGETRequester(options: RequesterOptions) {
  return ({
    path = options.path,

    headers = options.defaultHeaders,
  }: RequestOptions = {}) => {
    if (!path) {
      throw new Error('Missing "path" parameters');
    }

    if (!headers) {
      throw new Error('Missing "headers" parameters');
    }

    return server.inject().get(path).headers(headers);
  };
}

export function getPATCHRequester<T>(options: RequesterWithBodyOptions<T>) {
  const defaultBodyFactory =
    typeof options.defaultBody === 'function'
      ? (options.defaultBody as () => T)
      : ((() => options.defaultBody) as () => T);

  const defaultHeadersFactory =
    typeof options.defaultHeaders === 'function'
      ? (options.defaultHeaders as (body: T) => RequestHeaders)
      : ((() => options.defaultHeaders) as (body: T) => RequestHeaders);

  return ({
    path = options.path,

    body = defaultBodyFactory(),
    headers = defaultHeadersFactory(body),
  }: RequestWithBodyOptions<T> = {}) => {
    if (!path) {
      throw new Error('Missing "path" parameters');
    }

    if (!body) {
      throw new Error('Missing "body" parameters');
    }

    if (!headers) {
      throw new Error('Missing "headers" parameters');
    }

    return server.inject().patch(path).body(body).headers(headers);
  };
}

export function getPOSTRequester<T>(options: RequesterWithBodyOptions<T>) {
  const defaultBodyFactory =
    typeof options.defaultBody === 'function'
      ? (options.defaultBody as () => T)
      : ((() => options.defaultBody) as () => T);

  const defaultHeadersFactory =
    typeof options.defaultHeaders === 'function'
      ? (options.defaultHeaders as (body: T) => RequestHeaders)
      : ((() => options.defaultHeaders) as (body: T) => RequestHeaders);

  return ({
    path = options.path,

    body = defaultBodyFactory(),
    headers = defaultHeadersFactory(body),
  }: RequestWithBodyOptions<T> = {}) => {
    if (!path) {
      throw new Error('Missing "path" parameters');
    }

    if (!body) {
      throw new Error('Missing "body" parameters');
    }

    if (!headers) {
      throw new Error('Missing "headers" parameters');
    }

    return server.inject().post(path).body(body).headers(headers);
  };
}

export function getPUTRequester<T>(options: RequesterWithBodyOptions<T>) {
  const defaultBodyFactory =
    typeof options.defaultBody === 'function'
      ? (options.defaultBody as () => T)
      : ((() => options.defaultBody) as () => T);

  const defaultHeadersFactory =
    typeof options.defaultHeaders === 'function'
      ? (options.defaultHeaders as (body: T) => RequestHeaders)
      : ((() => options.defaultHeaders) as (body: T) => RequestHeaders);

  return ({
    path = options.path,

    body = defaultBodyFactory(),
    headers = defaultHeadersFactory(body),
  }: RequestWithBodyOptions<T> = {}) => {
    if (!path) {
      throw new Error('Missing "path" parameters');
    }

    if (!body) {
      throw new Error('Missing "body" parameters');
    }

    if (!headers) {
      throw new Error('Missing "headers" parameters');
    }

    return server.inject().put(path).body(body).headers(headers);
  };
}
