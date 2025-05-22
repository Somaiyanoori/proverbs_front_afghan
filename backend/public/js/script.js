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

  // Smooth scroll to #proverbs if category is selected
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

      // گرفتن داده‌ها از کارت
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

      // مقداردهی به فرم
      document.getElementById("edit-id").value = id;
      document.getElementById("edit-textDari").value = textDari;
      document.getElementById("edit-textPashto").value = textPashto;
      document.getElementById("edit-translationEn").value = translationEn;
      document.getElementById("edit-meaning").value = meaning;
      document.getElementById("edit-category").value = category;

      // نمایش فرم
      editModal.style.display = "block";
    });
  });

  // بستن فرم با دکمه لغو
  editCancelBtn.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  // ارسال فرم و درخواست PUT به سرور
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
        alert("ضرب‌المثل با موفقیت به‌روزرسانی شد.");
        window.location.reload(); // رفرش صفحه برای مشاهده تغییرات
      } else {
        alert("خطا در به‌روزرسانی ضرب‌المثل.");
      }
    } catch (error) {
      alert("خطا در ارسال درخواست.");
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
