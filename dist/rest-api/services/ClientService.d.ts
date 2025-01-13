import { ApiService } from './ApiService';
import { Client } from '../models/Client';
export declare class ClientService extends ApiService<Client> {
    private static instances;
    private constructor();
    static getInstance(domain: string, baseUrl: string): ClientService;
    static resetInstance(domain?: string, baseUrl?: string): void;
}
