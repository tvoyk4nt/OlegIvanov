import { Game, GameCollection } from "./model.js";
import { loadGames, saveGames } from "./storage.js";
import { renderGames } from "./ui.js";

const form = document.querySelector("#game-form");
const titleInput = document.querySelector("#title");
const genreInput = document.querySelector("#genre");
const statusInput = document.querySelector("#status");
const searchInput = document.querySelector("#search");
const filterInput = document.querySelector("#filter");
const list = document.querySelector("#game-list");
const message = document.querySelector("#message");

const collection = new GameCollection(loadGames().map(item =>
  new Game(item.title, item.genre, item.status, item.id)
));

function getVisibleGames() {
  const searched = collection.findByTitle(searchInput.value.trim());
  return filterInput.value === "all"
    ? searched
    : searched.filter(game => game.status === filterInput.value);
}

function update() {
  renderGames(getVisibleGames(), list, changeStatus, removeGame);
  saveGames(collection.games);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const genre = genreInput.value.trim();

  if (title.length < 2) {
    message.textContent = "Название должно содержать минимум 2 символа.";
    return;
  }
  if (genre.length < 2) {
    message.textContent = "Укажите жанр (минимум 2 символа).";
    return;
  }

  try {
    collection.add(new Game(title, genre, statusInput.value));
    message.textContent = "Игра добавлена.";
    form.reset();
    update();
  } catch (error) {
    message.textContent = error.message;
  }
});

function changeStatus(id) {
  const game = collection.games.find(item => item.id === id);
  if (!game) return;
  const statuses = ["В планах", "Играю", "Пройдена"];
  game.changeStatus(statuses[(statuses.indexOf(game.status) + 1) % statuses.length]);
  message.textContent = "Статус изменён.";
  update();
}

function removeGame(id) {
  collection.remove(id);
  message.textContent = "Игра удалена.";
  update();
}

searchInput.addEventListener("input", update);
filterInput.addEventListener("change", update);
update();