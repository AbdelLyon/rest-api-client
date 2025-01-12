import { Site } from '../models/Site';
import { ApiService } from './ApiService';
export declare class SiteService extends ApiService<Site> {
    private static instances;
    private constructor();
    static getInstance(domain: string, baseUrl: string): SiteService;
    static resetInstance(domain?: string, baseUrl?: string): void;
}
