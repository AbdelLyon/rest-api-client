export interface DeleteRequest {
  resources: Array<number>;
}

export interface DeleteResponse<T> {
  data: Array<T>;
  meta?: {
    gates?: {
      authorized_to_create?: boolean;
      [key: string]: boolean | undefined;
    };
  };
}
