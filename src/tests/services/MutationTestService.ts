// import type { AxiosInstance } from "axios";
// import type { User } from "@/rest-api/models";
// import { Mutation } from "@/rest-api/services/Mutation";

// export class MutationTestService extends Mutation<User> {
//   private static instances: Map<string, MutationTestService> = new Map();

//   private constructor(pathname: string) {
//     super(pathname);
//   }

//   static getInstance(pathname: string): MutationTestService {
//     if (!this.instances.has(pathname)) {
//       this.instances.set(pathname, new MutationTestService(pathname));
//     }

//     return this.instances.get(pathname) ?? new MutationTestService(pathname);
//   }

//   static resetInstance(pathname?: string): void {
//     if (pathname !== undefined && pathname !== "") {
//       this.instances.delete(pathname);
//     } else {
//       this.instances.clear();
//     }
//   }
//   public _setAxiosInstanceForTesting(axiosInstance: AxiosInstance): void {
//     this.setAxiosInstance(axiosInstance);
//   }
// }
