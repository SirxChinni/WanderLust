(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {

    const ratingInputs = form.querySelectorAll("input[name='review[rating]']");
    const ratingError = form.querySelector("#ratingError");

    form.addEventListener('submit', event => {

      let ratingSelected = false;

      // ⭐ Check rating manually
      ratingInputs.forEach(input => {
        if (input.checked) ratingSelected = true;
      });

      // ⭐ Handle rating error
      if (!ratingSelected) {
        event.preventDefault();
        event.stopPropagation();

        if (ratingError) ratingError.style.display = "block";
      } else {
        if (ratingError) ratingError.style.display = "none";
      }

      // 💬 Validate textarea + inputs
      const inputs = form.querySelectorAll("textarea, input");

      inputs.forEach(input => {
        if (input.type !== "radio") {
          if (input.checkValidity()) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
          } else {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
          }
        }
      });

      // 🚨 Final blocking condition
      if (!form.checkValidity() || !ratingSelected) {
        event.preventDefault();
        event.stopPropagation();
      }

      // 🔥 THIS WAS MISSING
      form.classList.add("was-validated");

    });

    // 💬 Real-time textarea validation
    const textarea = form.querySelector("textarea");

    if (textarea) {
      textarea.addEventListener("input", () => {
        if (textarea.checkValidity()) {
          textarea.classList.remove("is-invalid");
          textarea.classList.add("is-valid");
        } else {
          textarea.classList.remove("is-valid");
          textarea.classList.add("is-invalid");
        }
      });
    }

    // ⭐ Real-time star fix
    ratingInputs.forEach(input => {
      input.addEventListener("change", () => {
        if (ratingError) ratingError.style.display = "none";
      });
    });

  });
})();