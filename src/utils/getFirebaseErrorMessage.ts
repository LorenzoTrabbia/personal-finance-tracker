import { FirebaseError } from "firebase/app";

const firebaseMessages: Record<string, string> = {
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/email-already-in-use": "An account already exists for this email.",
    "auth/weak-password": "Choose a stronger password (at least 6 characters).",
    "auth/popup-closed-by-user": "The sign-in window was closed before completing sign-in.",
    "auth/requires-recent-login": "Please sign in again before changing these credentials.",
};

export function getFirebaseErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof FirebaseError) {
        return firebaseMessages[error.code] ?? fallback;
    }

    return fallback;
}
