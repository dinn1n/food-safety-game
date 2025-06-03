import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const questions = [
  {
    question: "哪個需要冷藏？",
    options: ["餅乾", "牛奶", "糖果", "洋芋片"],
    answer: 1
  },
  {
    question: "吃壞肚子常因？",
    options: ["細菌", "電磁波", "塑膠", "辣味"],
    answer: 0
  }
];

let current = 0;
let score = 0;
let user = null;

let qBox, oBox, scoreSpan, nextBtn, submitBtn;

function showQuestion() {
  const q = questions[current];
  qBox.textContent = q.question;
  oBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (i === q.answer) {
        alert("答對了！");
        score++;
        scoreSpan.textContent = score;
      } else {
        alert("答錯了！");
      }
      nextBtn.style.display = "inline";
      Array.from(oBox.children).forEach(b => b.disabled = true);
    };
    oBox.appendChild(btn);
  });
  nextBtn.style.display = "none";
  submitBtn.style.display = "none";
}

onAuthStateChanged(auth, (u) => {
  if (u) {
    user = u;

    // 確保 DOM 元素抓取在登入確認後
    qBox = document.getElementById("questionBox");
    oBox = document.getElementById("optionsBox");
    scoreSpan = document.getElementById("score");
    nextBtn = document.getElementById("nextBtn");
    submitBtn = document.getElementById("submitBtn");

    showQuestion();

    nextBtn.onclick = () => {
      current++;
      if (current < questions.length) {
        showQuestion();
      } else {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline";
        qBox.textContent = "🎉 遊戲完成！請提交分數";
        oBox.innerHTML = "";
      }
    };

    submitBtn.onclick = async () => {
      if (user) {
        await addDoc(collection(db, "scores"), {
          uid: user.uid,
          name: user.displayName,
          score: score,
          time: new Date()
        });
        alert("分數已儲存！");
      } else {
        alert("未登入，無法儲存");
      }
    };

  } else {
    window.location.href = "index.html";
  }
});
