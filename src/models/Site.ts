import type { Client } from "./Client";
import type { BaseModel, Gates } from "./common";

export interface Site extends BaseModel {
  client_id: string;
  name: string;
  timezone: string;
  country_alpha: string;
  city: string;
  address: string;
  zipcode: string;
  client?: Client;
  gates?: Gates;
}
