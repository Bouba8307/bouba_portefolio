import { supabase } from "./supabase";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface DatabaseErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export async function handleDatabaseError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  const errInfo: DatabaseErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user?.id,
      email: user?.email,
      emailVerified: Boolean(user?.email_confirmed_at),
      isAnonymous: !user?.email,
      tenantId: undefined,
      providerInfo: (user?.identities ?? []).map((i) => ({
        providerId: i.provider,
        displayName:
          (user?.user_metadata?.full_name as string | undefined) ?? null,
        email: user?.email ?? null,
        photoUrl:
          (user?.user_metadata?.avatar_url as string | undefined) ?? null,
      })),
    },
    operationType,
    path,
  };

  const errorString = JSON.stringify(errInfo);
  console.error("Database Error: ", errorString);
  throw new Error(errorString);
}

export async function handleStorageError(error: unknown, path: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    type: "storage",
    path,
    authInfo: {
      userId: user?.id,
      email: user?.email,
    },
  };
  console.error("Storage Error:", JSON.stringify(errInfo));
  return errInfo;
}
