import { supabase } from "./supabase";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

type PublicDatabaseErrorInfo = {
  type: "database";
  error: string;
  operationType: OperationType;
  path: string | null;
};

export async function handleDatabaseError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: PublicDatabaseErrorInfo = {
    type: "database",
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };

  // Ne jamais exposer de détails d'auth/session au runtime frontend.
  // On loggue en dev, et on renvoie un message sérialisé minimal.
  if (import.meta.env.DEV) {
    console.error("Database Error:", errInfo);
  }
  throw new Error(JSON.stringify(errInfo));
}

export async function handleStorageError(error: unknown, path: string) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    type: "storage",
    path,
  };
  if (import.meta.env.DEV) {
    console.error("Storage Error:", errInfo);
  }
  return errInfo;
}
