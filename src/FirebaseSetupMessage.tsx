import { missingFirebaseConfig } from "./firebaseConfig";

export default function FirebaseSetupMessage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-light-background px-6 py-12 text-light-text-primary">
            <section className="w-full max-w-xl rounded-2xl border border-light-border bg-light-card p-8 shadow-sm">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-light-secondary">
                    Configuration required
                </p>
                <h1 className="mb-4 text-2xl font-bold">Connect your Firebase project</h1>
                <p className="mb-5 text-light-text-secondary">
                    The app cannot start until its Firebase environment variables are configured.
                    Add them to a local <code>.env</code> file or to your deployment environment,
                    then restart the development server.
                </p>
                <p className="mb-2 text-sm font-semibold">Missing variables:</p>
                <ul className="mb-6 list-disc space-y-1 pl-5 font-mono text-sm">
                    {missingFirebaseConfig.map((key) => (
                        <li key={key}>VITE_FIREBASE_{key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}</li>
                    ))}
                </ul>
                <p className="text-sm text-light-text-secondary">
                    Copy these values from Firebase Console → Project settings → Your apps → Web app.
                </p>
            </section>
        </main>
    );
}
