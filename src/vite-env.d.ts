/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: "AIzaSyA3ZnRGoxZUEWSLMMX0IYaeqfifxWsv7Tk"
  readonly VITE_FIREBASE_AUTH_DOMAIN: "portfolio-f1460.firebaseapp.com",
  readonly VITE_FIREBASE_PROJECT_ID: "portfolio-f1460",
  readonly VITE_FIREBASE_STORAGE_BUCKET: "portfolio-f1460.firebasestorage.app",
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: "234686191803",
  readonly VITE_FIREBASE_APP_ID: "1:234686191803:web:bc8b6f21c6ee3eb46cf19e"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
