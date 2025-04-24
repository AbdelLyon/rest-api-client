import type { RequestConfig } from "@/http/types";
import type { DetailsResponse, IQuery } from "./types";

type ExtractKeys<T> = keyof T & string;
type ExtractRelationKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [K in keyof T]: T[K] extends Array<infer _>
    ? K & string
    : T[K] extends object
      ? K & string
      : never;
}[keyof T] &
  string;

export class DetailsBuilder<T> {
  private queryInstance?: IQuery<T>;
  private requestOptions: Partial<RequestConfig> = {};

  constructor(queryInstance?: IQuery<T>) {
    this.queryInstance = queryInstance;
  }

  public withHeaders(headers: Record<string, string>): this {
    this.requestOptions.headers = {
      ...this.requestOptions.headers,
      ...headers,
    };
    return this;
  }

  public withHeader(name: string, value: string): this {
    if (!this.requestOptions.headers) {
      this.requestOptions.headers = {};
    }
    this.requestOptions.headers[name] = value;
    return this;
  }

  public withTimeout(timeout: number): this {
    this.requestOptions.timeout = timeout;
    return this;
  }

  public withField<K extends ExtractKeys<T>>(field: K): this {
    return this.withParam("fields", field);
  }

  public withFields<K extends ExtractKeys<T>>(...fields: K[]): this {
    return this.withParam("fields", fields.join(","));
  }

  public withInclude<K extends ExtractRelationKeys<T>>(relation: K): this {
    return this.withParam("include", relation);
  }

  public withIncludes<K extends ExtractRelationKeys<T>>(
    ...relations: K[]
  ): this {
    return this.withParam("include", relations.join(","));
  }

  public withParams(params: Record<string, string | number | boolean>): this {
    const stringParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      stringParams[key] = String(value);
    });

    this.requestOptions.params = {
      ...this.requestOptions.params,
      ...stringParams,
    };
    return this;
  }

  public withParam(key: string, value: string | number | boolean): this {
    if (!this.requestOptions.params) {
      this.requestOptions.params = {};
    }
    this.requestOptions.params[key] = String(value);
    return this;
  }

  public withCredentials(credentials: RequestCredentials): this {
    this.requestOptions.credentials = credentials;
    return this;
  }

  public withSignal(signal: AbortSignal): this {
    this.requestOptions.signal = signal;
    return this;
  }

  public withResponseType(
    type: "json" | "text" | "blob" | "arraybuffer",
  ): this {
    this.requestOptions.responseType = type;
    return this;
  }

  public async details(): Promise<DetailsResponse> {
    if (!this.queryInstance) {
      throw new Error(
        "No query instance provided to execute the details request",
      );
    }
    return await this.queryInstance.details(this.build());
  }

  public build(): Partial<RequestConfig> {
    return this.requestOptions;
  }
}
