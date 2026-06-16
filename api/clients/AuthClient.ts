import { APIResponse } from '@playwright/test';
import { ApiClient } from './ApiClient';
import { RegisterRequest } from '../models/auth/RegisterRequest';

export class AuthClient extends ApiClient {
  async register(payload: RegisterRequest): Promise<APIResponse> {
    return this.post('/auth/provider/register', { data: payload });
  }
}
