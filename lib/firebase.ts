import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/** Trims accidental spaces from copy-paste (common cause of invalid-api-key). */
function e(key: string | undefined): string | undefined {
  if (key === undefined) return undefined;
  const t = key.trim();
  return t === "" ? undefined : t;
}

const firebaseConfig = {
  apiKey: e(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: e(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: e(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: e(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: e(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: e(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

const REQUIRED_PUBLIC_CONFIG = [
  ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
  ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", firebaseConfig.messagingSenderId],
  ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
] as const;

/** These values are compiled into the browser bundle. A later Vercel save does not update an existing deployment. */
export function assertFirebasePublicConfig(): void {
  const missing = REQUIRED_PUBLIC_CONFIG.filter(([, value]) => !value).map(
    ([name]) => name,
  );
  if (missing.length === 0) return;
  const err = new Error(
    `This deployment was built without ${missing.join(", ")}. Set every NEXT_PUBLIC_FIREBASE_* variable for Production in Vercel, then redeploy. Saving them after the last build does not update the live site.`,
  );
  (err as Error & { code?: string }).code = "app/missing-firebase-config";
  throw err;
}

function getFirebaseApp(): FirebaseApp {
  assertFirebasePublicConfig();
  if (getApps().length) return getApps()[0]!;
  return initializeApp(firebaseConfig);
}

export function getClientAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getClientDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
