import { ApiService } from './ApiService';
import { Role } from '../models/User';
export declare class RoleService extends ApiService<Role> {
    private static instances;
    private constructor();
    static getInstance(domain: string, baseUrl: string): RoleService;
    static resetInstance(domain?: string, baseUrl?: string): void;
}
