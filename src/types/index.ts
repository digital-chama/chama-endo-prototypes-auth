export * from "./ui";
export * from "./db"
export * from "./models"
export * from "./api"
export * from "./auth"

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResponse<T> = Promise<{
  data?: T;
  errror?: string;
}>;
