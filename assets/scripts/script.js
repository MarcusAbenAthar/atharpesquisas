document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) {
    console.error(
      "Erro: Elementos .menu-toggle ou .nav-menu não encontrados no DOM."
    );
    return;
  }

  // Estiliza o menu para transição suave
  navMenu.style.overflow = "hidden";
  navMenu.style.transition =
    "transform 0.4s ease-in-out, opacity 0.4s ease-in-out";
  navMenu.style.transform = "translateY(-10px)";
  navMenu.style.opacity = "0";
  navMenu.style.display = "none";

  menuToggle.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      // Fecha suavemente
      navMenu.style.transform = "translateY(-10px)";
      navMenu.style.opacity = "0";
      setTimeout(() => {
        navMenu.style.display = "none";
      }, 400);
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
    } else {
      // Abre suavemente
      navMenu.style.display = "block";
      setTimeout(() => {
        navMenu.style.transform = "translateY(0)";
        navMenu.style.opacity = "1";
      }, 10);
      navMenu.classList.add("active");
      menuToggle.classList.add("active");
    }
  });

  // Ajusta exibição do menu para desktops
  function adjustMenu() {
    if (window.innerWidth > 768) {
      navMenu.style.display = "block";
      navMenu.style.opacity = "1";
      navMenu.style.transform = "translateY(0)";
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
    } else {
      if (!navMenu.classList.contains("active")) {
        navMenu.style.display = "none";
      }
    }
  }
  window.addEventListener("resize", adjustMenu);
  adjustMenu();

  // Configuração do EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init("service_65gqezr"); // Seu Service ID aqui
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

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (typeof emailjs !== "undefined") {
      emailjs
        .sendForm(
          "service_65gqezr", // Seu Service ID
          "template_t9zmt6i", // Seu Template ID
          this
        )
        .then(
          () => {
            feedbackMessage.textContent = "Mensagem enviada com sucesso!";
            feedbackMessage.style.color = "#003366";
            feedbackMessage.style.opacity = "1";
            contactForm.reset();
            setTimeout(() => {
              feedbackMessage.style.opacity = "0";
            }, 5000);
          },
          (error) => {
            feedbackMessage.textContent =
              "Erro ao enviar a mensagem. Tente novamente.";
            feedbackMessage.style.color = "#e06b00";
            feedbackMessage.style.opacity = "1";
            console.error("Erro no envio:", error);
          }
        );
    } else {
      console.error("EmailJS não está disponível para enviar o formulário.");
    }
  });
});
