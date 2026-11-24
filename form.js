// Field Elements
const nameField = document.querySelector("#name");
const emailField = document.querySelector("#email");
const commentField = document.querySelector("#comments");

const formElement = document.querySelector("form");
const formErrorsField = document.querySelector('input[name="form-errors"]');

// Error history: one entry per invalid field per failed submit attempt
const form_errors = [];

// Helper functions
function validateEmail(element) {
  if (!element.validity.typeMismatch) return "";
  let errorString = "";

  const splitEmail = element.value.split("@");
  const numOfAts = splitEmail.length - 1;
  if (numOfAts === 0) {
    errorString += `- @ symbol missing\n`;
  } else if (numOfAts > 1) {
    return (errorString += `- @ symbol occurs more than once\n`);
  }

  if (splitEmail[numOfAts] === "") {
    errorString += "- Domain missing. eg: gmail.com, verizon.net, etc...\n";
  }

  if (!errorString) {
    errorString = "- Enter an email like name@example.com\n";
  }

  return errorString;
}

function validateLength(element) {
  let errorString = "";

  if (element.validity.tooShort) {
    errorString += `- At least ${element.minLength} characters\n`;
  }
  return errorString;
}

// Gets error message based off of validity
function getErrorMessage(element) {
  if (element.validity.valueMissing === true) {
    return `- input is required\n`;
  }
  let errorString = "";

  errorString += validateLength(element);

  if (element.type === "email") {
    errorString += validateEmail(element);
  }
  return errorString;
}

// populates the error elements on screen
function displayValidate(element) {
  element.setCustomValidity("");
  let errorElement = document.querySelector(`#${element.id}-error`);
  const errorMessage = getErrorMessage(element);

  if (errorMessage) {
    errorElement.removeAttribute("hidden");
    errorElement.textContent = errorMessage;
    element.setCustomValidity(errorMessage);
  } else {
    errorElement.textContent = "";
  }
}

// toggles if the chars remaining should be shown
function toggleCharsRemaining(element, isShown) {
  const elementInfo = document.querySelector(`#${element.id}-info .char-limit`);
  elementInfo.setAttribute("hidden", "");
  elementInfo.classList.remove("low");

  if (!isShown) return;

  let charCount = element.maxLength - element.value.length;
  let displayString = `${charCount} Characters remaining`;
  if (charCount <= 0.1 * element.maxLength) {
    elementInfo.classList.add("low");
    displayString = "Only " + displayString + "!";
  }
  if (charCount === 0) {
    displayString = "Out of Characters";
  }

  elementInfo.textContent = displayString;
  elementInfo.removeAttribute("hidden");
}

// Logger: records which field failed and why (never the user's input)
function logInvalidAttempts(element) {
  // displayValidate may have just cleared a stale custom error
  if (element.validity.valid) return;

  let error = "unknown";
  if (element.validity.valueMissing) {
    error = "valueMissing";
  } else if (element.validity.typeMismatch) {
    error = "typeMismatch";
  } else if (element.validity.tooShort) {
    error = "tooShort";
  } else if (element.validity.customError) {
    error = element.validationMessage; // our own message, no user data
  }

  form_errors.push({
    field: element.name,
    error: error,
    time: new Date().toISOString(),
  });
}

// Event Handlers
nameField.addEventListener("focusin", function () {
  toggleCharsRemaining(this, true); // shows char count
});

nameField.addEventListener("input", function () {
  toggleCharsRemaining(this, true); // updates char count
});

nameField.addEventListener("change", function () {
  displayValidate(this); // displays errors if any
});

nameField.addEventListener("focusout", function () {
  toggleCharsRemaining(this, false); // hides char count
});

commentField.addEventListener("focusin", function () {
  toggleCharsRemaining(this, true); // show char count
});
commentField.addEventListener("input", function () {
  toggleCharsRemaining(this, true); // show char count

  // if error showing check if fixed
  const errorElement = document.querySelector(`#${this.id}-error`);
  if (errorElement.textContent) {
    displayValidate(this);
  }
});

commentField.addEventListener("change", function () {
  displayValidate(this);
});
commentField.addEventListener("focusout", function () {
  toggleCharsRemaining(this, false);
});

emailField.addEventListener("change", function () {
  displayValidate(this); // display errors if any
});

emailField.addEventListener("input", function () {
  // if error showing check if fixed
  const errorElement = document.querySelector(`#${this.id}-error`);
  if (errorElement.textContent) {
    displayValidate(this);
  }
});

formElement.addEventListener(
  "invalid",
  (e) => {
    displayValidate(e.target); // show the error on the page
    logInvalidAttempts(e.target); // record it in the history
  },
  true, // capture: invalid doesn't bubble
);

// Only fires once every field is valid, right before the POST
formElement.addEventListener("submit", () => {
  formErrorsField.value = JSON.stringify(form_errors);
});
