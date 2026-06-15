import { APIRequestContext, APIResponse } from '@playwright/test';

type RequestOptions = Parameters<APIRequestContext['get']>[1];

export class ApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseURL: string
  ) {}

  async get(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${path}`, options);
  }

  async post(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${path}`, options);
  }

  async put(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${path}`, options);
  }

  async patch(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.patch(`${this.baseURL}${path}`, options);
  }

  async delete(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${path}`, options);
  }
}
