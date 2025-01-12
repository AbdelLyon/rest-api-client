import type { BaseModel } from "./common";

export interface Client extends BaseModel {
  is_demo_accessible: boolean;
  name: string;
  number_managers_can_validate: number;
  referred_by: string | null;
  siret: string;
  client_id: string;
  country_alpha: string;
}
