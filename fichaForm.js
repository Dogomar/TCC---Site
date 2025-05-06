import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


// Firebase config (mesmo que nos outros arquivos)
const firebaseConfig = {
  apiKey: "AIzaSyBkbq_aHTbQvB4kOOSaPih374adE3JPmKg",
  authDomain: "tcc---taverna-do-tarrasque.firebaseapp.com",
  projectId: "tcc---taverna-do-tarrasque",
  storageBucket: "tcc---taverna-do-tarrasque.firebasestorage.app",
  messagingSenderId: "891131598809",
  appId: "1:891131598809:web:ecc3903e7577c62a676bc8",
  measurementId: "G-3L8HGJE94N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Mostrar/esconder formulário
document.getElementById('botao-criar-ficha').addEventListener('click', () => {
  const container = document.getElementById('form-container');
  container.style.display = container.style.display === 'none' ? 'block' : 'none';
});

// Enviar ficha
document.getElementById('novaFichaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Usuário não autenticado.");
    return;
  }

  const nome = document.getElementById('nome').value;
  const raca = document.getElementById('raca').value;

  try {
    await addDoc(collection(db, "ficha"), {
      nome: nome,
      raça: raca,
      uid: user.uid,
      timestamp: serverTimestamp()
    });
    alert("Ficha criada com sucesso!");
    document.getElementById("novaFichaForm").reset();
  } catch (err) {
    console.error("Erro ao criar ficha:", err);
    alert("Erro ao criar ficha.");
  }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
      // Habilite botão, mostre nome, etc.
      document.getElementById("userName").textContent = user.displayName || "Usuário";
      document.getElementById("userEmail").textContent = user.email;
      document.getElementById("userProfilePicture").src = user.photoURL || "default.png";
    } else {
      console.warn("Usuário não autenticado");
    }
  });

document.getElementById('myCreation').addEventListener('click', async (e) => {
      e.preventDefault();
      console.log("Usuário atual:", auth.currentUser);
  
      const user = auth.currentUser;
      if (!user) return alert("Usuário não autenticado.");
  
      const fichasRef = collection(db, "ficha");
      const q = query(fichasRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      const lista = document.getElementById("lista-fichas");
      lista.innerHTML = ""; // limpa
  
      if (querySnapshot.empty) {
        lista.innerHTML = "<li>Nenhuma ficha encontrada.</li>";
      } else {
        querySnapshot.forEach((doc) => {
          const ficha = doc.data();
          lista.innerHTML += `<ul><li><strong>${ficha.nome}</strong></li> <li>Raça: ${ficha.raça}</li></ul><br>`;
        });
      }
  
    // document.getElementById("minhas-criacoes-container").style.display = "block";
    const container = document.getElementById("minhas-criacoes-container");
    container.style.display = container.style.display === "none" ? "block" : "none";

  });
