console.log("JavaScript loaded!");
const next = document.querySelector(".slider-next");
const prev = document.querySelector(".slider-prev");

next.addEventListener("click", () => {
  const cards = document.querySelectorAll(".slider-card");
  document.querySelector(".slider-track").appendChild(cards[0]);
});

prev.addEventListener("click", () => {
  const cards = document.querySelectorAll(".slider-card");
  document.querySelector(".slider-track").prepend(cards[cards.length - 1]);
});
