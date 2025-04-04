document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) {
    console.error(
      "Erro: Elementos .menu-toggle ou .nav-menu não encontrados no DOM."
    );
    return;
  }

  navMenu.style.overflow = "hidden";
  navMenu.style.transition =
    "transform 0.4s ease-in-out, opacity 0.4s ease-in-out";
  navMenu.style.transform = "translateY(-10px)";
  navMenu.style.opacity = "0";
  navMenu.style.display = "none";

  menuToggle.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      navMenu.style.transform = "translateY(-10px)";
      navMenu.style.opacity = "0";
      setTimeout(() => {
        navMenu.style.display = "none";
      }, 400);
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
    } else {
      navMenu.style.display = "block";
      setTimeout(() => {
        navMenu.style.transform = "translateY(0)";
        navMenu.style.opacity = "1";
      }, 10);
      navMenu.classList.add("active");
      menuToggle.classList.add("active");
    }
  });

  function adjustMenu() {
    if (window.innerWidth > 768) {
      navMenu.style.display = "block";
      navMenu.style.opacity = "1";
      navMenu.style.transform = "translateY(0)";
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
    } else if (!navMenu.classList.contains("active")) {
      navMenu.style.display = "none";
    }
  }
  window.addEventListener("resize", adjustMenu);
  adjustMenu();

  if (typeof emailjs !== "undefined") {
    emailjs.init("xShCb4UKljnF5chi0");
  } else {
    console.warn("EmailJS não foi carregado corretamente.");
  }

  const contactForm = document.getElementById("contact-form");
  if (!contactForm) {
    console.error("Erro: Elemento #contact-form não encontrado no DOM.");
    return;
  }

  const feedbackMessage = document.createElement("p");
  feedbackMessage.style.marginTop = "1rem";
  feedbackMessage.style.fontWeight = "bold";
  feedbackMessage.style.transition = "opacity 0.5s ease-in-out";
  contactForm.appendChild(feedbackMessage);

  // Buscar apenas nome e DDI da API restcountries
  const countrySelect = document.getElementById("country-code");
  fetch("https://restcountries.com/v3.1/all?fields=name,idd")
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Ordenar por nome
      data.forEach((country) => {
        const ddi =
          country.idd.root +
          (country.idd.suffixes && country.idd.suffixes[0]
            ? country.idd.suffixes[0]
            : "");
        const option = document.createElement("option");
        option.value = ddi;
        option.textContent = `${country.name.common} (${ddi})`;
        countrySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar dados dos países:", error);
      feedbackMessage.textContent =
        "Erro ao carregar os países. Tente novamente mais tarde.";
      feedbackMessage.style.color = "#e06b00";
      feedbackMessage.style.opacity = "1";
    });

  const phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove não dígitos
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    if (value.length >= 3) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length >= 8) {
      value = `${value.slice(0, 7)}-${value.slice(7)}`;
    }

    e.target.value = value;
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const countryCode = countrySelect.value;
    const phoneValue = phoneInput.value;
    const fullPhone = `${countryCode} ${phoneValue}`;

    if (!countryCode) {
      feedbackMessage.textContent = "Selecione o código do país.";
      feedbackMessage.style.color = "#e06b00";
      feedbackMessage.style.opacity = "1";
      return;
    }

    if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(phoneValue)) {
      feedbackMessage.textContent =
        "Telefone inválido. Use o formato (XX) XXXXX-XXXX.";
      feedbackMessage.style.color = "#e06b00";
      feedbackMessage.style.opacity = "1";
      return;
    }

    if (typeof emailjs !== "undefined") {
      emailjs
        .sendForm("service_65gqezr", "template_t9zmt6i", this)
        .then(() => {
          feedbackMessage.textContent = "Mensagem enviada com sucesso!";
          feedbackMessage.style.color = "#003366";
          feedbackMessage.style.opacity = "1";
          contactForm.reset();
          setTimeout(() => {
            feedbackMessage.style.opacity = "0";
          }, 5000);
        })
        .catch((error) => {
          feedbackMessage.textContent =
            "Erro ao enviar a mensagem. Tente novamente.";
          feedbackMessage.style.color = "#e06b00";
          feedbackMessage.style.opacity = "1";
          console.error("Erro no envio:", error);
        });
    } else {
      console.error("EmailJS não está disponível para enviar o formulário.");
    }
  });
});
