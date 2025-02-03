document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("welcome-modal");
    const closeButton = document.querySelector(".close-button");
    const registerButton = document.getElementById("register-now");
  
    // verify if it's the first time visiting the site
    if (!localStorage.getItem("visitedBefore")) {
      modal.style.display = "flex";  
    }
  
    // Close the modal clicking the "x"
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";  // Hide the modal
      localStorage.setItem("visitedBefore", "true");
    });
  
    registerButton.addEventListener("click", () => {
        modal.style.display = "none";  // Hide the modal
        localStorage.setItem("visitedBefore", "true");
      
        //redirect to newsletter form
        window.location.href = "#newsletter"; 
    });
  });
  