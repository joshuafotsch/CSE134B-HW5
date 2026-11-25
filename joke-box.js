const FALLBACK_JOKES = [
  "You know what's stupid? A stupid joke", // I came up with this when I was like 10 and thought it was hilarious haha
  "Why don't skeletons fight each other? They don't have the guts.",
];
const DETAILS_KEY = "hw5-joke-box-details";
const detailsButton = document.querySelector("#joke-details");

class JokeBox extends HTMLElement {
  connectedCallback() {
    this.jokeIndex = 0;

    const heading = document.createElement("h3");
    heading.textContent = "Dad Joke Generator";

    this.jokeText = document.createElement("p");
    this.jokeText.className = "joke";

    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.textContent = "Next joke";

    this.status = document.createElement("p");
    this.status.className = "status";
    this.status.setAttribute("role", "status");

    this.button.addEventListener("click", () => {
      this.loadJoke();
    });

    this.appendChild(heading);
    this.appendChild(this.jokeText);
    this.appendChild(this.button);
    this.appendChild(this.status);

    this.loadJoke();
    this.updateDetails();
  }

  static get observedAttributes() {
    return ["detailed"];
  }

  attributeChangedCallback() {
    this.updateDetails();
  }

  updateDetails() {
    if (!this.status) return;
    this.status.hidden = !this.hasAttribute("detailed");
  }

  async loadJoke() {
    try {
      this.jokeText.textContent = "Loading Joke";
      this.status.textContent = "Awaiting Response";
      // await sleep(1);
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();

      if (typeof data?.joke !== "string") {
        throw new Error("Expected a joke in the response.");
      }

      this.jokeText.textContent = data.joke;
      this.status.textContent = `This joke was fetched from an API. It returned with status code: ${response.status}`;
    } catch (error) {
      console.error("Failed to get joke.", error);

      if (this.jokeIndex >= FALLBACK_JOKES.length) {
        this.jokeIndex = 0;
      }
      this.jokeText.textContent = FALLBACK_JOKES[this.jokeIndex++];
      this.status.textContent = `The API call failed ;(. This joke is from a backup list. It is backup joke #${this.jokeIndex}. Try the api again by pressing "Next joke"`;
    }
  }
}

customElements.define("joke-box", JokeBox);

function readDetailsPref() {
  try {
    const saved = localStorage.getItem(DETAILS_KEY);
    if (saved === "shown" || saved === "hidden") return saved;
  } catch (err) {
    console.warn("Could not read details preference:", err);
  }
  return "shown"; // default
}

function saveDetailsPref(value) {
  try {
    localStorage.setItem(DETAILS_KEY, value);
  } catch (err) {
    console.warn("Could not save details preference:", err);
  }
}

const jokeBox = document.querySelector("joke-box");

function toggleJokeDetails() {
  const shown = jokeBox.toggleAttribute("detailed");
  detailsButton.setAttribute("aria-pressed", String(shown));
  saveDetailsPref(shown ? "shown" : "hidden");
}

if (jokeBox && detailsButton) {
  detailsButton.removeAttribute("hidden"); // unhides it when js is enables

  const shown = jokeBox.toggleAttribute(
    "detailed",
    readDetailsPref() === "shown",
  );
  detailsButton.setAttribute("aria-pressed", String(shown));
  detailsButton.addEventListener("click", toggleJokeDetails);
}
