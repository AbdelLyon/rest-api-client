import { BaseModel } from './common';
export interface MediaApplication extends BaseModel {
    original_url: string;
    preview_url: string;
}
export interface PackApplication extends BaseModel {
    name: string;
    slug: string;
}
export interface Profile extends BaseModel {
    application_id: string;
    label: string;
    is_visible: number;
    translate_label: string;
    application: Application;
}
export interface Application extends BaseModel {
    id: string;
    pack_id: string;
    name: string;
    slug: string;
    url: string;
    android_link: string | null;
    apple_link: string | null;
    has_mobile_application: boolean;
    last_version_supported: string;
    is_under_maintenance: boolean;
    default_order: number;
    translate_description: string;
    media: MediaApplication[];
    profiles: Profile[];
    pack: PackApplication;
}
