document.addEventListener("DOMContentLoaded", () => {
  // Toggle do menu hamburger
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) {
    console.error(
      "Erro: Elementos .menu-toggle ou .nav-menu não encontrados no DOM."
    );
    return;
  }

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Configuração do EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init("SUA_EMAILJS_USER_ID_AQUI"); // Substitua pelo seu User ID do EmailJS
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
  contactForm.appendChild(feedbackMessage);

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (typeof emailjs !== "undefined") {
      emailjs
        .sendForm(
          "SUA_EMAILJS_SERVICE_ID_AQUI", // Substitua pelo seu Service ID
          "SUA_EMAILJS_TEMPLATE_ID_AQUI", // Substitua pelo seu Template ID
          this
        )
        .then(
          () => {
            feedbackMessage.textContent = "Mensagem enviada com sucesso!";
            feedbackMessage.style.color = "#003366";
            contactForm.reset();
            setTimeout(() => (feedbackMessage.textContent = ""), 5000);
          },
          (error) => {
            feedbackMessage.textContent =
              "Erro ao enviar a mensagem. Tente novamente.";
            feedbackMessage.style.color = "#e06b00";
            console.error("Erro no envio:", error);
          }
        );
    } else {
      console.error("EmailJS não está disponível para enviar o formulário.");
    }
  });
});
