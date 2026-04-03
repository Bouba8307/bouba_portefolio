import { uploadFile } from "./supabase";
import { handleStorageError } from "./errorHandling";

export const uploadPortfolioFile = async (file: File): Promise<string> => {
  const path = `${Date.now()}_${file.name}`;
  try {
    return await uploadFile(file);
  } catch (error) {
    await handleStorageError(error, path);
    throw error;
  }
};
