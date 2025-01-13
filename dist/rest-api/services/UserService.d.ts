import { ApiService } from './ApiService';
import { User } from '../models/User';
export declare class UserService extends ApiService<User> {
    private static instances;
    private constructor();
    static getInstance(domain: string, pathname: string): UserService;
    static resetInstance(domain?: string, pathname?: string): void;
}
