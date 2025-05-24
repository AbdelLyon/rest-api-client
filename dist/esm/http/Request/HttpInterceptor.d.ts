import { HttpConfig, RequestConfig } from '../types.js';
export declare class HttpInterceptor {
    private static requestInterceptors;
    private static responseSuccessInterceptors;
    private static responseErrorInterceptors;
    static addInterceptors(httpConfig: HttpConfig): void;
    static applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig>;
    static applyResponseSuccessInterceptors(response: Response): Promise<Response>;
    static applyResponseErrorInterceptors(error: Error): Promise<Error>;
    static setupDefaultErrorInterceptor(logCallback: (error: Error) => void): void;
}
