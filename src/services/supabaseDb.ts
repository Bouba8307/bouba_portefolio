import { supabase } from "./supabase";

export type JsonTable =
  | "projects"
  | "content_works"
  | "experiences"
  | "education"
  | "skills"
  | "settings"
  | "messages";

type DataRow = { id: string; data: Record<string, unknown> };

function rowToDoc<T extends { id: string }>(row: DataRow): T {
  return { id: row.id, ...row.data } as T;
}

export async function fetchAllRows<T extends { id: string }>(
  table: JsonTable,
): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("id, data");
  if (error) throw error;
  return (data ?? []).map((row) =>
    rowToDoc<T>(row as unknown as DataRow),
  );
}

export async function fetchLatestSettings(): Promise<Record<string, unknown> & {
  id: string;
} | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("id, data")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as DataRow;
  return { id: r.id, ...r.data };
}

export async function insertRow(
  table: JsonTable,
  payload: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from(table).insert({ data: payload });
  if (error) throw error;
}

export async function updateRowDataMerge(
  table: JsonTable,
  id: string,
  partial: Record<string, unknown>,
): Promise<void> {
  const { data: row, error: fetchErr } = await supabase
    .from(table)
    .select("data")
    .eq("id", id)
    .single();
  if (fetchErr) throw fetchErr;
  const merged = {
    ...((row?.data as Record<string, unknown>) ?? {}),
    ...partial,
  };
  const { error } = await supabase
    .from(table)
    .update({ data: merged })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteRow(table: JsonTable, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function rowExistsByJsonField(
  table: JsonTable,
  field: string,
  value: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .filter(`data->>${field}`, "eq", value)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}
