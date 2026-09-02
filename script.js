const info = document.getElementById("product-info");
document.querySelectorAll(".detail-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.dataset.product;
    const messages = {
      Spaghetti: "🍝 Spaghetti CAROVAL — bentuk panjang & ramping. Coba dengan saus tomat, bolognese, atau tumisan sayur.",
      Penne: "🥕 Penne CAROVAL — bentuk pendek berongga. Cocok untuk saus yang lebih kental dan baked pasta.",
      Fusilli: "✨ Fusilli CAROVAL — bentuk spiral yang seru. Enak untuk salad pasta atau saus creamy."
    };
    info.textContent = messages[product];
    info.scrollIntoView({behavior:"smooth", block:"center"});
  });
});

const questions = [
  {q:"Ampas wortel pada CAROVAL dimanfaatkan untuk menjadi...", a:["Bahan pasta","Bahan bakar kendaraan","Minuman bersoda"], c:0},
  {q:"Salah satu konsep utama CAROVAL adalah...", a:["Pemanfaatan pangan","Membuang bahan sisa","Menggunakan plastik sekali pakai"], c:0},
  {q:"Bentuk pasta yang panjang dan ramping adalah...", a:["Spaghetti","Penne","Fusilli"], c:0}
];
let qi=0, score=0;
const question=document.getElementById("question"), answers=document.getElementById("answers");
const result=document.getElementById("quiz-result"), next=document.getElementById("next-btn");

function renderQuiz(){
  const item=questions[qi]; question.textContent=item.q; answers.innerHTML="";
  result.textContent=""; next.classList.add("hidden");
  item.a.forEach((text,i)=>{
    const b=document.createElement("button"); b.textContent=text;
    b.onclick=()=>answer(i,b); answers.appendChild(b);
  });
}
function answer(i,b){
  [...answers.children].forEach(x=>x.disabled=true);
  const correct=questions[qi].c===i;
  b.classList.add(correct?"correct":"wrong");
  if(correct){score++;result.textContent="🎉 Benar! Kamu keren!";}
  else result.textContent="💡 Belum tepat. Yuk kenalan lagi sama CAROVAL!";
  next.textContent=qi===questions.length-1?"Lihat skor →":"Pertanyaan berikutnya →";
  next.classList.remove("hidden");
}
next.onclick=()=>{
  if(qi<questions.length-1){qi++;renderQuiz();}
  else{question.textContent=`Skor kamu: ${score}/${questions.length} 🌟`;answers.innerHTML="";result.textContent="Makasih sudah main!";next.textContent="Ulangi quiz";next.classList.remove("hidden");next.onclick=()=>{qi=0;score=0;renderQuiz();};}
};
renderQuiz();

document.querySelector(".menu-btn").onclick=()=>document.querySelector("nav").classList.toggle("mobile-show");
