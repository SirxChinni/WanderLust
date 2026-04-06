(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {

    // Submit validation
    form.addEventListener('submit', event => {

  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach(input => {
    if (input.checkValidity()) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
    }
  });

  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }

})

    // Real-time validation
    const inputs = form.querySelectorAll("input, textarea")

    inputs.forEach(input => {
      input.addEventListener("input", () => {
        if (input.checkValidity()) {
          input.classList.remove("is-invalid")
          input.classList.add("is-valid")
        } else {
          input.classList.remove("is-valid")
          input.classList.add("is-invalid")
        }
      })

      // 🔥 Fix for pre-filled edit form
      if (input.value.trim() !== "") {
        if (input.checkValidity()) {
          input.classList.add("is-valid")
        }
      }
    })

  })
})()