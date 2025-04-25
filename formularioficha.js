import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
    import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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
    const db = getFirestore(app);
    const auth = getAuth(app);

    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUser = user;
          carregarFicha(); // ← aqui!
        } else {
          alert("Você precisa estar logado.");
        }
      });
      

    async function carregarFicha() {
        if (!currentUser) return;
      
        const docRef = doc(db, "ficha", currentUser.uid);
        const snapshot = await getDoc(docRef);
      
        const container = document.getElementById("ficha-salva");
      
        if (!snapshot.exists()) {
          container.innerHTML = "<p>Nenhuma ficha encontrada.</p>";
          return;
        }
      
        const ficha = snapshot.data();
      
        container.innerHTML = `
          <p><strong>Antecedente:</strong> ${ficha.antecedente}</p>
          <p><strong>Classe:</strong> ${ficha.classe}</p>
          <p><strong>Raça:</strong> ${ficha.raca}</p>
          <p><strong>Nível:</strong> ${ficha.nível}</p>
          <p><strong>Atributos:</strong> ${ficha.atributos.join(", ")}</p>
          <p><strong>Subclasse:</strong> ${ficha.sub_classe}</p>
          <p><strong>Subraça:</strong> ${ficha.sub_raca}</p>
          <p><strong>Perícias:</strong><br>
            ${ficha.pericias.map((p, i) => `Perícia ${i + 1}: ${p ? "✔️" : "❌"}`).join("<br>")}
          </p>
        `;
      }
      

    async function salvarFicha(e) {
      e.preventDefault();
      
      if (!currentUser) return alert("Usuário não autenticado");

      const atributos = Array.from(document.querySelectorAll('[name="atributo[]"]')).map(el => parseInt(el.value));
      const pericias = Array.from(document.querySelectorAll('[name="pericia[]"]')).map(el => el.checked);

      const ficha = {
        antecedente: document.getElementById("antecedente").value,
        atributos,
        classe: document.getElementById("classe").value,
        nível: parseInt(document.getElementById("nivel").value),
        pericias,
        raca: document.getElementById("raca").value,
        sub_classe: document.getElementById("sub_classe").value,
        sub_raca: document.getElementById("sub_raca").value
      };

      await setDoc(doc(db, "ficha", currentUser.uid), ficha);
      alert("Ficha salva com sucesso!");
    }

    window.salvarFicha = salvarFicha;