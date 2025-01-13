import { ApiService } from './ApiService';
import { Site } from '../models/Site';
export declare class SiteService extends ApiService<Site> {
    private static instances;
    private constructor();
    static getInstance(domain: string, baseUrl: string): SiteService;
    static resetInstance(domain?: string, baseUrl?: string): void;
}
