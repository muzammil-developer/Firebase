import {
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import { db, auth } from "./firebase.config.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(
                doc(db, "users", user.uid)
            );
            if (userDoc.exists()) {
                const userData = userDoc.data();
                document.getElementById("greeting-text").innerText =
                    `Welcome, ${userData.username}!`;
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
});

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText === "") {
        return;
    }

    if (todoList.innerText === "No todos added yet.") {
        todoList.innerHTML = "";
    }

    const li = document.createElement("li");
    li.className =
        "list-group-item d-flex justify-content-between align-items-center";
    const span = document.createElement("span");
    span.innerText = todoText;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "btn btn-sm btn-danger";
    deleteButton.addEventListener("click", () => {
        li.remove();
        if (todoList.children.length === 0) {
            todoList.innerHTML = `
            <li class="list-group-item text-secondary text-center">
                No todos added yet.
            </li>
        `;
        }
    });
    li.appendChild(span);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
    todoInput.value = "";
});
