import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Reemplaza con tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAfemilUuhj1qnoU1pcJ_9A7cxlq-NUzf0",
  authDomain: "garage-bar.firebaseapp.com",
  projectId: "garage-bar",
  storageBucket: "garage-bar.firebasestorage.app",
  messagingSenderId: "215355618298",
  appId: "1:215355618298:web:eeee77976440bb7de82a43"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportar db para usar en script.js
export { db };