export function validateNote(title, text) {
  const cleanTitle = title.trim();
  const cleanText = text.trim();

  if (cleanTitle.length < 2 || cleanTitle.length > 60) {
    return "Название должно быть от 2 до 60 символов.";
  }
  if (cleanText.length < 1 || cleanText.length > 500) {
    return "Текст заметки должен быть от 1 до 500 символов.";
  }
  if (cleanText.length > 0 && cleanText.length < 3) {
    return "Текст заметки слишком короткий.";
  }
  return "";
}

export function searchNotes(notes, query) {
  const value = query.trim().toLowerCase();
  return notes.filter(note =>
    note.title.toLowerCase().includes(value) ||
    note.text.toLowerCase().includes(value)
  );
}