import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { handleStorageError } from "./errorHandling";

export const uploadFileToFirebase = async (file: File): Promise<string> => {
  const path = `portfolio/${Date.now()}_${file.name}`;
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    handleStorageError(error, path);
    throw error;
  }
};
