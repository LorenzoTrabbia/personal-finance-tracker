import React from "react";
import ReactDOM from "react-dom/client";
import FirebaseSetupMessage from "./FirebaseSetupMessage";
import { isFirebaseConfigured } from "./firebaseConfig";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

if (isFirebaseConfigured) {
    import("./AppRoot").then(({ default: AppRoot }) => {
        root.render(
            <React.StrictMode>
                <AppRoot />
            </React.StrictMode>
        );
    });
} else {
    root.render(
        <React.StrictMode>
            <FirebaseSetupMessage />
        </React.StrictMode>
    );
}
