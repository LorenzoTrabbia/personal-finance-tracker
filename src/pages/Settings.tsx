import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Types
import { currencyOptions } from "../types/Currency";
import { useAppContext } from "../context/useAppContext";
import { updateTransactionsCurrency } from "../utils/updateTransactionsCurrency";
import { avatars } from "../types/Avatars";

// Icons
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export default function Settings() {
    const user = auth.currentUser;
    const { refreshPreferences } = useAppContext();

    const [displayName, setDisplayName] = useState("");
    const [currency, setCurrency] = useState("");
    const [message, setMessage] = useState("");

    // Email/password state
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [authMessage, setAuthMessage] = useState("");

    // Password visibility toggles
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Avatar selection state
    const [selectedAvatar, setSelectedAvatar] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                if (user.displayName) setDisplayName(user.displayName);

                const prefDoc = await getDoc(doc(db, "users", user.uid, "preferences", "settings"));
                if (prefDoc.exists()) {
                    const prefs = prefDoc.data();
                    if (prefs.currency) setCurrency(prefs.currency);
                    if (prefs.avatar) setSelectedAvatar(prefs.avatar);
                }

                setNewEmail(user.email || "");
            }
        };
        fetchData();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!user) return;

        try {
            const preferencesRef = doc(db, "users", user.uid, "preferences", "settings");
            const oldPrefSnap = await getDoc(preferencesRef);
            const oldCurrency = oldPrefSnap.exists() ? oldPrefSnap.data().currency : null;

            await updateProfile(user, { displayName });
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { displayName });

            await setDoc(preferencesRef, { currency, avatar: selectedAvatar }, { merge: true });

            if (oldCurrency && currency !== oldCurrency) {
                await updateTransactionsCurrency(user.uid, oldCurrency, currency);
            }

            await refreshPreferences();
            setMessage("Settings successfully saved!");
        } catch (error) {
            console.error(error);
            setMessage("Error while saving.");
        }
    };

    const handleCredentialsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");
        setAuthMessage("");

        if (!user || !user.email) return;

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            if (newEmail && newEmail !== user.email) {
                await updateEmail(user, newEmail);
            }

            if (newPassword) {
                await updatePassword(user, newPassword);
            }

            setAuthMessage("Email and/or password successfully updated!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err: unknown) {
            console.error(err);
            setAuthError("Error: incorrect password or operation not permitted.");
        }
    };

    const isPasswordUser = user?.providerData[0]?.providerId === "password";

    return (
        <div className="mx-auto max-w-5xl px-5 py-8 text-light-text-primary dark:text-dark-text-primary sm:px-8 lg:px-10 lg:py-10">
            <div className="relative mb-8 overflow-hidden rounded-3xl bg-dark-primary px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
                <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="relative"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Preferences</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h2><p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">Personalize your workspace and keep your account details up to date.</p></div>
            </div>
            <div className="rounded-3xl border border-light-border bg-light-card p-6 shadow-sm dark:border-dark-border dark:bg-dark-card sm:p-8">

            {/* Form for displayName and currency */}
            <form onSubmit={handleSave} className="flex flex-col space-y-5">
                <div className="border-b border-light-border pb-5 dark:border-dark-border"><h3 className="text-lg font-semibold">Workspace preferences</h3><p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">Choose how your account looks and displays amounts.</p></div>
                <label className="text-sm font-medium">Display name
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border border-light-border bg-light-background px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-dark-border dark:bg-dark-background"
                    placeholder="Your name"
                />
                </label>

                <label className="text-sm font-medium">Currency
                    <div className="relative">
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="select-modern mt-2 h-12 w-full px-4 pr-10 text-sm"
                        >
                            <option value="">Select currency</option>
                            {currencyOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            <ChevronDown className="h-5 w-5" />
                        </div>
                    </div>
                </label>

                <div>
                    <label className="mb-2 block text-sm font-medium">Choose your avatar</label>
                    <div className="flex space-x-4 overflow-x-auto prevent-sidebar-swipe">
                        {avatars.map((avatar) => (
                            <img
                                key={avatar}
                                src={`/avatars/${avatar}`}
                                alt={avatar}
                                onClick={() => setSelectedAvatar(avatar)}
                                className={`h-16 w-16 cursor-pointer rounded-2xl border-2 transition ${selectedAvatar === avatar
                                    ? "border-emerald-500 ring-4 ring-emerald-500/15"
                                    : "border-transparent hover:border-slate-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>


                <button type="submit" className="h-11 rounded-xl bg-light-primary px-5 font-semibold text-white transition hover:opacity-90 dark:bg-emerald-500 dark:text-dark-primary">
                    Save
                </button>

                {message && (
                    <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                        {message}
                    </p>
                )}
            </form>

            {/* Form to change email/password */}
            {isPasswordUser && (
                <>
                    <div className="mt-10 border-t border-light-border pt-8 dark:border-dark-border"><h3 className="text-lg font-semibold">Account credentials</h3>
                    <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">Update your email or password securely.</p>
                    </div>
                    <form onSubmit={handleCredentialsUpdate} className="mt-5 flex flex-col space-y-4">
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="h-12 rounded-xl border border-light-border bg-light-background px-4 text-sm dark:border-dark-border dark:bg-dark-background"
                            placeholder="New email"
                        />

                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="h-12 w-full rounded-xl border border-light-border bg-light-background px-4 pr-10 text-sm dark:border-dark-border dark:bg-dark-background"
                                placeholder="Current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                aria-label="Toggle password visibility"
                            >
                                {showCurrentPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-12 w-full rounded-xl border border-light-border bg-light-background px-4 pr-10 text-sm dark:border-dark-border dark:bg-dark-background"
                                placeholder="New password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                aria-label="Toggle password visibility"
                            >
                                {showNewPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>


                        <button type="submit" className="h-12 rounded-xl bg-light-primary py-2 font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-dark-primary dark:hover:bg-emerald-400">
                            Update Credentials
                        </button>

                        {authMessage && (
                            <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                                {authMessage}
                            </p>
                        )}
                        {authError && (
                            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                                {authError}
                            </p>
                        )}

                    </form>
                </>
            )}
            </div>
        </div>
    );
}
