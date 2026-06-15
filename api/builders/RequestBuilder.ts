export abstract class RequestBuilder<T> {
  protected payload: Partial<T> = {};

  abstract build(): T;
}
