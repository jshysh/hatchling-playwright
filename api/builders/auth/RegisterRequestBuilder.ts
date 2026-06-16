import { RequestBuilder } from '../RequestBuilder';
import { RegisterRequest } from '../../models/auth/RegisterRequest';

export class RegisterRequestBuilder extends RequestBuilder<RegisterRequest> {
  /**
   * Creates a builder pre-filled with sensible defaults.
   * Generates a unique email address on every call to ensure test independence.
   *
   * NOTE: turnstileToken uses a placeholder value. Confirm whether staging
   * bypasses Cloudflare Turnstile validation or requires a specific bypass token.
   */
  static default(): RegisterRequestBuilder {
    const builder = new RegisterRequestBuilder();
    const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    builder.payload = {
      email: `test+${uniqueSuffix}@example.com`,
      password: 'Password1!',
      name: 'Test User',
      turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
      acceptedTerms: true,
    };

    return builder;
  }

  withEmail(email: string): this {
    this.payload.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.payload.password = password;
    return this;
  }

  withName(name: string): this {
    this.payload.name = name;
    return this;
  }

  withTurnstileToken(token: string): this {
    this.payload.turnstileToken = token;
    return this;
  }

  withAcceptedTerms(accepted: boolean): this {
    this.payload.acceptedTerms = accepted;
    return this;
  }

  build(): RegisterRequest {
    const { email, password, name, turnstileToken, acceptedTerms } = this.payload;

    if (
      email === undefined ||
      password === undefined ||
      name === undefined ||
      turnstileToken === undefined ||
      acceptedTerms === undefined
    ) {
      throw new Error(
        'RegisterRequestBuilder: all fields are required. ' +
          'Call .default() or provide all fields before calling .build().'
      );
    }

    return { email, password, name, turnstileToken, acceptedTerms };
  }
}
