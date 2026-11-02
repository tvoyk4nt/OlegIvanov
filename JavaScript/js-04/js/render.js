export function renderBooks(books, listElement) {
 listElement.replaceChildren();
 for (const book of books) {
  const item = document.createElement("li"); item.className = book.read ? "book-item is-read" : "book-item"; item.dataset.id = book.id;
  const info = document.createElement("div"); info.className = "book-info";
  const title = document.createElement("p"); title.className = "book-title"; title.textContent = book.title;
  const meta = document.createElement("p"); meta.className = "book-meta"; meta.textContent = book.year ? `${book.author} · ${book.year}` : book.author;
  info.append(title, meta);
  const actions = document.createElement("div"); actions.className = "book-actions";
  const statusButton = document.createElement("button"); statusButton.type = "button"; statusButton.dataset.action = "toggle"; statusButton.textContent = book.read ? "Не прочитано" : "Прочитано";
  const deleteButton = document.createElement("button"); deleteButton.type = "button"; deleteButton.dataset.action = "delete"; deleteButton.className = "delete"; deleteButton.textContent = "Удалить";
  actions.append(statusButton, deleteButton); item.append(info, actions); listElement.append(item);
 }
}
export function renderStatus(message, statusElement) { statusElement.textContent = message; }
export function renderCount(count, countElement) { countElement.textContent = `Книг: ${count}`; }