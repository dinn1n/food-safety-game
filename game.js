import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 題庫：共 6 題
const questionBank = [
  {
    question: "哪個需要冷藏？",
    options: ["餅乾", "牛奶", "糖果", "洋芋片"],
    answer: 1
  },
  {
    question: "吃壞肚子常因？",
    options: ["細菌", "電磁波", "塑膠", "辣味"],
    answer: 0
  },
  {
    question: "生食應注意什麼？",
    options: ["新鮮度", "大小", "顏色", "包裝"],
    answer: 0
  },
  {
    question: "過期食品應該？",
    options: ["繼續吃", "丟棄", "煮熟就好", "給別人"],
    answer: 1
  },
  {
    question: "什麼不是食安標章？",
    options: ["HACCP", "GMP", "ISO", "UPS"],
    answer: 3
  },
  {
    question: "開封後牛奶要在幾天內喝完？",
    options: ["7 天", "1 天", "3 天", "10 天"],
    answer: 2
  }
];

// 隨機選 4 題
function getRandomQuestions(arr, n) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

let questions = getRandomQuestions(questionBank, 4);
let current = 0;
let score = 0;
let user = null;

// DOM 元素
const qBox = document.getElementById("questionBox");
const oBox = document.getElementById("optionsBox");
const scoreSpan = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

// 音效
const correctAudio = new Audio("correct.mp3");

// 顯示題目
function showQuestion() {
  const q = questions[current];
  qBox.textContent = `第 ${current + 1} 題：${q.question}`;
  oBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (i === q.answer) {
        score++;
        scoreSpan.textContent = score;
        correctAudio.play();
        btn.classList.add("correct-flash");
      } else {
        alert("答錯了！");
      }

      Array.from(oBox.children).forEach(b => b.disabled = true);
      nextBtn.style.display = "inline";
    };
    oBox.appendChild(btn);
  });

  nextBtn.style.display = "none";
}

nextBtn.onclick = () => {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    qBox.textContent = "🎉 遊戲完成！請提交分數";
    oBox.innerHTML = "";
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline";
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

// 登入狀態監聽
onAuthStateChanged(auth, (u) => {
  if (u) {
    user = u;
    showQuestion();
  } else {
    window.location.href = "index.html";
  }
});
