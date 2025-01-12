import { Client } from '../models/Client';
import { ApiService } from './ApiService';
export declare class ClientService extends ApiService<Client> {
    private static instances;
    private constructor();
    static getInstance(domain: string, baseUrl: string): ClientService;
    static resetInstance(domain?: string, baseUrl?: string): void;
}
