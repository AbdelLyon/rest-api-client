var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { HttpCLient } from "../http/HttpClient.js";
class Auth {
  constructor(pathname, schemas, httpInstanceName) {
    __publicField(this, "http");
    __publicField(this, "pathname");
    __publicField(this, "userSchema");
    __publicField(this, "credentialsSchema");
    __publicField(this, "registerDataSchema");
    __publicField(this, "tokenSchema");
    // Optionnellement utiliser un nom d'instance spécifique
    __publicField(this, "httpInstanceName");
    this.pathname = pathname;
    this.userSchema = schemas.user;
    this.credentialsSchema = schemas.credentials;
    this.registerDataSchema = schemas.registerData;
    this.tokenSchema = schemas.tokens;
    this.httpInstanceName = httpInstanceName;
    this.initHttpClient();
    this.http = HttpCLient.getInstance(this.httpInstanceName);
  }
  initHttpClient() {
    this.http = HttpCLient.getInstance(this.httpInstanceName);
  }
  async register(userData, options = {}) {
    if (this.registerDataSchema) {
      this.registerDataSchema.parse(userData);
    }
    try {
      const response = await this.http.request(
        {
          method: "POST",
          url: `${this.pathname}/register`,
          data: userData
        },
        options
      );
      const user = this.userSchema.parse(response.user);
      if (this.tokenSchema) {
        this.tokenSchema.parse(response.tokens);
      }
      return user;
    } catch (error) {
      console.error("Registration error", error);
      throw error;
    }
  }
  async login(credentials, options = {}) {
    if (this.credentialsSchema) {
      this.credentialsSchema.parse(credentials);
    }
    try {
      const response = await this.http.request(
        {
          method: "POST",
          url: `${this.pathname}/login`,
          data: credentials
        },
        options
      );
      const user = this.userSchema.parse(response.user);
      const tokens = this.tokenSchema ? this.tokenSchema.parse(response.tokens) : response.tokens;
      return { user, tokens };
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  }
  async logout(options = {}) {
    try {
      await this.http.request(
        {
          method: "POST",
          url: `${this.pathname}/logout`
        },
        options
      );
    } catch (error) {
      console.error("Logout error", error);
      throw error;
    }
  }
  async refreshToken(refreshToken, options = {}) {
    try {
      const response = await this.http.request(
        {
          method: "POST",
          url: `${this.pathname}/refresh-token`,
          data: { refreshToken }
        },
        options
      );
      return this.tokenSchema ? this.tokenSchema.parse(response) : response;
    } catch (error) {
      console.error("Token refresh error", error);
      throw error;
    }
  }
  async getCurrentUser(options = {}) {
    try {
      const response = await this.http.request(
        {
          method: "GET",
          url: `${this.pathname}/me`
        },
        options
      );
      return this.userSchema.parse(response);
    } catch (error) {
      console.error("Get current user error", error);
      throw error;
    }
  }
}
export {
  Auth
};
//# sourceMappingURL=Auth.js.map
