console.log("JavaScript loaded!");
//Slider
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
//card
async function loadProverbs() {
  const response = await fetch("proverbs.json");
  const data = await response.json();

  const container = document.querySelector(".card-wraper");
  container.innerHTML = ""; //Delete repeated card
  data.forEach((proverb) => {
    const card = document.createElement("a");
    card.href = "javascript:void(0)";
    card.className = "card relative group block p-2 h-full w-full";

    card.innerHTML = `
        <div class="card-main">
          <div class="card-inner">
            <div>
              <h3>${proverb.category?.toUpperCase() || "Category"}</h3>

              <p class="font dari-text">
                <strong>متن دری:</strong> ${proverb.textDari}
              </p>

              <p class="font pashto-text">
                <strong>متن پشتو:</strong> ${proverb.textPashto}
              </p>
              <hr />
              <p class="font english-text">
                <strong>English Translation:</strong> ${
                  proverb.translationEn || "N/A"
                }
              </p>

              <p class="font english-text">
                <strong>Meaning:</strong> ${proverb.meaning}
              </p>

              <!--Delete button-->
              <button class="custom-button" onclick="deleteProverb(${
                proverb.id
              })">
                <svg viewBox="0 0 448 512" class="custom-svgIcon">
                  <path d="M135.2 17.7L121.1 0h205.7l-14.1 17.7H135.2zM432 96H16v32h16l20.5 
                  368.5c1.1 19.5 17.2 35.5 36.7 35.5h273.7c19.5 0 35.6-16 36.7-35.5L416 
                  128h16V96zM192 416c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 
                  16-16s16 7.2 16 16v224zm96 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 
                  7.2-16 16-16s16 7.2 16 16v224z"/>
                </svg>
              </button>

              <!--Update button-->
              <button class="custom-cta" onclick="updateProverb(${proverb.id})">
                <span>Update</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5 M8,1 L12,5 L8,9" stroke="#fff" stroke-width="2" fill="none"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

    container.appendChild(card);
  });
}

loadProverbs();
