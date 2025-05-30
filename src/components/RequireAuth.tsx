import { type ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

interface Props {
    children: ReactNode;
}

export default function RequireAuth({ children }: Props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
}
