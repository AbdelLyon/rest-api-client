import { Application, Profile } from './Application';
import { BaseModel, Gates } from './common';
import { Site } from './Site';
export type RoleName = "Director" | "Users" | "Auto Admin" | "Admin" | "Support" | "Xefi Admin";
export interface Role extends BaseModel {
    name: RoleName;
    guard_name: string;
    translate_name: string;
}
export type Roles = Role[];
export interface User extends BaseModel {
    site_id: string;
    manager_id?: string;
    customer_id?: string;
    firstname: string;
    lastname: string;
    email: string;
    phone_number?: string;
    timezone: string;
    language: string;
    applications: Application[];
    profiles?: Profile[];
    site?: Site;
    gates?: Gates;
}
