import { auth } from "./firebase-config.js";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    alert("登入失敗：" + error.message);
  }
};

// 如果已登入，自動導向 game.html
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "game.html";
  }
});
