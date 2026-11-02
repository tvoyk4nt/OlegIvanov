export function renderNotes(notes, list, onDelete) {
  list.replaceChildren();

  if (notes.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Заметок нет";
    list.append(empty);
    return;
  }

  notes.forEach(note => {
    const item = document.createElement("li");
    item.className = "note";
    const title = document.createElement("h2");
    const text = document.createElement("p");
    const button = document.createElement("button");

    // Пользовательские данные вставляются только как текст.
    title.textContent = note.title;
    text.textContent = note.text;
    button.type = "button";
    button.textContent = "Удалить";
    button.addEventListener("click", () => onDelete(note.id));

    item.append(title, text, button);
    list.append(item);
  });
}