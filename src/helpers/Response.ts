export enum ResponseType {
  Ok,
  Error,
}

export class Response<T> {
  public type: ResponseType;
  public data?: T;
  public error?: string;
  private constructor(type: ResponseType, data?: T, error?: string) {
    this.type = type;
    this.data = data;
    this.error = error;
  }
  /**
   * Creates succesful response
   * @param data
   * @returns succesful response with data
   */
  public static ok<T>(data?: T): Response<T> {
    return new Response<T>(ResponseType.Ok, data);
  }

  /**
   * Creates error response
   * @param error error text
   * @returns error response with text
   */
  public static error<T>(error: string): Response<T> {
    return new Response<T>(ResponseType.Error, undefined, error);
  }
}
