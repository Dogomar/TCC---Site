// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkbq_aHTbQvB4kOOSaPih374adE3JPmKg",
  authDomain: "tcc---taverna-do-tarrasque.firebaseapp.com",
  projectId: "tcc---taverna-do-tarrasque",
  storageBucket: "tcc---taverna-do-tarrasque.firebasestorage.app",
  messagingSenderId: "891131598809",
  appId: "1:891131598809:web:ecc3903e7577c62a676bc8",
  measurementId: "G-3L8HGJE94N"
};

export const db = getFirestore(app);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const user = auth.currentUser;

function updateUserProfile(user) {
    const userName = user.displayName;
    const userEmail = user.email;
    const userProfilePicture = user.photoURL;
    console.log(userEmail)

    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userProfilePicture").src = userProfilePicture
}

onAuthStateChanged(auth, (user)=> {
    if (user) {
        updateUserProfile(user);
        const uid = user.uid;
        return uid;
    } else {
        alert("create account & login");
        window.location.href = "index.html"
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const profile = document.querySelector(".profile");
    const dropdown = document.getElementById("profileDropdown");

    profile.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    // Fecha o menu ao clicar fora
    document.addEventListener("click", () => {
        dropdown.style.display = "none";
    });
});

document.getElementById("botao-criar-ficha").addEventListener("click", criarFicha);

async function criarFicha() {
    try {
      const fichaRef = collection(db, "ficha");
      await addDoc(fichaRef, {
        antecedente: "",
        atributos: [0, 0, 0, 0, 0, 0],
        classe: "",
        nível: 0,
        pericias: Array(10).fill(false), // ou quantas você tiver
        raca: "",
        sub_classe: "",
        sub_raca: ""
      });
      alert("Ficha criada com sucesso!");
    } catch (e) {
      console.error("Erro ao criar ficha: ", e);
    }
  }