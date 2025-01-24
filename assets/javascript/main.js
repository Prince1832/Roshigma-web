// Get elements from the DOM
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu-container");
const dropdowns = document.querySelectorAll(".dropdown > div");
const subDropdowns = document.querySelectorAll(".sub-dropdown > div");

// Toggle variable
let menuOpen = false;

// Set click event to menu button
menuBtn.addEventListener("click", () => {
  // Toggle mega menu show class
  menu.classList.toggle("mega-menu-show");
  // If the menu open variable is false
  if (menuOpen === false) {
    // Set the close icon to the menu button
    menuBtn.innerHTML = `
        <img class="menu-btn" src="/images/hamburger.svg" alt="hamburger">
        `;
    // Set menu open to true
    menuOpen = true;
  } else {
    // Set the menu icon to the menu button
    menuBtn.innerHTML = `
        <img class="menu-btn" src="/images/hamburger.svg" alt="hamburger">
        `;
    // Set menu open to false
    menuOpen = false;
  }
});

// Select all dropdowns
dropdowns.forEach((dropdown) => {
  // Add click event
  dropdown.addEventListener("click", (e) => {
    // Toggle dropdown menu show class
    dropdown.nextElementSibling.classList.toggle("menu-show");
    // Toggle icon rotated class
    dropdown.lastElementChild.classList.toggle("icon-rotated");
  });
});

// Select all sub dropdowns
subDropdowns.forEach((subDropdown) => {
  // Add click event
  subDropdown.addEventListener("click", (e) => {
    // Toggle sub dropdown menu show class
    subDropdown.nextElementSibling.classList.toggle("sub-menu-show");
    // Toggle icon rotated class
    subDropdown.lastElementChild.classList.toggle("icon-rotated");
  });
});

// disabling inspect element
// document.addEventListener("contextmenu", function (e) {
//     e.preventDefault(); //this prevents right click
// });
document.onkeydown = function (e) {
  if (event.keycode == 123) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.keyCode == "S".charCodeAt(0)) {
    return false;
  }
};

function setActiveTab(clickedTab) {
  // Remove 'nav-active' class from all tabs
  var tabs = document.querySelectorAll(".mega-menu a");
  tabs.forEach(function (tab) {
    tab.classList.remove("nav-active");
  });

  // Add 'nav-active' class to the clicked tab
  clickedTab.classList.add("nav-active");
}

function progressBarScroll() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop,
    height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight,
    scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";
}

window.onscroll = function () {
  progressBarScroll();
};

// ! Form validation
function validateName(formId) {
  var nameInput = document.querySelector(`#${formId} #name`);
  var nameError = document.querySelector(`#${formId} #nameError`);
  var name = nameInput.value;
  nameInput.classList.remove("error-border");
  nameError.innerHTML = "";

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    nameInput.classList.add("error-border");
    nameError.innerHTML = "Please enter a valid name";
    return false;
  }
  return true;
}

function validatePhone(formId) {
  var phoneInput = document.querySelector(`#${formId} #phone`);
  var phoneError = document.querySelector(`#${formId} #phoneError`);
  var phone = phoneInput.value;

  phoneInput.classList.remove("error-border");
  phoneError.innerHTML = "";

  if (phone.length < 10 || phone.length > 12) {
    phoneInput.classList.add("error-border");
    phoneError.innerHTML = "Enter valid number (10 to 12 digits)";
    return false;
  }
  return true;
}

function validateEmail(formId) {
  var emailInput = document.querySelector(`#${formId} #email`);
  var emailError = document.querySelector(`#${formId} #emailError`);
  var email = emailInput.value;

  emailInput.classList.remove("error-border");
  emailError.innerHTML = "";

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailInput.classList.add("error-border");
    emailError.innerHTML = "Please enter a valid email address";
    return false;
  }
  return true;
}

function validateFile(formId) {
  var fileInput = document.querySelector(`#${formId} #resume`);
  var fileError = document.querySelector(`#${formId} #fileError`);
  var file = fileInput.files[0];

  fileError.innerHTML = "";

  if (!file) {
    fileError.innerHTML = "Please select a file";
    fileInput.classList.add("error-border");
    return false;
  }

  var fileType = file.type;

  if (
    fileType === "application/pdf" ||
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    fileError.innerHTML = "";
    fileInput.classList.remove("error-border");
    return true;
  } else {
    fileError.innerHTML = "Please select a PDF, DOC, or DOCX file";
    fileInput.classList.add("error-border");
    return false;
  }
}

function handleFormSubmit(event, formId) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const submitBtn = document.querySelector(`#${formId} .submit-btn`);
  submitBtn.disabled = true;
  const formAction = form.getAttribute("action");
  if (formId == "careerForm") {
    result =
      validateEmail(formId) &&
      validatePhone(formId) &&
      validateName(formId) &&
      validateFile(formId);
  } else {
    result =
      validateEmail(formId) && validatePhone(formId) && validateName(formId);
  }
  if (result) {
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6LfOISgqAAAAAD_8sXe_G-cjHyLQdA-hA5dWXDgv", {
          action: "submit",
        })
        .then(function (token) {
          const formData = new FormData(form);
          formData.append("token", token);
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `${formAction}`, true);
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // Form submitted successfully, redirect to thank you page
                submitBtn.disabled = false;
                window.location.href = "/thank-you"; // Redirect to the thank you page
              } else {
                const mess = document.querySelector(`#${formId} .form-message`);
                mess.textContent = xhr.responseText;
                mess.style.display = "block";
                mess.style.color = "red";
                submitBtn.disabled = false;
              }
            }
          };
          xhr.send(new URLSearchParams(formData));
        });
    });
  } else {
    const mess = document.querySelector(`#${formId} .form-message`);
    mess.textContent =
      "Fill all the fields properly before submitting the form";
    mess.style.display = "block";
    mess.style.color = "red";
    submitBtn.disabled = false;
  }
}

// contact valicationend

// ! Back to top
document.addEventListener("DOMContentLoaded", function () {
  var backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      // Show back-to-top button when user scrolls down 300px
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling behavior
    });
  });
});

// ! Back to top



