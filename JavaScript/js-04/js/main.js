import { loadBooks } from "./storage.js";
import { initEvents } from "./events.js";

const elements = {
 form: document.querySelector("#book-form"),
 title: document.querySelector("#title"),
 author: document.querySelector("#author"),
 year: document.querySelector("#year"),
 message: document.querySelector("#form-message"),
 search: document.querySelector("#search"),
 filter: document.querySelector("#filter"),
 sort: document.querySelector("#sort"),
 list: document.querySelector("#book-list"),
 status: document.querySelector("#status"),
 count: document.querySelector("#book-count"),
 clearRead: document.querySelector("#clear-read")
};

const books = loadBooks();
initEvents(books, elements);