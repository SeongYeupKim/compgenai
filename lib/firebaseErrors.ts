import type { AuthError } from "firebase/auth";

/**
 * Maps Firebase Auth error codes to readable messages (and fixes misleading generic copy).
 */
export function formatAuthError(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as AuthError).code)
      : "";

  const messages: Record<string, string> = {
    "auth/email-already-in-use":
      "This email is already registered. Use “Log in” instead, or try another email.",
    "auth/invalid-email": "That email address doesn’t look valid.",
    "auth/weak-password":
      "Password is too weak. Use at least 8 characters with a mix of characters.",
    "auth/operation-not-allowed":
      "Email/password sign-in is turned off in Firebase. In Firebase Console → Authentication → Sign-in method, enable Email/Password.",
    "app/missing-firebase-config":
      err instanceof Error
        ? err.message
        : "This deployment was built without the Firebase keys. Set NEXT_PUBLIC_FIREBASE_* for Production, then redeploy.",
    "auth/invalid-api-key":
      "Firebase rejected the API key in this build. Copy apiKey, authDomain, projectId, storageBucket, messagingSenderId, and appId from the same Firebase web app config, set all six NEXT_PUBLIC_FIREBASE_* variables for Production, then redeploy.",
    "auth/network-request-failed":
      "Network error. Check your connection, VPN, or try again.",
    "auth/too-many-requests":
      "Too many attempts. Wait several minutes, then try again.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email. Register first.",
    "auth/wrong-password": "Wrong password.",
    "auth/invalid-credential": "Wrong email or password.",
    "auth/admin-restricted-operation":
      "This sign-in method is restricted in Firebase project settings.",
  };

  if (code && messages[code]) return messages[code];

  if (code) {
    return `Sign-in error: ${code}. If this persists, confirm Email/Password is enabled in Firebase and env vars match your Firebase project (especially on Vercel).`;
  }

  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Please try again.";
}
