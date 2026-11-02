import { loadNotes, saveNotes } from "./storage.js";
import { validateNote, searchNotes } from "./notes.js";
import { renderNotes } from "./ui.js";

const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#note-title");
const textInput = document.querySelector("#note-text");
const searchInput = document.querySelector("#search");
const clearButton = document.querySelector("#clear");
const list = document.querySelector("#notes");
const message = document.querySelector("#message");

let notes = loadNotes();

function update() {
  renderNotes(searchNotes(notes, searchInput.value), list, deleteNote);
  if (!saveNotes(notes)) {
    message.textContent = "Не удалось сохранить заметки в браузере.";
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = titleInput.value;
  const text = textInput.value;
  const error = validateNote(title, text);

  if (error) {
    message.textContent = error;
    return;
  }

  notes.push({
    id: Date.now(),
    title: title.trim(),
    text: text.trim()
  });

  message.textContent = "Заметка добавлена.";
  form.reset();
  update();
});

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  message.textContent = "Заметка удалена.";
  update();
}

clearButton.addEventListener("click", () => {
  notes = [];
  message.textContent = "Заметки очищены.";
  update();
});

searchInput.addEventListener("input", update);
update();