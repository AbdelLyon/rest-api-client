import { Application } from '../models/Application';
import { ApiService } from './ApiService';
export declare class ApplicationService extends ApiService<Application> {
    private static instances;
    private constructor();
    static getInstance(domain: string, baseUrl: string): ApplicationService;
    static resetInstance(domain?: string, baseUrl?: string): void;
}
