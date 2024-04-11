import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat-container");

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const hexRandom = Math.random().toString(16);
  return `id-${timestamp}-${hexRandom}`;
}

function chatSection(isAi, text, id) {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" />
        </div>
        <div class="message" id=${id}>${text}</div>
      </div>
    </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  chatContainer.innerHTML += chatSection(false, data.get("prompt"));

  form.reset();

  const id = generateUniqueId();
  chatContainer.innerHTML += chatSection(true, " ", id);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(id);

  loader(messageDiv);

  //fetch data from server
  const response = await fetch("http://localhost:5000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: data.get("prompt") }),
  });
  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    typeText(messageDiv, data.bot.trim());
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "An error occurred. Please try again later.";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});
