import type { HttpRequest } from "../http/Request/HttpRequest";
import type {
  DetailsResponse,
  IQuery,
  PaginatedSearchRequest,
  SearchRequest,
  SearchResponse,
  ComparisonOperator,
} from "./types";
import type { z } from "zod";
import type { RequestConfig } from "@/http/types";
import { HttpClient } from "@/http/HttpClient";
import { SearchBuilder } from "./SearchBuilder";
import { DetailsBuilder } from "./DetailsBuilder";

type ExtractKeys<T> = keyof T & string;

type ValueForField<T, K extends keyof T> =
  T[K] extends Array<infer U>
    ? U | U[]
    : T[K] extends (infer V)[]
      ? V | V[]
      : T[K];

export abstract class Query<T> implements IQuery<T> {
  protected http: HttpRequest;
  protected pathname: string;
  protected schema: z.ZodType<T>;

  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  ) {
    this.http = HttpClient.getInstance(httpInstanceName);
    this.pathname = pathname;
    this.schema = schema;
  }

  private validateData(data: Array<unknown>): Array<T> {
    return data.map((item) => {
      const result = this.schema.safeParse(item);
      if (!result.success) {
        console.error("Type validation failed:", result.error.errors);
        throw new Error(
          `Type validation failed: ${JSON.stringify(result.error.errors)}`,
        );
      }
      return result.data;
    });
  }

  private searchRequest(
    search: SearchRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<SearchResponse<T>> {
    return this.http.request<SearchResponse<T>>(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search },
      },
      options,
    );
  }

  public async search<TResponse = Array<T>>(
    search: SearchRequest | PaginatedSearchRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    const response = await this.searchRequest(search, options);
    const validatedData = this.validateData(response.data);

    const isPaginated = "page" in search || "limit" in search;

    if (isPaginated) {
      return {
        ...response,
        data: validatedData,
      } as unknown as TResponse;
    }
    return validatedData as unknown as TResponse;
  }

  public createSearchBuilder<U extends T = T>(): SearchBuilder<U> {
    return new SearchBuilder<U>();
  }

  public async executeSearch<TResponse = Array<T>>(
    builder: SearchBuilder<T>,
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    return await this.search<TResponse>(builder.build(), options);
  }

  public async searchByText<TResponse = Array<T>>(
    text: string,
    page?: number,
    limit?: number,
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    const builder = this.createSearchBuilder().withText(text);

    if (page !== undefined && limit !== undefined) {
      builder.withPagination(page, limit);
    }

    return this.executeSearch<TResponse>(builder, options);
  }

  public async searchByField<K extends ExtractKeys<T>, TResponse = Array<T>>(
    field: K,
    operator: ComparisonOperator,
    value: ValueForField<T, K>,
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    const builder = this.createSearchBuilder().withFilter(
      field,
      operator,
      value,
    );
    return this.executeSearch<TResponse>(builder, options);
  }

  public createDetailsBuilder<U extends T = T>(): DetailsBuilder<U> {
    return new DetailsBuilder<U>(this as IQuery<U>);
  }
  /**
   * Méthode existante pour récupérer les détails
   */
  public details(
    options: Partial<RequestConfig> = {},
  ): Promise<DetailsResponse> {
    return this.http.request<DetailsResponse>(
      {
        method: "GET",
        url: this.pathname,
      },
      options,
    );
  }
}

//==============================================

// Type inféré à partir du schéma
// type User = {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   status: string;
//   createdAt: string;
//   profile: { id: string; name: string };
// };

// // Classe UserQuery qui étend Query
// class UserQuery extends Query<User> {
//   constructor(httpInstanceName?: string) {
//     super("/api/users", null, httpInstanceName);
//   }
// }

// export async function userExample() {
//   try {
//     const userQuery = new UserQuery();

//     // Exemple 1: Recherche avec SearchBuilder
//     console.log("Exemple 1: Recherche d'utilisateurs administrateurs actifs");
//     const searchResult = await userQuery
//       .createSearchBuilder<User>()
//       .withText("john")
//       .withFilter("role", "=", "admin")
//       .withFilter("status", "=", "active")
//       .withSort("createdAt", "desc")
//       .withPagination(1, 20)
//       .search<SearchResponse<User>>();

//     console.log(`Trouvé ${searchResult.data.length} utilisateurs`);

//     // Exemple 2: Recherche avec inclusion de relations
//     console.log("\nExemple 2: Recherche avec inclusion du profil");
//     const withProfileResult = await userQuery
//       .createSearchBuilder<User>()
//       .withFilter("email", "=", "admin@example.com")
//       .withInclude("profile", {
//         // TypeScript vérifiera que "profile" est une relation valide
//         filters: [{ field: "id", operator: "=", value: "123" }],
//       })
//       .search<SearchResponse<User>>();

//     console.log("Profil inclus:", withProfileResult.data[0]?.profile);

//     // Exemple 3: Utilisation du DetailsBuilder
//     console.log("\nExemple 3: Obtenir les détails de la ressource User");
//     const userDetails = await userQuery
//       .createDetailsBuilder<User>()
//       .withHeader("Cache-Control", "no-cache")
//       .withParam("fields", "id,name,email,role,status")
//       .withParam("include", "validations")
//       .withTimeout(5000)
//       .details();

//     console.log(
//       "Détails de l'API User:",
//       `${userDetails.data.fields.length} champs`,
//       `${userDetails.data.actions.length} actions`,
//     );

//     // Exemple 4: Utilisation de raccourcis pour les recherches simples
//     console.log("\nExemple 4: Recherche simple par champ");
//     const byRoleResult = await userQuery.searchByField<
//       "role",
//       SearchResponse<User>
//     >("role", "=", "admin");

//     console.log(`Trouvé ${byRoleResult.data.length} administrateurs`);
//   } catch (error) {
//     console.error("Erreur lors de l'exécution des exemples:", error);
//   }
// }
