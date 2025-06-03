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
  },
  {
    question: "食品過期了該怎麼辦？",
    options: ["聞聞看", "加熱後吃", "丟掉", "吃一口試試"],
    answer: 2
  },
  {
    question: "生熟食應如何放置？",
    options: ["放一起省空間", "熟食放上層，生食放下層", "沒差", "生食放上層"],
    answer: 1
  },
  {
    question: "何種包裝方式可延長保存？",
    options: ["真空包裝", "裸裝", "鋁箔包", "塑膠袋"],
    answer: 0
  },
  {
    question: "下列哪個不是食物中毒原因？",
    options: ["食物未煮熟", "吃太多", "交叉污染", "保存不當"],
    answer: 1
  }
];

let current = 0;
let score = 0;
let user = null;

const qBox = document.getElementById("questionBox");
const oBox = document.getElementById("optionsBox");
const scoreSpan = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

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
}

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

onAuthStateChanged(auth, (u) => {
  if (u) {
    user = u;
    showQuestion();
  } else {
    window.location.href = "index.html";
  }
});
