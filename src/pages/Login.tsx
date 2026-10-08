import { useState } from "react";
import {
    browserLocalPersistence,
    browserSessionPersistence,
    GoogleAuthProvider,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { Chrome, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getFirebaseErrorMessage } from "../utils/getFirebaseErrorMessage";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err: unknown) {
            setError(getFirebaseErrorMessage(err, "We couldn't sign you in. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setIsSubmitting(true);
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            const user = result.user;
            const userRef = doc(db, "users", user.uid);
            if (!(await getDoc(userRef)).exists()) {
                await setDoc(userRef, { email: user.email, displayName: user.displayName || null, createdAt: new Date() });
            }
            navigate("/");
        } catch (err: unknown) {
            setError(getFirebaseErrorMessage(err, "We couldn't sign you in with Google. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-light-background px-5 py-6 text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary sm:px-8 lg:p-10">
            <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-3xl border border-light-border bg-light-card shadow-xl shadow-slate-900/5 dark:border-dark-border dark:bg-dark-card lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative hidden overflow-hidden bg-dark-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
                    <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
                    <div className="relative">
                        <div className="mb-16 flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-400 p-2 text-dark-primary"><Sparkles className="h-5 w-5" /></div>
                            <span className="font-semibold tracking-tight">Personal Finance</span>
                        </div>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Your money, clarified</p>
                        <h1 className="max-w-md text-5xl font-semibold leading-[1.05] tracking-tight">A calmer way to understand your finances.</h1>
                        <p className="mt-6 max-w-md text-base leading-7 text-slate-300">Track everyday activity, spot spending patterns, and keep your financial picture in one place.</p>
                    </div>
                    <div className="relative grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><ShieldCheck className="mb-5 h-5 w-5 text-emerald-300" /><p className="text-sm text-slate-300">Private by design</p></div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Wallet className="mb-5 h-5 w-5 text-emerald-300" /><p className="text-sm text-slate-300">Clear view of your money</p></div>
                    </div>
                </section>
                <section className="flex items-center p-6 sm:p-12 lg:p-16">
                    <div className="w-full max-w-md">
                        <div className="mb-10 lg:hidden"><p className="text-lg font-semibold">Personal Finance</p><p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">Your money, clarified.</p></div>
                        <div className="mb-8"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-light-positive-value">Welcome back</p><h2 className="text-3xl font-semibold tracking-tight">Sign in to your account</h2><p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">Continue where you left off.</p></div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div><label htmlFor="email" className="mb-2 block text-sm font-medium">Email address</label><input id="email" type="email" autoComplete="email" placeholder="you@email.com" className="h-12 w-full rounded-xl border border-light-border bg-light-background px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-dark-border dark:bg-dark-background" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
                            <div><label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label><div className="relative"><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" className="h-12 w-full rounded-xl border border-light-border bg-light-background px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-dark-border dark:bg-dark-background" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:text-light-text-primary dark:hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                            <label className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary"><input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="h-4 w-4 accent-emerald-600" />Remember me</label>
                            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
                            <button type="submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-light-primary font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-dark-primary dark:hover:bg-emerald-400">{isSubmitting ? "Signing in..." : "Sign in"}{!isSubmitting && <ArrowRight className="h-4 w-4" />}</button>
                            <div className="flex items-center gap-3 py-1 text-xs text-light-text-secondary dark:text-dark-text-secondary"><span className="h-px flex-1 bg-light-border dark:bg-dark-border" />OR<span className="h-px flex-1 bg-light-border dark:bg-dark-border" /></div>
                            <button type="button" onClick={handleGoogleLogin} disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-light-border bg-light-card font-medium transition hover:bg-light-background disabled:opacity-60 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-background"><Chrome className="h-4 w-4" />Continue with Google</button>
                        </form>
                        <p className="mt-8 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">Don't have an account? <a href="/signup" className="font-semibold text-light-positive-value hover:underline">Create one</a></p>
                    </div>
                </section>
            </div>
        </main>
    );
}
