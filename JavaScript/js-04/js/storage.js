import { STORAGE_KEY } from "./data.js";
export function loadBooks() {
 const savedText = localStorage.getItem(STORAGE_KEY);
 if (savedText === null) return [];
 try {
  const savedBooks = JSON.parse(savedText);
  if (!Array.isArray(savedBooks)) return [];
  return savedBooks.filter(book => book && typeof book.id === "number" && typeof book.title === "string" && typeof book.author === "string" && typeof book.read === "boolean");
 } catch (error) { console.error("Не удалось прочитать сохранённые книги:", error); return []; }
}
export function saveBooks(books) {
 try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); return true; }
 catch (error) { console.error("Не удалось сохранить книги:", error); return false; }
}