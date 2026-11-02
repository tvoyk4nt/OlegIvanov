import { createBook, filterBooks, sortBooks } from "./data.js";
import { saveBooks } from "./storage.js";
import { renderBooks, renderCount, renderStatus } from "./render.js";

export function initEvents(books, elements) {
 function updateView() {
  const filtered = filterBooks(books, elements.search.value, elements.filter.value);
  const visible = sortBooks(filtered, elements.sort.value);
  renderBooks(visible, elements.list);
  renderCount(books.length, elements.count);
  if (visible.length === 0) renderStatus(books.length === 0 ? "Пока книг нет. Добавьте первую." : "По заданным условиям ничего не найдено.", elements.status);
  else renderStatus(`Показано книг: ${visible.length}`, elements.status);
 }
 elements.form.addEventListener("submit", event => {
  event.preventDefault();
  const title = elements.title.value.trim(); const author = elements.author.value.trim(); const year = elements.year.value;
  if (!title || !author) { elements.message.textContent = "Заполните название и автора."; return; }
  if (year && (!Number.isInteger(Number(year)) || Number(year) < 0 || Number(year) > 2100)) { elements.message.textContent = "Укажите корректный год от 0 до 2100."; return; }
  books.push(createBook(title, author, year)); saveBooks(books); elements.form.reset(); elements.message.textContent = ""; updateView();
 });
 elements.list.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]"); if (!button) return;
  const item = button.closest(".book-item"); const id = Number(item.dataset.id);
  const index = books.findIndex(book => book.id === id); if (index === -1) return;
  if (button.dataset.action === "toggle") books[index].read = !books[index].read;
  else if (button.dataset.action === "delete") books.splice(index, 1);
  saveBooks(books); updateView();
 });
 elements.search.addEventListener("input", updateView);
 elements.filter.addEventListener("change", updateView);
 elements.sort.addEventListener("change", updateView);
 elements.clearRead.addEventListener("click", () => {
  const remaining = books.filter(book => !book.read); books.splice(0, books.length, ...remaining); saveBooks(books); updateView();
 });
 updateView();
}