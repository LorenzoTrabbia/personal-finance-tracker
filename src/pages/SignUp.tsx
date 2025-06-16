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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-800 text-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors p-3 rounded-lg font-medium"
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full bg-red-500 hover:bg-red-600 transition-colors p-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" viewBox="-3.2 -3.2 38.40 38.40" data-name="Layer 1" id="Layer_1" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#ffffff"></path><path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#ffffff"></path><path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffffff"></path><polygon fill="#ffffff" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"></polygon><path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ffffff"></path><polygon fill="#ffffff" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"></polygon><path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#ffffff"></path></g></svg>
                        <span>Continue with Google</span>
                    </button>
                </form>
                <p className="text-sm text-center mt-4 text-gray-400">
                    Already have an account?{" "}
                    <a href="/login" className="text-indigo-400 hover:underline">
                        Log In
                    </a>
                </p>
            </div>
        </div>
    );
}
