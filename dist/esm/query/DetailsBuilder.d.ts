import { RequestConfig } from '../http/types.js';
import { DetailsResponse, IQuery } from './types.js';
type ExtractKeys<T> = keyof T & string;
type ExtractRelationKeys<T> = {
    [K in keyof T]: T[K] extends Array<infer _> ? K & string : T[K] extends object ? K & string : never;
}[keyof T] & string;
export declare class DetailsBuilder<T> {
    private queryInstance?;
    private requestOptions;
    constructor(queryInstance?: IQuery<T>);
    withHeaders(headers: Record<string, string>): this;
    withHeader(name: string, value: string): this;
    withTimeout(timeout: number): this;
    withField<K extends ExtractKeys<T>>(field: K): this;
    withFields<K extends ExtractKeys<T>>(...fields: K[]): this;
    withInclude<K extends ExtractRelationKeys<T>>(relation: K): this;
    withIncludes<K extends ExtractRelationKeys<T>>(...relations: K[]): this;
    withParams(params: Record<string, string | number | boolean>): this;
    withParam(key: string, value: string | number | boolean): this;
    withCredentials(credentials: RequestCredentials): this;
    withSignal(signal: AbortSignal): this;
    withResponseType(type: "json" | "text" | "blob" | "arraybuffer"): this;
    details(): Promise<DetailsResponse>;
    build(): Partial<RequestConfig>;
}
export {};
