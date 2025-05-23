document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript loaded!");

  // Slider navigation
  const next = document.querySelector(".slider-next");
  const prev = document.querySelector(".slider-prev");

  if (next && prev) {
    next.addEventListener("click", () => {
      const cards = document.querySelectorAll(".slider-card");
      document.querySelector(".slider-track").appendChild(cards[0]);
    });

    prev.addEventListener("click", () => {
      const cards = document.querySelectorAll(".slider-card");
      document.querySelector(".slider-track").prepend(cards[cards.length - 1]);
    });
  }

  // Category button click
  document.querySelectorAll(".cat-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      // Redirect and add #proverbs to scroll to that section
      window.location.href = `/proverbs?category=${encodeURIComponent(
        category
      )}#proverbs`;
    });
  });

  // Smooth scroll
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("category")) {
    const target = document.getElementById("proverbs");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const updateButtons = document.querySelectorAll(".update-btn");
  const editModal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-form");
  const editCancelBtn = document.getElementById("edit-cancel");

  updateButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      if (!card) return;

      const id = card.getAttribute("data-id");
      const textDari = card.querySelector(".dari-text").textContent.trim();
      const textPashto = card.querySelector(".pashto-text").textContent.trim();
      const translationEn = card
        .querySelector(".english-text.translation")
        .textContent.trim();
      const meaning = card
        .querySelector(".english-text.meaning")
        .textContent.trim();
      const category = card.querySelector("h3").textContent.trim();

      document.getElementById("edit-id").value = id;
      document.getElementById("edit-textDari").value = textDari;
      document.getElementById("edit-textPashto").value = textPashto;
      document.getElementById("edit-translationEn").value = translationEn;
      document.getElementById("edit-meaning").value = meaning;
      document.getElementById("edit-category").value = category;

      editModal.style.display = "block";
    });
  });

  editCancelBtn.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const updatedProverb = {
      textDari: document.getElementById("edit-textDari").value,
      textPashto: document.getElementById("edit-textPashto").value,
      translationEn: document.getElementById("edit-translationEn").value,
      meaning: document.getElementById("edit-meaning").value,
      category: document.getElementById("edit-category").value,
    };

    try {
      const response = await fetch(`/proverbs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProverb),
      });

      if (response.ok) {
        alert("Proverb updated successfully.");
        window.location.reload();
      } else {
        alert("Error updating the proverb.");
      }
    } catch (error) {
      alert("Error sending the request.");
      console.error(error);
    }
  });
});
// update button
document.addEventListener("DOMContentLoaded", () => {
  const updateButtons = document.querySelectorAll(".card-update-btn");
  const editModal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-form");
  const editCancelBtn = document.getElementById("edit-cancel");

  updateButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      if (!card) return;

      const id = card.getAttribute("data-id");

      // Get values from spans inside the card
      const textDari =
        card.querySelector(".dari-text span")?.textContent.trim() || "";
      const textPashto =
        card.querySelector(".pashto-text span")?.textContent.trim() || "";
      const translationEn =
        card.querySelectorAll(".english-text span")[0]?.textContent.trim() ||
        "";
      const meaning =
        card.querySelectorAll(".english-text span")[1]?.textContent.trim() ||
        "";
      const category = card.querySelector("h3")?.textContent.trim() || "";

      // Populate form fields
      document.getElementById("edit-id").value = id;
      document.getElementById("edit-textDari").value = textDari;
      document.getElementById("edit-textPashto").value = textPashto;
      document.getElementById("edit-translationEn").value = translationEn;
      document.getElementById("edit-meaning").value = meaning;
      document.getElementById("edit-category").value = category;

      // Show modal
      editModal.style.display = "flex";
    });
  });

  editCancelBtn.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const data = {
      textDari: document.getElementById("edit-textDari").value,
      textPashto: document.getElementById("edit-textPashto").value,
      translationEn: document.getElementById("edit-translationEn").value,
      meaning: document.getElementById("edit-meaning").value,
      category: document.getElementById("edit-category").value,
    };

    fetch(`/proverbs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          location.reload();
        } else {
          alert("Failed to update proverb");
        }
      })
      .catch(() => alert("Failed to update proverb"));
  });
});
//add model
const openAddModal = document.getElementById("open-add-modal");
const addModal = document.getElementById("add-modal");
const addCancel = document.getElementById("add-cancel");

openAddModal.addEventListener("click", () => {
  addModal.style.display = "block";
});

addCancel.addEventListener("click", () => {
  addModal.style.display = "none";
});
document.getElementById("addProverbBtn").addEventListener("click", () => {
  const category = document.getElementById("newCategory").value.trim();
  const textDari = document.getElementById("newTextDari").value.trim();
  const textPashto = document.getElementById("newTextPashto").value.trim();
  const translationEn = document
    .getElementById("newTranslationEn")
    .value.trim();
  const meaning = document.getElementById("newMeaning").value.trim();

  if (!category || !textDari || !textPashto || !translationEn || !meaning) {
    alert("Please fill in all fields");
    return;
  }

  const newId = Date.now();

  const newCardHTML = `
  <a href="javascript:void(0)" class="card relative group block p-2 h-full w-full" data-id="${newId}">
    <div class="card-main">
      <div class="card-inner">
        <div>
          <h3>${category}</h3>

          <p class="font dari-text">
            <strong class="str_cat">متن دری:</strong>
            <span>${textDari}</span>
          </p>

          <p class="font pashto-text">
            <strong class="str_cat">متن پشتو:</strong>
            <span>${textPashto}</span>
          </p>

          <hr />
          <p class="font english-text">
            <strong class="str_cat">English Translation:</strong>
            <span>${translationEn}</span>
          </p>

          <p class="font english-text">
            <strong class="str_cat">Meaning:</strong>
            <span>${meaning}</span>
          </p>

          <div class="proverb-actions">
            <button class="custom-button card-delete-btn" title="Delete">
              <svg viewBox="0 0 448 512" class="custom-svgIcon">
                <path
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                ></path>
              </svg>
            </button>

            <button class="custom-cta card-update-btn">
              <span>Update</span>
              <svg width="15px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </a>
`;

  const cardWrapper = document.querySelector(".card-wrapper");
  if (cardWrapper) {
    cardWrapper.insertAdjacentHTML("beforeend", newCardHTML);
  }

  // Clear inputs
  document.getElementById("newCategory").value = "";
  document.getElementById("newTextDari").value = "";
  document.getElementById("newTextPashto").value = "";
  document.getElementById("newTranslationEn").value = "";
  document.getElementById("newMeaning").value = "";
});
