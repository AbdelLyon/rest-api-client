import { ApiService } from './ApiService';
import { Application } from '../models/Application';
export declare class ApplicationService extends ApiService<Application> {
    private static instances;
    private constructor();
    static getInstance(domain: string, baseUrl: string): ApplicationService;
    static resetInstance(domain?: string, baseUrl?: string): void;
}
