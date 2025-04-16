document.addEventListener("DOMContentLoaded", () => {
  // === Menu Hambúrguer ===
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) {
    console.error("Erro: Elementos .menu-toggle ou .nav-menu não encontrados.");
    return;
  }

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
    navMenu.setAttribute("aria-expanded", navMenu.classList.contains("active"));
  });

  menuToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active");
    }
  });

  // Ajuste responsivo com debounce
  let resizeTimeout;
  function adjustMenu() {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustMenu, 100);
  });
  adjustMenu();

  // === Formulário de Contato ===
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) {
    console.error("Erro: Elemento #contact-form não encontrado.");
    return;
  }

  const feedbackMessage = document.querySelector(".feedback-message");
  const feedbackText = document.getElementById("feedback-text");
  const closeFeedback = document.querySelector(".close-feedback");

  closeFeedback.addEventListener("click", () => {
    feedbackMessage.style.display = "none";
  });

  // Preenchimento de códigos de país
  const countrySelect = document.getElementById("country-code");
  const cachedCountries = localStorage.getItem("countries");
  if (cachedCountries) {
    populateCountries(JSON.parse(cachedCountries));
  } else {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        localStorage.setItem("countries", JSON.stringify(data));
        populateCountries(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados dos países:", error);
        showError("Erro ao carregar os países.", feedbackText, feedbackMessage);
      });
  }

  function populateCountries(data) {
    data.forEach((country) => {
      const ddi =
        country.idd.root +
        (country.idd.suffixes && country.idd.suffixes[0]
          ? country.idd.suffixes[0]
          : "");
      const option = document.createElement("option");
      option.value = ddi;
      option.textContent = `${country.name.common} (${ddi})`;
      if (ddi === "+55") option.selected = true;
      countrySelect.appendChild(option);
    });
  }

  // Formatação de telefone
  const phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length >= 3) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length >= 8) {
      value = `${value.slice(0, 7)}-${value.slice(7)}`;
    }
    e.target.value = value;
  });

  // Validação do formulário e envio via WhatsApp
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const countryCode = countrySelect.value;
    const phoneValue = phoneInput.value;
    const messageInput = document.getElementById("message");

    // Limpar erros anteriores
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
      el.textContent = "";
    });

    let hasError = false;
    if (!nameInput.value.trim()) {
      showFieldError("name-error", "Por favor, informe seu nome.");
      hasError = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      showFieldError("email-error", "Por favor, informe um email válido.");
      hasError = true;
    }
    if (!subjectInput.value) {
      showFieldError("subject-error", "Por favor, selecione um assunto.");
      hasError = true;
    }
    if (!countryCode) {
      showFieldError("phone-error", "Selecione o código do país.");
      hasError = true;
    }
    if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(phoneValue)) {
      showFieldError("phone-error", "Use o formato (XX) XXXXX-XXXX.");
      hasError = true;
    }
    if (!messageInput.value.trim()) {
      showFieldError("message-error", "Por favor, escreva sua mensagem.");
      hasError = true;
    }

    if (hasError) return;

    // Construir mensagem para o WhatsApp
    const whatsappNumber = "+5519983023731";
    const message = `
      *Nova Mensagem de Contato - Athar Pesquisa*\n\n
      *Nome:* ${nameInput.value}\n
      *Email:* ${emailInput.value}\n
      *Assunto:* ${subjectInput.value}\n
      *Telefone:* ${countryCode} ${phoneValue}\n
      *Mensagem:* ${messageInput.value}
    `;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Redirecionar para o WhatsApp
    window.open(whatsappUrl, "_blank");

    // Exibir mensagem de sucesso
    showSuccess(
      "Redirecionando para o WhatsApp...",
      feedbackText,
      feedbackMessage
    );
    contactForm.reset();
    countrySelect.value = "+55";
  });

  function showFieldError(id, message) {
    const errorEl = document.getElementById(id);
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }

  function showSuccess(message, feedbackText, feedbackMessage) {
    feedbackText.textContent = message;
    feedbackMessage.style.display = "flex";
    feedbackMessage.setAttribute("role", "alert");
    setTimeout(() => {
      feedbackMessage.style.display = "none";
    }, 5000);
  }

  function showError(message, feedbackText, feedbackMessage) {
    feedbackText.textContent = message;
    feedbackMessage.style.display = "flex";
    feedbackMessage.setAttribute("role", "alert");
  }

  // === Carrossel da Galeria ===
  const carousel = document.querySelector(".gallery-carousel");
  if (carousel) {
    const carouselInner = carousel.querySelector(".carousel-inner");
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    let currentIndex = 0;
    const items = carouselInner.querySelectorAll(".gallery-item");
    const totalItems = items.length;

    function updateCarousel() {
      const offset = -currentIndex * 100;
      carouselInner.style.transform = `translateX(${offset}%)`;
      carousel.setAttribute(
        "aria-label",
        `Imagem ${currentIndex + 1} de ${totalItems}`
      );
    }

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    });

    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
      } else if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }
    });

    updateCarousel();
  }
});
