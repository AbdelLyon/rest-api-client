// src/tests/mocks/modelMocks.ts
import type { Role, RoleName, User } from "@/rest-api/models/User";
import type {
  Application,
  MediaApplication,
  PackApplication,
  Profile,
} from "@/rest-api/models/Application";
import type { Client } from "@/rest-api/models/Client";
import type { Site } from "@/rest-api/models/Site";
import type { SearchResponse } from "@/rest-api/types";

interface BaseModelFields {
  id: string;
  created_at: string;
  updated_at: string;
}

const generateBaseModelFields = (id?: string): BaseModelFields => ({
  id: id ?? String(Math.floor(Math.random() * 1000)),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const createMediaApplicationMock = (
  overrides: Partial<MediaApplication> = {},
): MediaApplication => ({
  ...generateBaseModelFields(),
  original_url: "https://example.com/media/original",
  preview_url: "https://example.com/media/preview",
  ...overrides,
});

export const createPackApplicationMock = (
  overrides: Partial<PackApplication> = {},
): PackApplication => ({
  ...generateBaseModelFields(),
  name: "Test Pack",
  slug: "test-pack",
  ...overrides,
});

export const createClientMock = (overrides: Partial<Client> = {}): Client => ({
  ...generateBaseModelFields(),
  is_demo_accessible: false,
  name: "Test Client",
  number_managers_can_validate: 2,
  referred_by: null,
  siret: "12345678901234",
  client_id: "client_" + Math.random().toString(36).slice(2, 11),
  country_alpha: "FR",
  ...overrides,
});

export const createSiteMock = (overrides: Partial<Site> = {}): Site => ({
  ...generateBaseModelFields(),
  client_id: "client_" + Math.random().toString(36).substr(2, 9),
  name: "Test Site",
  timezone: "Europe/Paris",
  country_alpha: "FR",
  city: "Paris",
  address: "123 Test Street",
  zipcode: "75001",
  client: createClientMock(),
  ...overrides,
});

export const createApplicationMock = (
  overrides: Partial<Application> = {},
): Application => {
  const applicationId = "app_" + Math.random().toString(36).slice(2, 11);

  return {
    ...generateBaseModelFields(applicationId),
    pack_id: "pack_" + Math.random().toString(36).slice(2, 11),
    name: "Test Application",
    slug: "test-app",
    url: "https://test.com",
    android_link: null,
    apple_link: null,
    has_mobile_application: false,
    last_version_supported: "1.0.0",
    is_under_maintenance: false,
    default_order: 1,
    translate_description: "Test application description",
    media: [createMediaApplicationMock()],
    profiles: [],
    pack: createPackApplicationMock(),
    ...overrides,
  };
};

export const createProfileMock = (
  overrides: Partial<Profile> = {},
): Profile => {
  const application = createApplicationMock();

  return {
    ...generateBaseModelFields(),
    application_id: application.id,
    label: "Test Profile",
    is_visible: 1,
    translate_label: "Test Profile Label",
    application: application,
    ...overrides,
  };
};

export const createRoleMock = (overrides: Partial<Role> = {}): Role => {
  const roleNames: Array<RoleName> = [
    "Director",
    "Users",
    "Auto Admin",
    "Admin",
    "Support",
    "Xefi Admin",
  ];

  return {
    ...generateBaseModelFields(),
    name: roleNames[Math.floor(Math.random() * roleNames.length)],
    guard_name: "api",
    translate_name: "Test Role",
    ...overrides,
  };
};

export const createUserMock = (overrides: Partial<User> = {}): User => ({
  ...generateBaseModelFields(),
  site_id: "site_" + Math.random().toString(36).slice(2, 11),
  manager_id: undefined,
  customer_id: undefined,
  firstname: "Test",
  lastname: "User",
  email: `test.user.${Math.random().toString(36).slice(2, 11)}@example.com`,
  phone_number: undefined,
  timezone: "Europe/Paris",
  language: "fr",
  applications: [createApplicationMock()],
  profiles: [createProfileMock()],
  site: createSiteMock(),
  gates: undefined,
  ...overrides,
});

export const createSearchResponseMock = <T>(
  data?: Array<T>,
  meta?: { page?: number; perPage?: number; total?: number },
): SearchResponse<T> => ({
  data: data || [createUserMock() as unknown as T],
  meta: {
    page: meta?.page ?? 1,
    perPage: meta?.perPage ?? 10,
    total: meta?.total ?? 1,
  },
});

// Générateurs de variations
export const createUserWithMultipleApplications = (
  count: number = 3,
): User => ({
  ...createUserMock(),
  applications: Array.from({ length: count }, () => createApplicationMock()),
});

export const createUserWithMultipleProfiles = (count: number = 3): User => ({
  ...createUserMock(),
  profiles: Array.from({ length: count }, () => createProfileMock()),
});
