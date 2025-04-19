var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { HttpClient } from "../../http/HttpClient/index.es.js";
class Auth {
  constructor(pathname, schemas) {
    __publicField(this, "http");
    __publicField(this, "pathname");
    __publicField(this, "userSchema");
    __publicField(this, "credentialsSchema");
    __publicField(this, "registerDataSchema");
    __publicField(this, "tokenSchema");
    this.http = HttpClient.getInstance();
    this.pathname = pathname;
    this.userSchema = schemas.user;
    this.credentialsSchema = schemas.credentials;
    this.registerDataSchema = schemas.registerData;
    this.tokenSchema = schemas.tokens;
  }
  register(_0) {
    return __async(this, arguments, function* (userData, options = {}) {
      if (this.registerDataSchema) {
        this.registerDataSchema.parse(userData);
      }
      try {
        const response = yield this.http.request({
          method: "POST",
          url: `${this.pathname}/register`,
          data: userData
        }, options);
        const user = this.userSchema.parse(response.user);
        if (this.tokenSchema) {
          this.tokenSchema.parse(response.tokens);
        }
        return user;
      } catch (error) {
        console.error("Registration error", error);
        throw error;
      }
    });
  }
  login(_0) {
    return __async(this, arguments, function* (credentials, options = {}) {
      if (this.credentialsSchema) {
        this.credentialsSchema.parse(credentials);
      }
      try {
        const response = yield this.http.request({
          method: "POST",
          url: `${this.pathname}/login`,
          data: credentials
        }, options);
        const user = this.userSchema.parse(response.user);
        const tokens = this.tokenSchema ? this.tokenSchema.parse(response.tokens) : response.tokens;
        return { user, tokens };
      } catch (error) {
        console.error("Login error", error);
        throw error;
      }
    });
  }
  logout() {
    return __async(this, arguments, function* (options = {}) {
      try {
        yield this.http.request({
          method: "POST",
          url: `${this.pathname}/logout`
        }, options);
      } catch (error) {
        console.error("Logout error", error);
        throw error;
      }
    });
  }
  refreshToken(_0) {
    return __async(this, arguments, function* (refreshToken, options = {}) {
      try {
        const response = yield this.http.request({
          method: "POST",
          url: `${this.pathname}/refresh-token`,
          data: { refreshToken }
        }, options);
        return this.tokenSchema ? this.tokenSchema.parse(response) : response;
      } catch (error) {
        console.error("Token refresh error", error);
        throw error;
      }
    });
  }
  getCurrentUser() {
    return __async(this, arguments, function* (options = {}) {
      try {
        const response = yield this.http.request({
          method: "GET",
          url: `${this.pathname}/me`
        }, options);
        return this.userSchema.parse(response);
      } catch (error) {
        console.error("Get current user error", error);
        throw error;
      }
    });
  }
}
export {
  Auth
};
