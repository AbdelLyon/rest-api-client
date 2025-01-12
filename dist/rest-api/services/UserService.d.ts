import { User } from '../models/User';
import { ApiService } from './ApiService';
export declare class UserService extends ApiService<User> {
    private static instances;
    private constructor();
    static getInstance(domain: string, baseUrl: string): UserService;
    static resetInstance(domain?: string, baseUrl?: string): void;
}
