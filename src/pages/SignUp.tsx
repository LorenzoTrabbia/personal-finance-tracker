import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase"; // db = Firestore instance
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Crea documento utente in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: null,
                createdAt: new Date(),
            });

            navigate("/"); // redirect alla dashboard dopo registrazione
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Salva nel Firestore solo se è un nuovo utente
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                email: user.email,
                displayName: user.displayName || null,
                createdAt: new Date(),
            }, { merge: true }); // merge: true per non sovrascrivere se già esiste

            navigate("/");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                >
                    Sign Up
                </button>
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                    Continua con Google
                </button>
                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-indigo-600 hover:underline">
                        Log In
                    </a>
                </p>
            </form>
        </div>
    );
}
