import { auth, db } from "./firebase.config.js";
import {
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
let isAuthenticating = false;
onAuthStateChanged(auth, (user) => {
    if (isAuthenticating) return;
    const currentPage = window.location.pathname;
    const isDashboard = currentPage.endsWith("/dashboard.html");
    if (user) {
        if (!isDashboard) {
            window.location.href = "./dashboard.html";
        }
    } else {
        if (isDashboard) {
            window.location.href = "./login.html";
        }
    }
});

const showMessage = (message) => {
    const messageBox = document.getElementById("auth-message");
    if (messageBox) {
        messageBox.innerHTML = `
            <div class="alert alert-danger py-2">
                ${message}
            </div>
        `;
    }
};

const login = async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const button = document.getElementById("login-button");
    try {
        button.disabled = true;
        button.innerText = "Logging in...";
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "./dashboard.html";
    } catch (error) {
        showMessage(error.message);
        button.disabled = false;
        button.innerText = "Login";
    }
};

const register = async (e) => {
    e.preventDefault();
    const username = document
        .getElementById("register-username")
        .value.trim();
    const email = document
        .getElementById("register-email")
        .value.trim();
    const password = document
        .getElementById("register-password")
        .value;
    const button = document.getElementById("register-button");
    try {
        isAuthenticating = true;
        button.disabled = true;
        button.innerText = "Creating Account...";
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: user.email,
            uid: user.uid
        });
        window.location.href = "./dashboard.html";
    } catch (error) {
        showMessage(error.message);
        button.disabled = false;
        button.innerText = "Create Account";
    } finally {
        isAuthenticating = false;
    }
};

const logout = async () => {
    try {
        await signOut(auth);
        window.location.href = "./login.html";
    } catch (error) {
        console.log(error.message);
    }
};

document
    .getElementById("login-form")
    ?.addEventListener("submit", login);

document
    .getElementById("register-form")
    ?.addEventListener("submit", register);

document
    .getElementById("logout")
    ?.addEventListener("click", logout);

