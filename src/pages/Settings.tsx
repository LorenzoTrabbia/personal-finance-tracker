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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setAuthError("Error: incorrect password or operation not permitted.");
        }
    };

    const isPasswordUser = user?.providerData[0]?.providerId === "password";

    return (
        <div className="max-w-lg mx-auto p-10 bg-light-background dark:bg-dark-background rounded shadow text-light-text-primary dark:text-dark-text-primary">
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

            {/* Form for displayName and currency */}
            <form onSubmit={handleSave} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-dark-background"
                    placeholder="Your name"
                />

                <div className="relative">
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 w-full appearance-none p-2 rounded bg-white dark:bg-dark-background"
                    >
                        <option value="">Select currency</option>
                        {currencyOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Choose your avatar:</label>
                    <div className="flex space-x-4 overflow-x-auto prevent-sidebar-swipe">
                        {avatars.map((avatar) => (
                            <img
                                key={avatar}
                                src={`/avatars/${avatar}`}
                                alt={avatar}
                                onClick={() => setSelectedAvatar(avatar)}
                                className={`w-16 h-16 rounded-full cursor-pointer border-2 transition ${selectedAvatar === avatar
                                    ? "border-blue-500"
                                    : "border-transparent hover:border-gray-400"
                                    }`}
                            />
                        ))}
                    </div>
                </div>


                <button type="submit" className="bg-light-primary dark:bg-dark-primary text-white py-2 rounded hover:opacity-90 transition">
                    Save
                </button>

                {message && (
                    <p className="text-sm text-center mt-2 text-light-text-secondary dark:text-dark-text-secondary">
                        {message}
                    </p>
                )}
            </form>

            {/* Form to change email/password */}
            {isPasswordUser && (
                <>
                    <h3 className="text-xl font-semibold mt-8">Account credentials</h3>
                    <form onSubmit={handleCredentialsUpdate} className="flex flex-col space-y-4 mt-4">
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-dark-background"
                            placeholder="New email"
                        />

                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-dark-background pr-10"
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
                                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-dark-background pr-10"
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


                        <button type="submit" className="bg-light-primary dark:bg-dark-primary text-white py-2 rounded hover:opacity-90 transition">
                            Update Credentials
                        </button>

                        {authMessage && (
                            <p className="text-sm text-center mt-2 text-green-600 dark:text-green-400">
                                {authMessage}
                            </p>
                        )}
                        {authError && (
                            <p className="text-sm text-center mt-2 text-red-600 dark:text-red-400">
                                {authError}
                            </p>
                        )}

                    </form>
                </>
            )}
        </div>
    );
}
